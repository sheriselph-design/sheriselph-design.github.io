/* ============================================================
   motion.js — four experimental canvas motion graphics
   01 Botanical Growth · 02 Petal Diffusion
   03 Mycelium Network · 04 Cellular Membrane
============================================================ */

let motionDone = false;

function initMotion() {
  if (motionDone) return;
  motionDone = true;
  m1_botanical();
  m2_petal();
  m3_mycelium();
  m4_voronoi();
}

/* ----------------------------------------------------------
   01 — BOTANICAL GROWTH
   L-system-inspired recursive branching that gently sways
---------------------------------------------------------- */
function m1_botanical() {
  const canvas = document.getElementById('m1');
  if (!canvas) return;
  const W = canvas.width  = canvas.parentElement.offsetWidth  || 680;
  const H = canvas.height = canvas.parentElement.offsetHeight || 380;
  const ctx = canvas.getContext('2d');
  let t = 0;

  function branch(x, y, angle, len, depth) {
    if (depth === 0 || len < 1.5) return;
    const ex = x + Math.cos(angle) * len;
    const ey = y + Math.sin(angle) * len;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey);
    ctx.strokeStyle = `rgba(154,170,136,${(depth / 9) * 0.7})`;
    ctx.lineWidth = depth * 0.45;
    ctx.stroke();

    if (depth <= 2) {
      ctx.save();
      ctx.translate(ex, ey);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -5, 4, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(90,120,75,${(depth / 9) * 0.5})`;
      ctx.fill();
      ctx.restore();
    }

    const sway   = Math.sin(t * 0.4 + depth * 0.5) * 0.1;
    const spread = 0.45 + sway;
    branch(ex, ey, angle - spread, len * 0.67, depth - 1);
    branch(ex, ey, angle + spread, len * 0.67, depth - 1);
    if (depth > 5) branch(ex, ey, angle + (Math.random() - 0.5) * 0.3, len * 0.55, depth - 3);
  }

  function draw() {
    ctx.fillStyle = 'rgba(30,30,28,0.22)';
    ctx.fillRect(0, 0, W, H);
    ctx.lineCap = 'round';
    branch(W / 2, H, -Math.PI / 2 + Math.sin(t * 0.15) * 0.06, 65 + Math.sin(t * 0.2) * 6, 9);
    ctx.globalAlpha = 0.5;
    branch(W * 0.25, H, -Math.PI / 2 + 0.25 + Math.sin(t * 0.1) * 0.08, 42, 7);
    branch(W * 0.75, H, -Math.PI / 2 - 0.25 + Math.sin(t * 0.1 + 1) * 0.08, 42, 7);
    ctx.globalAlpha = 1;
    t += 0.01;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ----------------------------------------------------------
   02 — PETAL DIFFUSION
   Gray-Scott reaction-diffusion system — cream & sage palette
---------------------------------------------------------- */
function m2_petal() {
  const canvas = document.getElementById('m2');
  if (!canvas) return;
  const W = canvas.width  = Math.floor((canvas.parentElement.offsetWidth  || 680) / 2);
  const H = canvas.height = Math.floor((canvas.parentElement.offsetHeight || 380) / 2);
  canvas.style.imageRendering = 'pixelated';
  const ctx = canvas.getContext('2d');
  const N = W * H;

  let A  = new Float32Array(N).fill(1);
  let B  = new Float32Array(N).fill(0);
  let nA = new Float32Array(N);
  let nB = new Float32Array(N);
  const f = 0.0545, k = 0.062, Da = 1.0, Db = 0.5;

  [[W / 2, H / 2], [W / 4, H / 4], [W * 3 / 4, H / 4], [W / 2, H * 3 / 4]].forEach(([cx, cy]) => {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const idx = Math.floor(cy + dy) * W + Math.floor(cx + dx);
      if (idx >= 0 && idx < N) B[idx] = 1;
    }
  });

  const img = ctx.createImageData(W, H);

  function tick() {
    for (let s = 0; s < 6; s++) {
      for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
        const i    = y * W + x;
        const lapA = A[i - 1] + A[i + 1] + A[(y - 1) * W + x] + A[(y + 1) * W + x] - 4 * A[i];
        const lapB = B[i - 1] + B[i + 1] + B[(y - 1) * W + x] + B[(y + 1) * W + x] - 4 * B[i];
        const ab2  = A[i] * B[i] * B[i];
        nA[i] = Math.min(1, Math.max(0, A[i] + (Da * lapA - ab2 + f * (1 - A[i]))));
        nB[i] = Math.min(1, Math.max(0, B[i] + (Db * lapB + ab2 - (k + f) * B[i])));
      }
      [A, nA] = [nA, A]; [B, nB] = [nB, B];
    }
    for (let i = 0; i < N; i++) {
      const v = A[i];
      img.data[i * 4]     = Math.floor(30 + v * 210);
      img.data[i * 4 + 1] = Math.floor(30 + v * 195);
      img.data[i * 4 + 2] = Math.floor(28 + v * 170);
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(tick);
  }
  tick();
}

/* ----------------------------------------------------------
   03 — MYCELIUM NETWORK
   Growing particle graph with golden halo nodes
---------------------------------------------------------- */
function m3_mycelium() {
  const canvas = document.getElementById('m3');
  if (!canvas) return;
  const W = canvas.width  = canvas.parentElement.offsetWidth  || 680;
  const H = canvas.height = canvas.parentElement.offsetHeight || 380;
  const ctx = canvas.getContext('2d');

  const nodes = [{ x: W / 2, y: H / 2, r: 3, age: 0 }];
  const edges = [];

  function grow() {
    if (nodes.length < 320 && Math.random() < 0.5) {
      const parent = nodes[Math.floor(Math.random() * Math.min(nodes.length, 80))];
      const angle  = Math.random() * Math.PI * 2;
      const dist   = 18 + Math.random() * 30;
      const nx     = parent.x + Math.cos(angle) * dist;
      const ny     = parent.y + Math.sin(angle) * dist;
      if (nx > 10 && nx < W - 10 && ny > 10 && ny < H - 10) {
        const ni = nodes.length;
        nodes.push({ x: nx, y: ny, r: 1 + Math.random() * 2, age: 0 });
        edges.push({ a: nodes.indexOf(parent), b: ni });
      }
    }
    nodes.forEach(n => n.age++);
  }

  function draw() {
    ctx.fillStyle = 'rgba(30,30,28,0.14)';
    ctx.fillRect(0, 0, W, H);

    edges.forEach(e => {
      const a = nodes[e.a], b = nodes[e.b];
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(154,170,136,${Math.min(1, b.age / 60) * 0.25})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    nodes.forEach(n => {
      const alpha = Math.min(1, n.age / 40);
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,168,120,${alpha * 0.07})`; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,168,120,${alpha * 0.6})`; ctx.fill();
    });

    grow();
    requestAnimationFrame(draw);
  }
  draw();
}

/* ----------------------------------------------------------
   04 — CELLULAR MEMBRANE
   Flowing Voronoi field with animated seed points
---------------------------------------------------------- */
function m4_voronoi() {
  const canvas = document.getElementById('m4');
  if (!canvas) return;
  const W = canvas.width  = canvas.parentElement.offsetWidth  || 680;
  const H = canvas.height = canvas.parentElement.offsetHeight || 380;
  const ctx = canvas.getContext('2d');

  const seeds = Array.from({ length: 28 }, () => ({
    x:   Math.random() * W, y: Math.random() * H,
    vx:  (Math.random() - 0.5) * 0.4,
    vy:  (Math.random() - 0.5) * 0.4,
    hue: 28 + Math.random() * 30,
  }));

  const RES  = 3;
  const rW   = Math.floor(W / RES);
  const rH   = Math.floor(H / RES);
  const imgData = ctx.createImageData(rW, rH);
  let t = 0;

  function draw() {
    seeds.forEach(s => {
      s.x += s.vx + Math.sin(t * 0.005 + s.hue) * 0.3;
      s.y += s.vy + Math.cos(t * 0.005 + s.hue) * 0.3;
      if (s.x < 0 || s.x > W) s.vx *= -1;
      if (s.y < 0 || s.y > H) s.vy *= -1;
    });

    for (let py = 0; py < rH; py++) {
      for (let px = 0; px < rW; px++) {
        const wx = px * RES, wy = py * RES;
        let best = Infinity, second = Infinity, bestIdx = 0;
        seeds.forEach((s, i) => {
          const d = Math.hypot(wx - s.x, wy - s.y);
          if (d < best)        { second = best; best = d; bestIdx = i; }
          else if (d < second) { second = d; }
        });
        const edge  = second - best;
        const idx   = (py * rW + px) * 4;
        if (edge < 4) {
          imgData.data[idx] = 90; imgData.data[idx+1] = 100;
          imgData.data[idx+2] = 78; imgData.data[idx+3] = 220;
        } else {
          const b = 0.06 + (edge / 80) * 0.12;
          imgData.data[idx]   = Math.floor(30 + b * 180);
          imgData.data[idx+1] = Math.floor(28 + b * 165);
          imgData.data[idx+2] = Math.floor(22 + b * 130);
          imgData.data[idx+3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    ctx.drawImage(canvas, 0, 0, rW, rH, 0, 0, W, H);

    seeds.forEach(s => {
      ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,168,120,0.5)'; ctx.fill();
    });

    t++;
    requestAnimationFrame(draw);
  }
  draw();
}
