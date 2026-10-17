// ===== Animated background: perspective grid + sparse code rain =====
// Draws into #parallax-bg. The "Parallax Effect" setting (adds .no-parallax) turns the mouse drift off.
(function () {
  const host = document.getElementById("parallax-bg");
  if (!host) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const parallaxOn = () => !host.classList.contains("no-parallax");

  // Mouse parallax: target follows the pointer, value eases toward it (-1..1)
  const parallax = { tx: 0, ty: 0, x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    parallax.tx = (e.clientX / window.innerWidth) * 2 - 1;
    parallax.ty = (e.clientY / window.innerHeight) * 2 - 1;
  });
  document.addEventListener("mouseleave", () => { parallax.tx = 0; parallax.ty = 0; });

  // Runs a canvas animation at ~30fps and keeps it sized to the window
  function canvasLoop(setup) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let w, h, state, last = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state = setup.init(ctx, w, h);
      if (reduceMotion) setup.draw(ctx, w, h, state, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    if (!reduceMotion) {
      const frame = (t) => {
        requestAnimationFrame(frame);
        if (t - last < 33) return;
        last = t;
        const tx = parallaxOn() ? parallax.tx : 0, ty = parallaxOn() ? parallax.ty : 0;
        parallax.x += (tx - parallax.x) * 0.12;
        parallax.y += (ty - parallax.y) * 0.12;
        setup.draw(ctx, w, h, state, t);
      };
      requestAnimationFrame(frame);
    }
  }

  // Floor grid with real perspective: square cells, fills the corners, fades into shadow
  canvasLoop({
    init(ctx, w) {
      return { cellPx: Math.max(90, Math.min(170, w / 9)) };
    },
    draw(ctx, w, h, s, t) {
      const H = Math.round(h * 0.1 - parallax.y * h * 0.025);
      const cx = w / 2 - parallax.x * w * 0.045;
      const depth = h - H, cellPx = s.cellPx, S = cellPx / depth;

      ctx.fillStyle = "#07000f"; ctx.fillRect(0, 0, w, h);
      const sky = ctx.createLinearGradient(0, 0, 0, H + depth * 0.2);
      sky.addColorStop(0, "#05000b"); sky.addColorStop(0.45, "#12011f"); sky.addColorStop(1, "#07000f");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
      const haze = ctx.createRadialGradient(cx, H, 0, cx, H, Math.max(w, h) * 0.6);
      haze.addColorStop(0, "rgba(160,40,200,0.22)"); haze.addColorStop(1, "rgba(160,40,200,0)");
      ctx.fillStyle = haze; ctx.fillRect(0, 0, w, h);

      const fade = ctx.createLinearGradient(0, H, 0, h);
      fade.addColorStop(0, "rgba(200,80,255,0)"); fade.addColorStop(0.1, "rgba(200,80,255,0)");
      fade.addColorStop(0.45, "rgba(210,80,245,0.16)"); fade.addColorStop(1, "rgba(225,100,255,0.42)");
      ctx.strokeStyle = fade; ctx.lineWidth = 1.2; ctx.beginPath();

      const K = Math.ceil((Math.max(cx, w - cx) / cellPx) * 18) + 1;
      for (let k = -K; k <= K; k++) { ctx.moveTo(cx, H); ctx.lineTo(cx + k * cellPx, h); }
      const offset = reduceMotion ? 0 : (t / 900) % 1;
      for (let n = 0; ; n++) {
        const Z = 1 - S + (n - offset) * S;
        if (Z <= 0) continue;
        if (Z > 12) break;
        const y = H + depth / Z;
        if (y > h + 2) continue;
        ctx.moveTo(0, y); ctx.lineTo(w, y);
      }
      ctx.stroke();

      const vig = ctx.createRadialGradient(cx, h * 0.62, Math.min(w, h) * 0.25, cx, h * 0.62, Math.max(w, h) * 0.85);
      vig.addColorStop(0, "rgba(7,0,15,0)"); vig.addColorStop(1, "rgba(7,0,15,0.85)");
      ctx.fillStyle = vig; ctx.fillRect(0, 0, w, h);
    },
  });

  // Sparse code rain on a transparent layer above the grid
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン01<>{}/;=$#".split("");
  const pick = () => chars[(Math.random() * chars.length) | 0];
  canvasLoop({
    init(ctx, w, h) {
      const size = 16, cols = Math.floor(w / size);
      const count = Math.max(6, Math.round(cols * 0.18));
      const make = (first) => {
        const len = 6 + ((Math.random() * 14) | 0);
        return {
          col: (Math.random() * cols) | 0,
          y: first ? Math.random() * h : -Math.random() * h * 0.6,
          speed: 2 + Math.random() * 3, len,
          chars: Array.from({ length: len }, pick),
          color: Math.random() < 0.2 ? "255,79,216" : "160,100,255",
        };
      };
      return { size, make, drops: Array.from({ length: count }, () => make(true)) };
    },
    draw(ctx, w, h, s) {
      const dpr = ctx.getTransform().a;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.setTransform(dpr, 0, 0, dpr, parallax.x * 12 * dpr, parallax.y * 10 * dpr);
      ctx.font = `${s.size}px monospace`;
      s.drops.forEach((d, n) => {
        if (Math.random() < 0.08) d.chars[(Math.random() * d.len) | 0] = pick();
        for (let i = 0; i < d.len; i++) {
          const y = d.y - i * s.size;
          if (y < -s.size || y > h + s.size) continue;
          const a = i === 0 ? 0.9 : (1 - i / d.len) * 0.65;
          ctx.fillStyle = i === 0 ? `rgba(255,220,255,${a})` : `rgba(${d.color},${a})`;
          ctx.fillText(d.chars[i], d.col * s.size, y);
        }
        d.y += d.speed;
        if (d.y - d.len * s.size > h) s.drops[n] = s.make(false);
      });
    },
  });
})();
