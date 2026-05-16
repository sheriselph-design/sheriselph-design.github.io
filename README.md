# Sheri Flournoy Selph — Portfolio Website

A dark, floral-organic personal website with four pages and four coded motion graphics.

## Folder Structure

```
sheri-flournoy-selph/
├── index.html              ← Entry point
├── css/
│   └── main.css            ← All styles, variables, and responsive breakpoints
├── js/
│   ├── nav.js              ← Cursor tracking & page switching
│   ├── bio.js              ← Animated botanical canvas (bio hero)
│   ├── portfolio.js        ← Project data, grid builder, thumbnail canvases
│   ├── blog.js             ← Post data, grid builder, newsletter handler
│   └── motion.js           ← Four experimental motion graphics
└── assets/
    ├── images/
    │   └── portrait.jpg    ← Your portrait photo
    └── svg/
        └── botanical-bg.svg ← Fixed decorative botanical overlay
```

## Pages

| Page | Description |
|---|---|
| **Bio** | Hero with name, tagline, animated botanical canvas, portrait, about section, skills strip |
| **Work** | Six project cards with animated particle thumbnails |
| **Writing** | Newsletter signup + six blog post cards |
| **Motion** | Four live canvas experiments: Botanical Growth, Petal Diffusion, Mycelium Network, Cellular Membrane |

## Customising

### Your name & tagline
Edit `index.html` — find the `<h1 class="bio-name">` block and the `<p class="bio-tagline">`.

### Portrait
Replace `assets/images/portrait.jpg` with your own photo (same filename, or update the `src` in `index.html`).

### Projects
Open `js/portfolio.js` and edit the `projects` array — title, tag, year, and description.

### Blog posts
Open `js/blog.js` and edit the `posts` array — date, title, and excerpt.

### Skills
Edit the four `.skill-cell` blocks in `index.html`.

### Colors / fonts
All design tokens are CSS custom properties at the top of `css/main.css` — change them once, they cascade everywhere.

## Running locally

Open `index.html` directly in a browser, or serve with any static file server:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .
```

> **Note:** The portrait image loads via a relative path, so a local server is recommended over opening the file directly (some browsers block local image loads via `file://`).
