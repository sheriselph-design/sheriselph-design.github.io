/* ============================================================
   bio.js — animated botanical canvas for the bio hero panel
============================================================ */

(function initBioCanvas() {
  const canvas = document.getElementById('bio-canvas');
  if (!canvas) return;

  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  /* Gentle bokeh-like floating orbs */
  const orbs = Array.from({ length: 18 }, () => ({
    x:     Math.random() * W,
    y:     Math.random() * H,
    r:     30 + Math.random() * 80,
    speed: 0.0003 + Math.random() * 0.0006,
    phase: Math.random() * Math.PI * 2,
    hue:   28 + Math.random() * 20,
    sat:   30 + Math.random() * 20,
    lit:   30 + Math.random() * 20,
  }));

  /* Vine paths */
  const vines = Array.from({ length: 5 }, () => ({
    sx:     Math.random() * W,
    sy:     H + 20,
    pts:    [],
    angle:  -Math.PI / 2 + (Math.random() - 0.5) * 0.8,
    speed:  0.5 + Math.random() * 0.5,
  }));

  vines.forEach(v => {
    let x = v.sx, y = v.sy;
    for (let i = 0; i < 80; i++) {
      v.angle += (Math.random() - 0.5) * 0.15;
      x += Math.cos(v.angle) * 4;
      y += Math.sin(v.angle) * 4;
      v.pts.push({ x, y });
    }
  });

  let t = 0, frame = 0;

  function draw() {
    ctx.fillStyle = '#252523';
    ctx.fillRect(0, 0, W, H);

    /* orbs */
    orbs.forEach(o => {
      const nx = o.x + Math.sin(t * o.speed + o.phase) * 30;
      const ny = o.y + Math.cos(t * o.speed * 0.7 + o.phase) * 20;
      const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, o.r);
      grd.addColorStop(0, `hsla(${o.hue},${o.sat}%,${o.lit}%,0.12)`);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(nx, ny, o.r, 0, Math.PI * 2);
      ctx.fill();
    });

    /* vines */
    vines.forEach(v => {
      const visible = Math.min(v.pts.length, Math.floor(frame * v.speed));
      if (visible < 2) return;

      ctx.beginPath();
      ctx.moveTo(v.pts[0].x, v.pts[0].y);
      for (let i = 1; i < visible; i++) ctx.lineTo(v.pts[i].x, v.pts[i].y);
      ctx.strokeStyle = 'rgba(122,138,106,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      /* tiny leaves */
      for (let i = 8; i < visible; i += 12) {
        const p   = v.pts[i];
        const ang = Math.atan2(v.pts[i].y - v.pts[i - 1].y, v.pts[i].x - v.pts[i - 1].x);
        [Math.PI / 2.5, -Math.PI / 2.5].forEach(offset => {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(ang + offset);
          ctx.beginPath();
          ctx.ellipse(0, 0, 5, 12, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(90,110,75,0.3)';
          ctx.fill();
          ctx.restore();
        });
      }
    });

    t += 1;
    frame++;
    requestAnimationFrame(draw);
  }

  draw();
})();
