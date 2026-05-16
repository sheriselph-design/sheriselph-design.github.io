/* ============================================================
   blog.js — post data, grid builder, newsletter subscribe
============================================================ */

const posts = [
  { id: 'post-1', date: 'Nov 12, 2025', title: 'On making things that last',
    excerpt: 'We live in an era of relentless output. Everything is fast and disposable. What does it mean to make something slow, something rooted?',
    body: `<p>Replace this with the full text of this essay. This is your space to write without the algorithm — no word count limit, no SEO strategy, just honest thinking on the page.</p><p>What moved you to write this? What were you trying to work through? The best newsletter essays feel like a letter to a specific person, not a broadcast to a crowd.</p><p>Add as many paragraphs as you need. You might include quotes, short lists, or just long unbroken prose. Whatever serves the thought.</p>` },
  { id: 'post-2', date: 'Oct 01, 2025', title: 'The practitioner who refuses to specialize',
    excerpt: "Everyone says pick a lane. I've spent years ignoring that advice. Here's what I've learned about working across disciplines without losing your edge.",
    body: `<p>Replace this with the full text of this essay. This is your space to write without the algorithm — no word count limit, no SEO strategy, just honest thinking on the page.</p><p>What moved you to write this? What were you trying to work through? The best newsletter essays feel like a letter to a specific person, not a broadcast to a crowd.</p><p>Add as many paragraphs as you need. You might include quotes, short lists, or just long unbroken prose. Whatever serves the thought.</p>` },
  { id: 'post-3', date: 'Sep 14, 2025', title: 'Three ideas that changed how I work',
    excerpt: 'Not software. Not frameworks. Three ideas — borrowed from other fields — that restructured everything about how I approach a brief.',
    body: `<p>Replace this with the full text of this essay. This is your space to write without the algorithm — no word count limit, no SEO strategy, just honest thinking on the page.</p><p>What moved you to write this? What were you trying to work through? The best newsletter essays feel like a letter to a specific person, not a broadcast to a crowd.</p><p>Add as many paragraphs as you need. You might include quotes, short lists, or just long unbroken prose. Whatever serves the thought.</p>` },
  { id: 'post-4', date: 'Aug 03, 2025', title: 'Why I deleted my portfolio twice',
    excerpt: "The best thing I ever did for my practice was start from zero. Twice. The uncomfortable truth about curation and the work we're afraid to delete.",
    body: `<p>Replace this with the full text of this essay. This is your space to write without the algorithm — no word count limit, no SEO strategy, just honest thinking on the page.</p><p>What moved you to write this? What were you trying to work through? The best newsletter essays feel like a letter to a specific person, not a broadcast to a crowd.</p><p>Add as many paragraphs as you need. You might include quotes, short lists, or just long unbroken prose. Whatever serves the thought.</p>` },
  { id: 'post-5', date: 'Jul 20, 2025', title: 'Notes on attention and deep work',
    excerpt: "Deep work isn't about time management. It's about learning to be a particular kind of present, in a particular room, at a particular hour.",
    body: `<p>Replace this with the full text of this essay. This is your space to write without the algorithm — no word count limit, no SEO strategy, just honest thinking on the page.</p><p>What moved you to write this? What were you trying to work through? The best newsletter essays feel like a letter to a specific person, not a broadcast to a crowd.</p><p>Add as many paragraphs as you need. You might include quotes, short lists, or just long unbroken prose. Whatever serves the thought.</p>` },
  { id: 'post-6', date: 'Jun 08, 2025', title: 'The aesthetics of restraint',
    excerpt: "Less isn't more — less is harder. A meditation on subtraction, silence, and the terrifying discipline of knowing when to stop.",
    body: `<p>Replace this with the full text of this essay. This is your space to write without the algorithm — no word count limit, no SEO strategy, just honest thinking on the page.</p><p>What moved you to write this? What were you trying to work through? The best newsletter essays feel like a letter to a specific person, not a broadcast to a crowd.</p><p>Add as many paragraphs as you need. You might include quotes, short lists, or just long unbroken prose. Whatever serves the thought.</p>` },
];

(function buildBlog() {
  const grid = document.getElementById('posts-grid');
  if (!grid) return;

  posts.forEach(p => {
    grid.innerHTML += `
    <div class="post-card" onclick="showPostPage('${p.id}')">
      <p class="post-date">${p.date}</p>
      <h3 class="post-title">${p.title}</h3>
      <p class="post-excerpt">${p.excerpt}</p>
      <span class="post-read">Read →</span>
    </div>`;
  });

  // Inject post sub-pages
  posts.forEach(p => {
    if (document.getElementById(p.id)) return;
    const section = document.createElement('section');
    section.id = p.id;
    section.className = 'page subpage';
    section.innerHTML = `
      <div class="subpage-wrap">
        <button class="subpage-back" onclick="showPage('blog')">← Back to Writing</button>
        <div class="subpage-header">
          <p class="subpage-eyebrow">Newsletter · ${p.date}</p>
          <h1 class="subpage-title">${p.title}</h1>
        </div>
        <div class="post-divider"></div>
        <div class="subpage-body post-body">${p.body}</div>
        <div class="post-subscribe-cta">
          <p class="post-cta-label">Enjoyed this essay?</p>
          <p class="post-cta-desc">Subscribe to receive the next one in your inbox.</p>
          <div class="nl-form" style="margin-top:1.2rem;">
            <input class="nl-input" type="email" placeholder="your@email.com" id="post-email-${p.id}">
            <button class="nl-btn" onclick="subscribeInline('${p.id}')">Subscribe</button>
          </div>
          <p class="nl-note" id="post-msg-${p.id}">No spam. Unsubscribe anytime.</p>
        </div>
        <div class="subpage-nav">
          <button class="btn-secondary" onclick="showPage('blog')">← All Essays</button>
        </div>
      </div>`;
    document.body.insertBefore(section, document.querySelector('footer'));
  });
})();

function showPostPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) { target.classList.add('active'); window.scrollTo(0, 0); }
}

function subscribe() {
  const input = document.getElementById('nl-email');
  const msg   = document.getElementById('nl-msg');
  const v     = input.value.trim();
  if (!v.includes('@')) { msg.textContent = 'Please enter a valid email.'; msg.style.color = '#c87a5a'; return; }
  msg.textContent = `You're in. Welcome, ${v}.`;
  msg.style.color = '#c8a878';
  input.value = '';
}

function subscribeInline(postId) {
  const input = document.getElementById(`post-email-${postId}`);
  const msg   = document.getElementById(`post-msg-${postId}`);
  const v     = input.value.trim();
  if (!v.includes('@')) { msg.textContent = 'Please enter a valid email.'; msg.style.color = '#c87a5a'; return; }
  msg.textContent = `You're in. Welcome, ${v}.`;
  msg.style.color = '#c8a878';
  input.value = '';
}
