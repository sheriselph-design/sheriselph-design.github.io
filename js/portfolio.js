/* ============================================================
   portfolio.js — project data, grid builder, thumbnail canvases
============================================================ */

const projects = [
  { title: 'Project Title One',   tag: 'Branding',      year: '2024', desc: 'A short, compelling description of this project — what it was, what you made, and why it mattered.',              c1: '#1c1a14', c2: '#7a6a3a' },
  { title: 'Project Title Two',   tag: 'Motion Design', year: '2024', desc: 'Describe the work here. Keep it honest and specific — what was the brief, what was the solution?',               c1: '#141c14', c2: '#4a6a3a' },
  { title: 'Project Title Three', tag: 'Editorial',     year: '2023', desc: 'A few lines about this project. You can mention the client, the medium, or what made this one interesting.',     c1: '#1c1414', c2: '#7a3a3a' },
  { title: 'Project Title Four',  tag: 'Installation',  year: '2023', desc: 'What was this project exploring? Who was the audience? What did it feel like to complete it?',                  c1: '#14181c', c2: '#3a5a7a' },
  { title: 'Project Title Five',  tag: 'UX / Product',  year: '2022', desc: 'Describe what problem this solved, what tools or process you used, and what the outcome was.',                  c1: '#1a141c', c2: '#5a3a7a' },
  { title: 'Project Title Six',   tag: 'Photography',   year: '2022', desc: 'A closing note about this project — anything that gives it texture and makes it feel lived-in.',                c1: '#1a1c14', c2: '#6a7a3a' },
];

function buildProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid || grid.children.length) return;

  projects.forEach((p, i) => {
    grid.innerHTML += `
    <div class="project-card">
      <div class="project-thumb">
        <canvas data-bg="${p.c1}" data-fg="${p.c2}" data-i="${i}"></canvas>
        <span class="project-num">0${i + 1}</span>
      </div>
      <div class="project-body">
        <p class="project-tag">${p.tag}</p>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.desc}</p>
      </div>
      <div class="project-foot">
        <span class="project-year">${p.year}</span>
        <span class="project-arrow">→</span>
      </div>
    </div>`;
  });
}

function initThumbs() {
  buildProjects();
  document.querySelectorAll('.project-thumb canvas').forEach(canvas => {
    if (canvas._init) return;
    canvas._init = true;

    canvas.width  = canvas.parentElement.offsetWidth  || 340;
    canvas.height = canvas.parentElement.offsetHeight || 210;

    const W   = canvas.width, H = canvas.height;
    const ctx = canvas.getContext('2d');
    const bg  = canvas.dataset.bg;
    const fg  = canvas.dataset.fg;

    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    function animate() {
      ctx.fillStyle = bg + 'cc';
      ctx.fillRect(0, 0, W, H);

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      ctx.strokeStyle = fg + '44';
      ctx.lineWidth = 0.6;
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 70) {
          ctx.globalAlpha = (1 - d / 70) * 0.5;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }));
      ctx.globalAlpha = 1;

      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = fg;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    animate();
  });
}

/* Preload on page load so thumbnails are ready when portfolio is first visited */
window.addEventListener('load', () => {
  buildProjects();
  setTimeout(initThumbs, 300);
});
