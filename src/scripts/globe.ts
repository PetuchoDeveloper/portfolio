// Evidence globe engine. Every tile has three poses (shard, sphere, strip/scatter);
// a pose is position + quaternion + scale, and each frame blends between them.
type V3 = [number, number, number];
type Q = [number, number, number, number];

const D2R = Math.PI / 180;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const outExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

const qAxis = (x: number, y: number, z: number, deg: number): Q => {
  const h = deg * D2R * 0.5;
  const s = Math.sin(h);
  return [x * s, y * s, z * s, Math.cos(h)];
};
const qMul = (a: Q, b: Q): Q => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
];
const qRot = (q: Q, v: V3): V3 => {
  const [x, y, z, w] = q;
  const tx = 2 * (y * v[2] - z * v[1]);
  const ty = 2 * (z * v[0] - x * v[2]);
  const tz = 2 * (x * v[1] - y * v[0]);
  return [v[0] + w * tx + (y * tz - z * ty), v[1] + w * ty + (z * tx - x * tz), v[2] + w * tz + (x * ty - y * tx)];
};
const qSlerp = (a: Q, b: Q, t: number): Q => {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const s = d < 0 ? -1 : 1;
  d *= s;
  let wa = 1 - t;
  let wb = t * s;
  if (d < 0.9995) {
    const th = Math.acos(d);
    const sn = Math.sin(th);
    wa = Math.sin((1 - t) * th) / sn;
    wb = (Math.sin(t * th) / sn) * s;
  }
  const q: Q = [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb, a[2] * wa + b[2] * wb, a[3] * wa + b[3] * wb];
  const n = Math.hypot(...q);
  return [q[0] / n, q[1] / n, q[2] / n, q[3] / n];
};
const css = (p: V3, q: Q, s: number) => {
  const [x, y, z, w] = q;
  const f = (n: number) => n.toFixed(4);
  return `matrix3d(${f((1 - 2 * (y * y + z * z)) * s)},${f(2 * (x * y + z * w) * s)},${f(2 * (x * z - y * w) * s)},0,${f(2 * (x * y - z * w) * s)},${f((1 - 2 * (x * x + z * z)) * s)},${f(2 * (y * z + x * w) * s)},0,${f(2 * (x * z + y * w) * s)},${f(2 * (y * z - x * w) * s)},${f((1 - 2 * (x * x + y * y)) * s)},0,${f(p[0])},${f(p[1])},${f(p[2])},1)`;
};

interface Tile {
  el: HTMLElement;
  lon: number;
  lat: number;
  card: number;
  r: number;
  shard: V3;
  shardQ: Q;
  tumble: Q;
  shown: boolean;
}

const TILE_W = 112;
const TIMELINE = {
  copyOut: [0, 0.14],
  center: [0.02, 0.28],
  head: [0.33, 0.42],
} as const;
// Scroll covers the timeline only up to the landed strip (P 0.5); from there the carousel moves the files.
const SPAN = 0.5;
const LANDED = 0.44;
// Autoplay: one file every AUTO_EVERY s while idle; any carousel input pauses it for AUTO_RESUME s.
const AUTO_EVERY = 4.5;
const AUTO_RESUME = 6;

