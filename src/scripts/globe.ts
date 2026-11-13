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
  slide: [0.45, 0.98],
} as const;

export function mountGlobe(scene: HTMLElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const pin = scene.querySelector<HTMLElement>('.scene-pin');
  const stage = scene.querySelector<HTMLElement>('[data-globe]');
  const list = scene.querySelector<HTMLElement>('[data-cards]');
  const copy = scene.querySelector<HTMLElement>('[data-hero-copy]');
  const head = scene.querySelector<HTMLElement>('[data-work-head]');
  const caseLine = scene.querySelector<HTMLElement>('[data-case-line]');
  const hint = scene.querySelector<HTMLElement>('.globe-hint');
  if (!pin || !stage || !list || !copy || !head) return;

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
  scene.classList.add('is-live');

  // ---------- layout ----------
  let vw = 0, vh = 0, mobile = false, R = 280, k = 1, cardW = 400, gap = 28, Rc = 2000, x0 = 0, oEnd = 0, stripY = 0, dist = 1;
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
    x0 = mobile ? 0 : -vw / 2 + margin + cardW / 2;
    oEnd = mobile ? cards.length - 1 : Math.max(0, cards.length - 1 - (vw - 2 * margin - cardW) / (cardW + gap));
    stripY = vh * (mobile ? 0.13 : 0.17);
    const copyBottom = copy.offsetTop + copy.offsetHeight;
    heroC = mobile ? [0, Math.max(copyBottom + R * 1.02 + 8, vh - R - 64) - vh / 2, 0] : [vw * 0.23, vh * 0.03, 0];
    scene.style.setProperty('--travel', mobile ? '330svh' : '270svh');
    dist = Math.max(1, scene.offsetHeight - pin.offsetHeight);
  };

  // ---------- state ----------
  let yaw = -24, pitch = -14, vYaw = 0, pitchAim = -14;
  let dragging = false, lastX = 0, lastY = 0, lastT = 0;
  const born = performance.now();
  let prev = born;
  let running = false;
  let raf = 0;

  const progress = () => clamp((pin.getBoundingClientRect().top - scene.getBoundingClientRect().top) / dist);
  const stripPose = (i: number, o: number): [V3, Q] => {
    const x = (i - o) * (cardW + gap) + x0;
    const th = x / Rc;
    return [[Rc * Math.sin(th), stripY, Rc * (Math.cos(th) - 1)], qAxis(0, 1, 0, th / D2R)];
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
    const o = oEnd * range(P, TIMELINE.slide[0], TIMELINE.slide[1]);
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
        if (u > 0) {
          const [sp, sq] = stripPose(t.card, o);
          p = lerp3(p, sp, u);
          p[2] += Math.sin(Math.PI * u) * 380;
          q = qSlerp(q, sq, u);
          s = lerp(s, 1, u);
          alpha = lerp(alpha, 1, u);
        }
        if (u > 0.98) flat++;
        t.el.classList.toggle('is-flat', u > 0.98);
        if (t.card === 0) t.el.classList.toggle('is-found', u > 0.995 && o < 1.4);
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
    list.classList.toggle('is-on', flat === cards.length);

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

  // Keyboard: focusing a file scrolls the search to where that file is in view.
  const goTo = (P: number) => {
    const stick = parseFloat(getComputedStyle(pin).top) || 0;
    const y = scrollY + scene.getBoundingClientRect().top - stick + P * dist;
    scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
  };
  list.addEventListener('focusin', (e) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('[data-card]');
    if (!li) return;
    const i = Number(li.dataset.card);
    const o = clamp(mobile ? i : i - 1, 0, oEnd);
    goTo(oEnd ? lerp(TIMELINE.slide[0], TIMELINE.slide[1], o / oEnd) : TIMELINE.slide[0]);
  });
  head.addEventListener('focusin', () => goTo(TIMELINE.slide[0]));

  new ResizeObserver(() => {
    layout();
    if (!running) frame(performance.now());
  }).observe(pin);
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
