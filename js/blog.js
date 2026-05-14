/* ============================================================
   blog.js — post data, grid builder, newsletter subscribe
============================================================ */

const posts = [
  { date: 'Nov 12, 2025', title: 'On making things that last',              excerpt: 'We live in an era of relentless output. Everything is fast and disposable. What does it mean to make something slow, something rooted?' },
  { date: 'Oct 01, 2025', title: 'The practitioner who refuses to specialize', excerpt: "Everyone says pick a lane. I've spent years ignoring that advice. Here's what I've learned about working across disciplines without losing your edge." },
  { date: 'Sep 14, 2025', title: 'Three ideas that changed how I work',     excerpt: 'Not software. Not frameworks. Three ideas — borrowed from other fields — that restructured everything about how I approach a brief.' },
  { date: 'Aug 03, 2025', title: 'Why I deleted my portfolio twice',        excerpt: "The best thing I ever did for my practice was start from zero. Twice. The uncomfortable truth about curation and the work we're afraid to delete." },
  { date: 'Jul 20, 2025', title: 'Notes on attention and deep work',        excerpt: "Deep work isn't about time management. It's about learning to be a particular kind of present, in a particular room, at a particular hour." },
  { date: 'Jun 08, 2025', title: 'The aesthetics of restraint',             excerpt: "Less isn't more — less is harder. A meditation on subtraction, silence, and the terrifying discipline of knowing when to stop." },
];

(function buildBlog() {
  const grid = document.getElementById('posts-grid');
  if (!grid) return;
  posts.forEach(p => {
    grid.innerHTML += `
    <div class="post-card">
      <p class="post-date">${p.date}</p>
      <h3 class="post-title">${p.title}</h3>
      <p class="post-excerpt">${p.excerpt}</p>
      <span class="post-read">Read →</span>
    </div>`;
  });
})();

function subscribe() {
  const input = document.getElementById('nl-email');
  const msg   = document.getElementById('nl-msg');
  const v     = input.value.trim();

  if (!v.includes('@')) {
    msg.textContent = 'Please enter a valid email.';
    msg.style.color = '#c87a5a';
    return;
  }

  msg.textContent = `You're in. Welcome, ${v}.`;
  msg.style.color = '#c8a878';
  input.value = '';
}
