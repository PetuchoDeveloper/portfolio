// Ink pad: a small stable-fluids simulation (WebGL2, no library).
// The dye texture stores amounts of four inks (RGBA); the display pass turns them
// into absorbance, darkens the rims, and the canvas blends with the page
// (multiply on paper, screen on onyx) so the real ground shows through.
const VERT = `#version 300 es
in vec2 aPos;
uniform vec2 uTexel;
out vec2 vUv, vL, vR, vT, vB;
void main() {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(uTexel.x, 0.0); vR = vUv + vec2(uTexel.x, 0.0);
  vT = vUv + vec2(0.0, uTexel.y); vB = vUv - vec2(0.0, uTexel.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;
const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv, vL, vR, vT, vB;
out vec4 o;
`;
const SPLAT = `${HEAD}
uniform sampler2D uT;
uniform vec2 uPoint;
uniform vec4 uColor;
uniform float uAspect, uRadius, uHard, uRough, uSeed, uReplace;
float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453); }
float n(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
void main() {
  vec2 p = vUv - uPoint; p.x *= uAspect;
  vec2 d = normalize(p + 1e-6);
  float edge = 1.0 + uRough * (n(d * 2.5) * 0.55 + n(d * 7.0) * 0.3 + n(d * 19.0) * 0.15 - 0.5);
  float r = length(p) / (uRadius * edge);
  float m = mix(exp(-r * r * 3.0), 1.0 - smoothstep(0.84, 1.0, r), uHard);
  // A drop displaces the ink under it (marbling); trails and forces add.
  vec4 old = texture(uT, vUv);
  o = mix(old + uColor * m, mix(old, uColor, m), uReplace);
}`;
const ADVECT = `${HEAD}
uniform sampler2D uVel, uSrc;
uniform vec2 uVelTexel;
uniform float uDt, uDiss, uAspect;
uniform vec4 uDrops[4];
void main() {
  vec2 coord = vUv - uDt * texture(uVel, vUv).xy * uVelTexel;
  // Marbling: each fresh drop is a source flow that pushes older ink outward in rings.
  vec2 push = vec2(0.0);
  for (int i = 0; i < 4; i++) {
    vec2 d = vUv - uDrops[i].xy; d.x *= uAspect;
    push += uDrops[i].z * d / max(dot(d, d), 4e-4);
  }
  push.x /= uAspect;
  o = texture(uSrc, coord - uDt * push) / (1.0 + uDiss * uDt);
}`;
const CURL = `${HEAD}
uniform sampler2D uVel;
void main() {
  o = vec4(0.5 * (texture(uVel, vR).y - texture(uVel, vL).y - texture(uVel, vT).x + texture(uVel, vB).x), 0, 0, 1);
}`;
const VORTICITY = `${HEAD}
uniform sampler2D uVel, uCurl;
uniform float uCurlK, uDt;
void main() {
  float c = texture(uCurl, vUv).x;
  vec2 f = 0.5 * vec2(abs(texture(uCurl, vT).x) - abs(texture(uCurl, vB).x), abs(texture(uCurl, vR).x) - abs(texture(uCurl, vL).x));
  f = f / (length(f) + 1e-4) * uCurlK * c; f.y *= -1.0;
  o = vec4(texture(uVel, vUv).xy + f * uDt, 0, 1);
}`;
const DIVERGENCE = `${HEAD}
uniform sampler2D uVel;
void main() {
  float l = texture(uVel, vL).x, r = texture(uVel, vR).x, t = texture(uVel, vT).y, b = texture(uVel, vB).y;
  vec2 c = texture(uVel, vUv).xy;
  if (vL.x < 0.0) l = -c.x; if (vR.x > 1.0) r = -c.x; if (vT.y > 1.0) t = -c.y; if (vB.y < 0.0) b = -c.y;
  o = vec4(0.5 * (r - l + t - b), 0, 0, 1);
}`;
const PRESSURE = `${HEAD}
uniform sampler2D uP, uDiv;
void main() {
  o = vec4((texture(uP, vL).x + texture(uP, vR).x + texture(uP, vB).x + texture(uP, vT).x - texture(uDiv, vUv).x) * 0.25, 0, 0, 1);
}`;
const GRADIENT = `${HEAD}
uniform sampler2D uP, uVel;
void main() {
  vec2 v = texture(uVel, vUv).xy - vec2(texture(uP, vR).x - texture(uP, vL).x, texture(uP, vT).x - texture(uP, vB).x);
  o = vec4(v, 0, 1);
}`;
const SCALE = `${HEAD}
uniform sampler2D uT;
uniform float uK;
void main() { o = texture(uT, vUv) * uK; }`;
const DISPLAY = `${HEAD}
uniform sampler2D uDye;
uniform vec3 uA[4], uC[4], uGround;
uniform float uScreen, uAspect;
float sum4(vec4 v) { return v.x + v.y + v.z + v.w; }
float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
void main() {
  vec4 w = texture(uDye, vUv);
  float c = sum4(w);
  // Paper fibres: a fixed noise field moves the soak line, so edges come out ragged.
  vec2 q = vUv * vec2(uAspect, 1.0);
  float fibre = n(q * 38.0) * 0.5 + n(q * 90.0) * 0.3 + n(q * 210.0) * 0.2;
  float line = 0.07 + (fibre - 0.5) * 0.09;
  float cover = smoothstep(line, line + 0.035, c);
  float body = 0.5 + 0.4 * smoothstep(0.1, 1.4, c);
  float g = length(vec2(sum4(texture(uDye, vR)) - sum4(texture(uDye, vL)), sum4(texture(uDye, vT)) - sum4(texture(uDye, vB))));
  float rim = smoothstep(0.04, 0.3, g) * cover;
  if (uScreen < 0.5) {
    // Paper: pigment absorbs light; the rim holds more pigment, so it is darker.
    vec3 hue = (w.r * uA[0] + w.g * uA[1] + w.b * uA[2] + w.a * uA[3]) / max(c, 1e-3);
    o = vec4(exp(-hue * (body * cover + rim * 1.1)), 1.0);
  } else {
    // Onyx: mix the ground toward the ink; the rim gains chroma at the same lightness.
    vec3 ink = (w.r * uC[0] + w.g * uC[1] + w.b * uC[2] + w.a * uC[3]) / max(c, 1e-3);
    vec3 col = mix(uGround, ink, cover * (0.55 + 0.4 * smoothstep(0.1, 1.4, c)));
    float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
    col = mix(col, clamp(l * 0.88 + (col - l) * 1.35, 0.0, 1.0), rim);
    // Screen blend with the page lands exactly on col.
    o = vec4(clamp(1.0 - (1.0 - col) / (1.0 - uGround), 0.0, 1.0), 1.0);
  }
}`;

