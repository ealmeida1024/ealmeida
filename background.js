// ===== Animated background: perspective grid + sparse code rain =====
// Draws into #parallax-bg. The "Parallax Effect" setting (adds .no-parallax) turns the mouse drift off.
//
// Performance notes: the layers that never change (sky, haze, vignette) are plain CSS gradients,
// so the browser paints them once. The canvases only draw what moves: the grid lines and the rain.
// One shared animation loop runs both at ~30fps, and canvas resolution is capped at 1.5x.
(function () {
  const host = document.getElementById("parallax-bg");
  if (!host) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const parallaxOn = () => !host.classList.contains("no-parallax");
  const MAX_DPR = 1.5;

  // ---- static CSS layers ----
  const layer = (css) => {
    const el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = "position:absolute;inset:0;pointer-events:none;" + css;
    host.appendChild(el);
    return el;
  };
  // purple haze at the horizon (drifts with the mouse via a cheap GPU transform)
  const haze = layer("inset:-10%;background:radial-gradient(circle at 50% 18%,rgba(160,40,200,.22),rgba(160,40,200,0) 55vmax);will-change:transform;");

  // ---- canvases ----
  function makeCanvas() {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";
    host.appendChild(canvas);
    return { canvas, ctx: canvas.getContext("2d") };
  }
  const grid = makeCanvas();
  // vignette sits above the grid and below the rain, so the rain stays crisp
  layer("background:radial-gradient(circle at 50% 62%,rgba(7,0,15,0) 22vmin,rgba(7,0,15,.85) 85vmax);");
  const rain = makeCanvas();

  // ---- mouse parallax: target follows the pointer, value eases toward it (-1..1) ----
  const parallax = { tx: 0, ty: 0, x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    parallax.tx = (e.clientX / window.innerWidth) * 2 - 1;
    parallax.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });
  document.addEventListener("mouseleave", () => { parallax.tx = 0; parallax.ty = 0; });

  // ---- sizing ----
  let w = 0, h = 0, dpr = 1, cellPx = 100;
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン01<>{}/;=$#".split("");
  const pick = () => chars[(Math.random() * chars.length) | 0];
  const SIZE = 16;
  let drops = [];

  function makeDrop(first) {
    const len = 6 + ((Math.random() * 14) | 0);
    return {
      col: (Math.random() * Math.floor(w / SIZE)) | 0,
      y: first ? Math.random() * h : -Math.random() * h * 0.6,
      speed: 2 + Math.random() * 3,
      len,
      chars: Array.from({ length: len }, pick),
      rgb: Math.random() < 0.2 ? "255,79,216" : "160,100,255",
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    w = window.innerWidth; h = window.innerHeight;
    for (const c of [grid, rain]) {
      c.canvas.width = Math.round(w * dpr);
      c.canvas.height = Math.round(h * dpr);
      c.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    rain.ctx.font = `${SIZE}px monospace`;
    cellPx = Math.max(90, Math.min(170, w / 9));
    const count = Math.max(6, Math.round(Math.floor(w / SIZE) * 0.18));
    drops = Array.from({ length: count }, () => makeDrop(true));
    draw(0);
  }

  // ---- drawing ----
  function drawGrid(t) {
    const ctx = grid.ctx;
    const H = Math.round(h * 0.1 - parallax.y * h * 0.025);   // horizon
    const cx = w / 2 - parallax.x * w * 0.045;                 // vanishing point
    const depth = h - H, S = cellPx / depth;
    const y0 = H + depth * 0.1;                                // lines are fully faded above this

    ctx.clearRect(0, 0, w, h);
    const fade = ctx.createLinearGradient(0, H, 0, h);
    fade.addColorStop(0, "rgba(200,80,255,0)");
    fade.addColorStop(0.1, "rgba(200,80,255,0)");
    fade.addColorStop(0.45, "rgba(210,80,245,0.16)");
    fade.addColorStop(1, "rgba(225,100,255,0.42)");
    ctx.strokeStyle = fade;
    ctx.lineWidth = 1.2;
    ctx.beginPath();

    // Lines toward the horizon: only the ones that cross the screen below y0
    const K = Math.ceil(Math.max(cx, w - cx) / (cellPx * 0.1)) + 1;
    for (let k = -K; k <= K; k++) {
      const xb = cx + k * cellPx;                              // where the line meets the bottom edge
      const xs = cx + (xb - cx) * ((y0 - H) / depth);          // where it crosses y0
      if ((xs < 0 && xb < 0) || (xs > w && xb > w)) continue;
      ctx.moveTo(xs, y0); ctx.lineTo(xb, h);
    }
    // Cross lines one cell apart in depth, moving toward the viewer
    const offset = reduceMotion ? 0 : (t / 900) % 1;
    for (let n = 0; ; n++) {
      const Z = 1 - S + (n - offset) * S;
      if (Z <= 0) continue;
      const y = H + depth / Z;
      if (y < y0) break;
      if (y > h + 2) continue;
      ctx.moveTo(0, y); ctx.lineTo(w, y);
    }
    ctx.stroke();
  }

  function drawRain() {
    const ctx = rain.ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.setTransform(dpr, 0, 0, dpr, parallax.x * 12 * dpr, parallax.y * 10 * dpr);
    for (let n = 0; n < drops.length; n++) {
      const d = drops[n];
      if (Math.random() < 0.08) d.chars[(Math.random() * d.len) | 0] = pick();
      const x = d.col * SIZE;
      for (let i = 0; i < d.len; i++) {
        const y = d.y - i * SIZE;
        if (y < -SIZE || y > h + SIZE) continue;
        const a = i === 0 ? 0.9 : (1 - i / d.len) * 0.65;
        ctx.fillStyle = i === 0 ? `rgba(255,220,255,${a})` : `rgba(${d.rgb},${a.toFixed(2)})`;
        ctx.fillText(d.chars[i], x, y);
      }
      d.y += d.speed;
      if (d.y - d.len * SIZE > h) drops[n] = makeDrop(false);
    }
  }

  function draw(t) {
    const on = parallaxOn();
    parallax.x += ((on ? parallax.tx : 0) - parallax.x) * 0.12;
    parallax.y += ((on ? parallax.ty : 0) - parallax.y) * 0.12;
    haze.style.transform = `translate3d(${(-parallax.x * w * 0.045).toFixed(1)}px,${(-parallax.y * h * 0.025).toFixed(1)}px,0)`;
    drawGrid(t);
    drawRain();
  }

  // ---- loop (one for both layers, ~30fps; the browser pauses it in background tabs) ----
  let last = 0;
  function frame(t) {
    requestAnimationFrame(frame);
    if (t - last < 33) return;
    last = t;
    draw(t);
  }

  let resizeTimer;
  window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });
  resize();                                   // first frame right away
  if (!reduceMotion) requestAnimationFrame(frame);
})();