export function mountGlobe(scene: HTMLElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const pin = scene.querySelector<HTMLElement>('.scene-pin');
  const stage = scene.querySelector<HTMLElement>('[data-globe]');
  const list = scene.querySelector<HTMLElement>('[data-cards]');
  const copy = scene.querySelector<HTMLElement>('[data-hero-copy]');
  const head = scene.querySelector<HTMLElement>('[data-work-head]');
  const caseLine = scene.querySelector<HTMLElement>('[data-case-line]');
  const hint = scene.querySelector<HTMLElement>('.globe-hint');
  const nav = scene.querySelector<HTMLElement>('[data-carousel-nav]');
  if (!pin || !stage || !list || !copy || !head || !nav) return;
  const bars = [...nav.querySelectorAll<HTMLButtonElement>('[data-go]')];
  const status = nav.querySelector<HTMLElement>('[data-carousel-status]');
  const play = nav.querySelector<HTMLButtonElement>('[data-play]');

  let seed = 0x5eed;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const make = (el: HTMLElement, card: number): Tile => {
    const axis: V3 = [rnd() - 0.5, rnd() - 0.5, rnd() - 0.5];
    const n = Math.hypot(...axis);
    return {
      el,
      card,
      lon: parseFloat(el.style.getPropertyValue('--lon')),
      lat: parseFloat(el.style.getPropertyValue('--lat')),
      r: rnd(),
      shard: [260 + rnd() * 620, (rnd() - 0.5) * 520, (rnd() - 0.3) * 700],
      shardQ: qAxis(axis[0] / n, axis[1] / n, axis[2] / n, 90 + rnd() * 140),
      tumble: qAxis(rnd() - 0.5, 1, rnd() - 0.5, (rnd() - 0.5) * 220),
      shown: true,
    };
  };
  const tiles = [
    ...[...scene.querySelectorAll<HTMLElement>('[data-tile]:not([data-cardslot])')].map((el) => make(el, -1)),
    ...[...list.querySelectorAll<HTMLElement>('[data-card]')].map((el, i) => make(el, i)),
  ];
  const cards = tiles.filter((t) => t.card >= 0);
  const n = cards.length;
  const wrap = (v: number) => ((v % n) + n) % n;
  scene.classList.add('is-live');

  // ---------- layout ----------
  let vw = 0, vh = 0, mobile = false, R = 280, k = 1, cardW = 400, gap = 28, Rc = 2000, x0 = 0, lo = 0, stripY = 0, dist = 1;
  let heroC: V3 = [0, 0, 0];
  const layout = () => {
    vw = pin.clientWidth;
    vh = pin.clientHeight;
    mobile = vw < 861;
    R = mobile ? clamp(Math.min(vw * 0.36, vh * 0.25), 110, 170) : clamp(Math.min(vw * 0.2, vh * 0.34), 170, 300);
    k = R / 280;
    cardW = mobile ? Math.min(vw * 0.78, 340) : clamp(vw * 0.34, 300, 540);
    gap = mobile ? 16 : 28;
    Rc = mobile ? 1100 : 2200;
    scene.style.setProperty('--card-w', `${cardW}px`);
    const margin = mobile ? 0 : Math.max(20, (vw - 1180) / 2);
    // Phones centre the current file; desktop aligns it with the heading. The wrap seam (lo) sits off screen.
    x0 = mobile ? 0 : -vw / 2 + margin + cardW / 2;
    lo = mobile ? -n / 2 : -1.5;
    // The strip and its controls share the room under the heading, centred in it.
    const cardH = (list.querySelector<HTMLElement>('[data-card]')?.offsetHeight ?? cardW * 0.75);
    const headBottom = head.offsetTop + head.offsetHeight;
    const navH = nav.offsetHeight + 16;
    stripY = headBottom + Math.max(16, (vh - headBottom - cardH - navH) / 2) + cardH / 2 - vh / 2;
    scene.style.setProperty('--strip-y', `${stripY.toFixed(1)}px`);
    const copyBottom = copy.offsetTop + copy.offsetHeight;
    heroC = mobile ? [0, Math.max(copyBottom + R * 1.02 + 8, vh - R - 64) - vh / 2, 0] : [vw * 0.23, vh * 0.03, 0];
    scene.style.setProperty('--travel', mobile ? '170svh' : '140svh');
    dist = Math.max(1, scene.offsetHeight - pin.offsetHeight);
  };

  // ---------- state ----------
  let yaw = -24, pitch = -14, vYaw = 0, pitchAim = -14;
  let dragging = false, lastX = 0, lastY = 0, lastT = 0;
  // Carousel offset in cards, unbounded: `swipe` follows the pointer, then eases to `swipeAim`.
  let swipe = 0, swipeAim = 0, swiping = false, swiped = false, sX = 0, s0 = 0, sV = 0, sT = 0, current = -1;
  // Autoplay state: hover and focus on the files hold it; the pause button stops it until play.
  let autoT = 0, lastInput = -Infinity, hovering = false, focused = false, stopped = false, autoOn = false;
  const touch = () => { lastInput = performance.now(); };
  const born = performance.now();
  let prev = born;
  let running = false;
  let raf = 0;

  const progress = () => clamp((pin.getBoundingClientRect().top - scene.getBoundingClientRect().top) / dist) * SPAN;
  // Slot of file i on the drum, wrapped into [lo, lo + n) so the strip loops.
  const slot = (i: number, o: number) => wrap(i - o - lo) + lo;
  const stripPose = (d: number): [V3, Q] => {
    const x = d * (cardW + gap) + x0;
    const th = x / Rc;
    return [[Rc * Math.sin(th), stripY, Rc * (Math.cos(th) - 1)], qAxis(0, 1, 0, th / D2R)];
  };
  const show = (i: number) => {
    current = i;
    bars.forEach((b, j) => (j === i ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
    if (status && list.classList.contains('is-on')) status.textContent = bars[i]?.getAttribute('aria-label') ?? '';
  };
  // Go to file i the short way round.
  const goToFile = (i: number) => {
    let d = wrap(i - Math.round(swipeAim));
    if (d > n / 2) d -= n;
    swipeAim = Math.round(swipeAim) + d;
  };

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    const age = (now - born) / 1000;
    const P = progress();

    // Sphere spin: autorotate + inertia, frozen once the search starts.
    const live = 1 - range(P, 0.02, 0.07);
    if (!dragging) {
      yaw += (5 * dt + vYaw) * live;
      vYaw *= 0.94 ** (dt * 60);
      pitch += (pitchAim - pitch) * Math.min(1, dt * 3);
    }

    const m = inOut(range(P, TIMELINE.center[0], TIMELINE.center[1]));
    const center = lerp3(heroC, [0, stripY, 0], m);
    const qPitch = qAxis(1, 0, 0, pitch);
    if (!swiping) swipe += (swipeAim - swipe) * Math.min(1, dt * 9);
    const o = swipe;
    let flat = 0;

    for (const t of tiles) {
      const isCard = t.card >= 0;
      const qs = qMul(qMul(qPitch, qAxis(0, 1, 0, yaw + t.lon)), qAxis(1, 0, 0, -t.lat));
      const rel = qRot(qs, [0, 0, R]);
      const facing = rel[2] / R;
      const xs = (rel[0] / R + 1) / 2;

      // QED-style assembly: shards sweep in left to right.
      const a = outExpo(clamp((age - 0.15 - xs * 0.85 - t.r * 0.25) / 1.1));
      let p = add3(center, rel);
      let q = qs;
      let s = isCard ? (k * TILE_W) / cardW : k;
      let alpha = (0.42 + 0.58 * clamp(facing * 1.4)) * clamp(a * 1.6);
      if (a < 1) {
        p = add3(p, [t.shard[0] * k * (1 - a), t.shard[1] * k * (1 - a), t.shard[2] * (1 - a)]);
        q = qSlerp(qMul(t.shardQ, qs), qs, a);
      }

      if (isCard) {
        const u = inOut(range(P, 0.1 + t.card * 0.03, 0.28 + t.card * 0.03));
        const d = slot(t.card, o);
        if (u > 0) {
          const [sp, sq] = stripPose(d);
          p = lerp3(p, sp, u);
          p[2] += Math.sin(Math.PI * u) * 380;
          q = qSlerp(q, sq, u);
          s = lerp(s, 1, u);
          // A file fades out just before it jumps across the wrap seam (only visible on very wide screens).
          alpha = lerp(alpha, clamp(Math.min(d - lo, lo + n - d) / 0.45), u);
        }
        if (u > 0.98) flat++;
        t.el.classList.toggle('is-flat', u > 0.98);
        if (t.card === 0) t.el.classList.toggle('is-found', u > 0.995 && Math.abs(d) < 1.4);
      } else {
        const u = range(P, 0.05 + xs * 0.14 + t.r * 0.04, 0.21 + xs * 0.14 + t.r * 0.04);
        if (u >= 1) {
          if (t.shown) { t.el.style.visibility = 'hidden'; t.shown = false; }
          continue;
        }
        if (!t.shown) { t.el.style.visibility = ''; t.shown = true; }
        if (u > 0) {
          const e = u * u;
          p = add3(center, [rel[0] * (1 + 2.4 * e), rel[1] * (1 + 2.4 * e), rel[2] + 1100 * e * (0.4 + t.r)]);
          q = qSlerp(q, qMul(t.tumble, qs), e);
          alpha *= (1 - u) ** 1.5;
        }
      }
      t.el.style.transform = css(p, q, s);
      t.el.style.opacity = alpha.toFixed(3);
    }

    const out = range(P, TIMELINE.copyOut[0], TIMELINE.copyOut[1]);
    copy.style.transform = `translate3d(0, ${(-out * 70).toFixed(1)}px, 0)`;
    copy.style.opacity = (1 - out).toFixed(3);
    copy.style.visibility = out >= 1 ? 'hidden' : '';
    if (caseLine) caseLine.style.opacity = (1 - out).toFixed(3);
    if (hint) hint.style.opacity = (1 - range(P, 0, 0.05)).toFixed(3);
    const h = range(P, TIMELINE.head[0], TIMELINE.head[1]);
    head.style.opacity = h.toFixed(3);
    head.style.transform = `translate3d(0, ${((1 - h) * 24).toFixed(1)}px, 0)`;
    head.classList.toggle('is-on', h > 0.5);
    list.classList.toggle('is-on', flat === n);
    nav.classList.toggle('is-on', flat === n);
    const auto = flat === n && !stopped && !hovering && !focused && !swiping && now - lastInput > AUTO_RESUME * 1000;
    if (auto !== autoOn) {
      autoOn = auto;
      autoT = 0;
      // A moving carousel does not announce each file; a still one does.
      status?.setAttribute('aria-live', auto ? 'off' : 'polite');
    }
    if (auto && (autoT += dt) >= AUTO_EVERY) {
      autoT = 0;
      swipeAim = Math.round(swipeAim) + 1;
    }
    nav.style.setProperty('--auto', auto ? (autoT / AUTO_EVERY).toFixed(3) : '1');
    const at = wrap(Math.round(swipe));
    if (at !== current) show(at);

    if (running) raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (running) return;
    running = true;
    prev = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
    raf = 0;
  };

  // ---------- input ----------
  stage.addEventListener('pointerdown', (e) => {
    if (progress() > 0.03) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    lastT = performance.now();
    vYaw = 0;
    stage.setPointerCapture(e.pointerId);
    stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) {
      if (e.pointerType === 'mouse') pitchAim = -14 + ((e.clientY / innerHeight) - 0.5) * -10;
      return;
    }
    const now = performance.now();
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    yaw += dx * 0.32;
    pitch = clamp(pitch - dy * 0.22, -42, 24);
    pitchAim = pitch;
    vYaw = (dx * 0.32 * 16) / Math.max(8, now - lastT);
    lastX = e.clientX;
    lastY = e.clientY;
    lastT = now;
  });
  const release = () => {
    dragging = false;
    stage.classList.remove('is-dragging');
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  // Carousel: drag or swipe the landed strip sideways; vertical touch moves stay native scroll (touch-action: pan-y).
  list.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    touch();
    swiping = true;
    swiped = false;
    sX = e.clientX;
    s0 = swipe;
    sV = 0;
    sT = performance.now();
  });
  list.addEventListener('pointermove', (e) => {
    if (!swiping) return;
    const dx = e.clientX - sX;
    if (!swiped && Math.abs(dx) < 8) return;
    if (!swiped) { swiped = true; list.setPointerCapture(e.pointerId); list.classList.add('is-dragging'); }
    const now = performance.now();
    const next = s0 - dx / (cardW + gap);
    sV = (next - swipe) / Math.max(8, now - sT);
    sT = now;
    swipe = next;
  });
  const settle = () => {
    if (!swiping) return;
    touch();
    swiping = false;
    list.classList.remove('is-dragging');
    // A flick carries on to the next file; a slow drag snaps to the nearest one.
    if (swiped) swipeAim = Math.round(swipe + clamp(sV * 180, -1, 1));
  };
  list.addEventListener('pointerup', settle);
  list.addEventListener('pointercancel', settle);
  // A drag must not open the file under the pointer; keyboard clicks (detail 0) always pass.
  list.addEventListener('click', (e) => { if (swiped && e.detail) { e.preventDefault(); e.stopPropagation(); } }, true);
  list.addEventListener('dragstart', (e) => e.preventDefault());
  // Trackpads: a sideways two-finger swipe moves the strip, then it snaps.
  let wheelT = 0;
  list.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    touch();
    swiping = true;
    swipe += e.deltaX / (cardW + gap);
    clearTimeout(wheelT);
    wheelT = window.setTimeout(() => { swiping = false; swipeAim = Math.round(swipe); }, 140);
  }, { passive: false });
  nav.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (!b) return;
    if (b === play) {
      stopped = !stopped;
      lastInput = -Infinity;
      nav.classList.toggle('is-stopped', stopped);
      play.setAttribute('aria-label', (stopped ? play.dataset.playLabel : play.dataset.pauseLabel) ?? '');
      return;
    }
    touch();
    if (b.dataset.step) swipeAim = Math.round(swipeAim) + Number(b.dataset.step);
    else goToFile(Number(b.dataset.go));
  });
  // Hover or keyboard focus on the files holds the autoplay; it resumes after AUTO_RESUME s of idle.
  list.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hovering = true; });
  list.addEventListener('pointerleave', () => { if (hovering) { hovering = false; touch(); } });
  list.addEventListener('focusout', (e) => {
    if (list.contains(e.relatedTarget as Node | null)) return;
    focused = false;
    touch();
  });

  // Keyboard: focusing a file lands the search and turns the strip to it; arrow keys move between files.
  const goTo = (P: number) => {
    const stick = parseFloat(getComputedStyle(pin).top) || 0;
    const y = scrollY + scene.getBoundingClientRect().top - stick + (P / SPAN) * dist;
    scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
  };
  list.addEventListener('focusin', (e) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('[data-card]');
    if (!li) return;
    focused = true;
    goToFile(Number(li.dataset.card));
    if (progress() < LANDED) goTo(LANDED);
  });
  list.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const li = (e.target as HTMLElement).closest<HTMLElement>('[data-card]');
    if (!li) return;
    e.preventDefault();
    touch();
    const i = wrap(Number(li.dataset.card) + (e.key === 'ArrowRight' ? 1 : -1));
    list.querySelector<HTMLElement>(`[data-card="${i}"] a`)?.focus({ preventScroll: true });
  });
  head.addEventListener('focusin', () => { if (progress() < LANDED) goTo(LANDED); });
  nav.addEventListener('focusin', () => { if (progress() < LANDED) goTo(LANDED); });

  const ro = new ResizeObserver(() => {
    layout();
    if (!running) frame(performance.now());
  });
  ro.observe(pin);
  ro.observe(head);
  let inView = false;
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) start();
    else stop();
  }).observe(scene);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : inView && start()));
  layout();
  frame(performance.now());
}