type Hex = string;
const clampN = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const rgb = (hex: Hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const INKS = {
  light: { ground: '#F3EFE6', inks: ['#9271E8', '#DDB264', '#5A4C9C', '#D07CB6'] },
  dark: { ground: '#161616', inks: ['#7C4FE0', '#D9A04A', '#B3A890', '#A8438E'] },
};
const ABSORB = (() => {
  const g = rgb(INKS.light.ground);
  return INKS.light.inks.flatMap((ink) => rgb(ink).map((c, i) => -Math.log(Math.min(1, Math.max(0.02, c / g[i])))));
})();
const DARK_INKS = INKS.dark.inks.flatMap(rgb);
const DARK_GROUND = rgb(INKS.dark.ground);

export function mountInkpad(root: HTMLElement) {
  const canvas = root.querySelector('canvas');
  const gl = canvas?.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
  if (!canvas || !gl || !gl.getExtension('EXT_color_buffer_float')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
    return s;
  };
  const vert = compile(gl.VERTEX_SHADER, VERT);
  const program = (src: string) => {
    const p = gl.createProgram()!;
    gl.attachShader(p, vert);
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, src));
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.linkProgram(p);
    const u: Record<string, WebGLUniformLocation | null> = {};
    const count = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const name = gl.getActiveUniform(p, i)!.name.replace('[0]', '');
      u[name] = gl.getUniformLocation(p, name);
    }
    return { p, u };
  };
  let P: Record<string, ReturnType<typeof program>>;
  try {
    P = {
      splat: program(SPLAT), advect: program(ADVECT), curl: program(CURL), vort: program(VORTICITY),
      div: program(DIVERGENCE), press: program(PRESSURE), grad: program(GRADIENT), scale: program(SCALE), show: program(DISPLAY),
    };
  } catch {
    return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  type Target = { fbo: WebGLFramebuffer; tex: WebGLTexture; w: number; h: number };
  const target = (w: number, h: number): Target => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { fbo, tex, w, h };
  };
  const pair = (w: number, h: number) => {
    let a = target(w, h);
    let b = target(w, h);
    return { get read() { return a; }, get write() { return b; }, swap() { [a, b] = [b, a]; } };
  };
  const free = (t: Target) => { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fbo); };

  let vel: ReturnType<typeof pair>, dye: ReturnType<typeof pair>, prs: ReturnType<typeof pair>;
  let divT: Target, curlT: Target;
  let aspect = 1;

  const use = (prog: { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> }, texel: [number, number]) => {
    gl.useProgram(prog.p);
    gl.uniform2f(prog.u.uTexel, texel[0], texel[1]);
    return prog.u;
  };
  let unit = 0;
  const tex = (loc: WebGLUniformLocation | null, t: Target) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t.tex);
    gl.uniform1i(loc, unit++);
  };
  const draw = (t: Target | null) => {
    unit = 0;
    gl.bindFramebuffer(gl.FRAMEBUFFER, t ? t.fbo : null);
    gl.viewport(0, 0, t ? t.w : gl.drawingBufferWidth, t ? t.h : gl.drawingBufferHeight);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  const tx = (t: Target): [number, number] => [1 / t.w, 1 / t.h];

  const resize = () => {
    const w = Math.max(1, Math.round(canvas.clientWidth * Math.min(devicePixelRatio, 1.25)));
    const h = Math.max(1, Math.round(canvas.clientHeight * Math.min(devicePixelRatio, 1.25)));
    if (vel && canvas.width === w && canvas.height === h) return false;
    canvas.width = w;
    canvas.height = h;
    aspect = w / h;
    const sw = 192, sh = Math.max(32, Math.round(sw / aspect));
    const dw = Math.min(1280, w), dh = Math.max(64, Math.round(dw / aspect));
    if (vel) [vel.read, vel.write, dye.read, dye.write, prs.read, prs.write, divT, curlT].forEach(free);
    vel = pair(sw, sh);
    prs = pair(sw, sh);
    dye = pair(dw, dh);
    divT = target(sw, sh);
    curlT = target(sw, sh);
    return true;
  };

  // ---------- simulation ----------
  const drops: { x: number; y: number; q: number; t: number }[] = [];
  let seed = 1;
  const splat = (field: ReturnType<typeof pair>, x: number, y: number, color: number[], radius: number, hard: number, rough: number, replace = 0) => {
    const u = use(P.splat, tx(field.read));
    tex(u.uT, field.read);
    gl.uniform2f(u.uPoint, x, y);
    gl.uniform4f(u.uColor, color[0], color[1], color[2], color[3]);
    gl.uniform1f(u.uAspect, aspect);
    gl.uniform1f(u.uRadius, radius);
    gl.uniform1f(u.uHard, hard);
    gl.uniform1f(u.uRough, rough);
    gl.uniform1f(u.uReplace, replace);
    gl.uniform1f(u.uSeed, (seed = (seed * 9301 + 49297) % 233280) / 233280 * 100);
    draw(field.write);
    field.swap();
  };
  const inkVec = (i: number, amount: number) => [0, 1, 2, 3].map((c) => (c === i % 4 ? amount : 0));
  // Sizes are CSS pixels, so a drop looks the same on a wide or a tall footer.
  // bloom: how much the drop pushes older ink outward (marbling rings).
  const drop = (x: number, y: number, ink: number, px = 50, bloom = 2.1) => {
    const r = px / canvas.clientHeight;
    splat(dye, x, y, inkVec(ink, 1.15), r, 1, 0.55, 1);
    drops.push({ x, y, q: bloom * r * r, t: 0 });
    if (drops.length > 4) drops.shift();
  };

  const step = (dt: number) => {
    let u = use(P.curl, tx(vel.read));
    tex(u.uVel, vel.read);
    draw(curlT);

    u = use(P.vort, tx(vel.read));
    tex(u.uVel, vel.read);
    tex(u.uCurl, curlT);
    gl.uniform1f(u.uCurlK, 22);
    gl.uniform1f(u.uDt, dt);
    draw(vel.write);
    vel.swap();

    u = use(P.div, tx(vel.read));
    tex(u.uVel, vel.read);
    draw(divT);

    u = use(P.scale, tx(prs.read));
    tex(u.uT, prs.read);
    gl.uniform1f(u.uK, 0.8);
    draw(prs.write);
    prs.swap();
    for (let i = 0; i < 18; i++) {
      u = use(P.press, tx(prs.read));
      tex(u.uP, prs.read);
      tex(u.uDiv, divT);
      draw(prs.write);
      prs.swap();
    }

    u = use(P.grad, tx(vel.read));
    tex(u.uP, prs.read);
    tex(u.uVel, vel.read);
    draw(vel.write);
    vel.swap();

    const flat = new Float32Array(16);
    drops.forEach((d, i) => flat.set([d.x, d.y, d.q * Math.exp(-d.t / 0.55), 0], i * 4));
    for (const field of [vel, dye]) {
      u = use(P.advect, tx(field.read));
      tex(u.uVel, vel.read);
      tex(u.uSrc, field.read);
      gl.uniform2f(u.uVelTexel, 1 / vel.read.w, 1 / vel.read.h);
      gl.uniform1f(u.uDt, dt);
      gl.uniform1f(u.uDiss, field === vel ? 0.9 : 0.004);
      gl.uniform1f(u.uAspect, aspect);
      gl.uniform4fv(u.uDrops, field === dye ? flat : new Float32Array(16));
      draw(field.write);
      field.swap();
    }
    drops.forEach((d) => (d.t += dt));
    while (drops.length && drops[0].t > 3) drops.shift();
  };

  let dark = false;
  const theme = () => { dark = document.documentElement.dataset.theme === 'dark'; };
  const show = () => {
    const u = use(P.show, [2.2 / dye.read.w, 2.2 / dye.read.h]);
    tex(u.uDye, dye.read);
    gl.uniform3fv(u.uA, ABSORB);
    gl.uniform3fv(u.uC, DARK_INKS);
    gl.uniform3fv(u.uGround, DARK_GROUND);
    gl.uniform1f(u.uScreen, dark ? 1 : 0);
    gl.uniform1f(u.uAspect, aspect);
    draw(null);
  };

  // ---------- loop ----------
  let running = false, inView = false, raf = 0, prev = 0, awakeUntil = 0, seeded = false;
  const tick = (now: number) => {
    raf = 0;
    const dt = Math.min(1 / 30, (now - prev) / 1000 || 1 / 60);
    prev = now;
    step(dt);
    show();
    if (running && now < awakeUntil) raf = requestAnimationFrame(tick);
    else running = false;
  };
  const wake = (ms = 5000) => {
    awakeUntil = Math.max(awakeUntil, performance.now() + ms);
    if (!inView || document.hidden || running) return;
    running = true;
    prev = performance.now();
    raf = requestAnimationFrame(tick);
  };
  let inkIndex = 0;
  const seedBand = () => {
    seeded = true;
    // The band sits behind the wordmark only. It pools first (overlapping washes,
    // ink wicking upward), then single drops land in it and push it into rings.
    const mark = root.querySelector('.footer-wordmark')?.getBoundingClientRect();
    const box = canvas.getBoundingClientRect();
    const band = mark ? clampN((box.bottom - mark.top) / box.height, 0.08, 0.4) : 0.25;
    const unitPx = Math.min(1, box.width / 900);
    const wave = (i: number, k: number) => (Math.sin(i * k) + 1) / 2;
    const washR = band * 0.5;
    const washes = Math.ceil(aspect / (washR * 0.8)) + 2;
    const pool = () => {
      for (let i = 0; i < washes; i++) {
        const x = (i - 0.5) * ((washR * 0.8) / aspect);
        splat(dye, x, band * (0.3 + wave(i, 7.3) * 0.12), inkVec([0, 3, 1, 0, 2][i % 5], 0.8), washR * (0.8 + wave(i, 3.1) * 0.35), 1, 0.7, 1);
      }
      for (let i = 0; i < washes; i++) {
        splat(vel, (i + 0.5) / washes, band * 0.62, [0, (90 + wave(i, 5.7) * 140) * unitPx, 0, 0], 0.05, 0, 0);
      }
    };
    const n = Math.ceil(box.width / (120 * unitPx + 30)) + 1;
    const plan = Array.from({ length: n }, (_, i) => ({
      x: (i + 0.5 + (wave(i, 12.9898) - 0.5) * 0.7) / n,
      y: band * (0.25 + wave(i, 78.233) * 0.4),
      ink: [0, 3, 1, 0, 2, 0, 3, 1, 2][i % 9],
      size: (40 + wave(i, 31.7) * 34) * (0.6 + 0.4 * unitPx),
    }));
    if (reduced) {
      pool();
      plan.forEach((d) => drop(d.x, d.y, d.ink, d.size, 0.9));
      for (let i = 0; i < 90; i++) step(1 / 60);
      show();
      return;
    }
    setTimeout(() => { pool(); wake(); }, 60);
    plan.forEach((d, i) => setTimeout(() => { drop(d.x, d.y, d.ink, d.size, 0.9); wake(); }, 260 + i * 110));
  };

  const pos = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
  };
  let down = false, last: number[] | null = null;
  root.addEventListener('pointerdown', (e) => {
    if (!vel || (e.target as HTMLElement).closest('a, button')) return;
    down = true;
    const [x, y] = pos(e);
    // Smaller and calmer on narrow screens, where the pad sits under the links.
    const unit = Math.min(1, canvas.clientWidth / 900);
    drop(x, y, inkIndex++ % 4, (e.pointerType === 'touch' ? 30 : 44) * (0.55 + 0.45 * unit), 0.8 + 0.6 * unit);
    last = [x, y];
    wake();
  });
  root.addEventListener('pointermove', (e) => {
    if (!vel) return;
    const [x, y] = pos(e);
    if (last) {
      const dx = x - last[0], dy = y - last[1];
      const force = down ? 5200 : 1400;
      splat(vel, x, y, [dx * force, dy * force, 0, 0], 0.06, 0, 0);
      if (down) splat(dye, x, y, inkVec((inkIndex - 1) % 4, 0.22), 0.016, 1, 0.3);
      wake(down ? 5000 : 2500);
    }
    last = [x, y];
  });
  const up = () => { down = false; };
  root.addEventListener('pointerup', up);
  root.addEventListener('pointercancel', up);
  root.addEventListener('pointerleave', () => { up(); last = null; });

  theme();
  new MutationObserver(() => { theme(); if (vel) show(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  new ResizeObserver(() => {
    if (!inView && !vel) return;
    if (resize()) { seeded = false; if (inView) seedBand(); show(); }
  }).observe(canvas);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (!inView) return;
    resize();
    if (!seeded) seedBand();
    wake(1500);
  }, { rootMargin: '0px 0px -20% 0px' }).observe(root);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(800); });
  canvas.addEventListener('webglcontextlost', () => { running = false; cancelAnimationFrame(raf); });
  root.classList.add('is-inked');
}
