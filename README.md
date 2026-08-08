# Wal Pakh — Luxury Kashmir Tourism Website

A redesigned, production-ready front end for Wal Pakh, built around a
**Luxury Olive** identity: deep olive and forest greens, warm cream and
beige, and a restrained gold accent — meant to feel like a luxury mountain
resort rather than a generic travel template.

## Interactive hero map

The hero background is now an illustrated Kashmir map (mountains, ridgelines
and a lake, drawn as stylised terrain — not a political/boundary map, so it
carries no territorial claims) pinned with:

- **Tourist spots** (gold pins) — Srinagar/Dal Lake, Gulmarg, Pahalgam,
  Sonamarg, Patnitop, Vaishno Devi
- **Trek routes** (forest-green pins) — Kashmir Great Lakes Trek, Tarsar
  Marsar Trek, Kolahoi Glacier Trek, Amarnath Yatra Trek, Sinthan Top Trek
- **Alpine lakes** (teal pins) — Dal Lake, Wular Lake, Gangabal Lake,
  Sheshnag Lake, Vishansar Lake, Konsarnag Lake

Clicking a pin opens a detail card with a **"Mark as Explored"** toggle.
Explored state is saved per-visitor in `localStorage`
(`js/explore-map.js`), so a returning visitor sees their progress and the
"X / 17 explored" counter in the map legend — with a **Reset** link to clear
it. Unexplored pins pulse gently to invite clicks; explored pins get a gold
checkmark badge. All place data (names, coordinates, descriptions) lives in
one array at the top of `js/explore-map.js` — edit that to add, remove, or
reposition pins.

## What changed in this pass

- **New design system** (`css/variables.css`) — the full olive/gold palette,
  shadows, radii, spacing and type tokens the rest of the CSS is built on.
  Old variable names (`--primary`, `--secondary`, etc.) are kept as aliases
  so nothing that referenced them breaks.
- **Signature motif** — a thin gold "contour line" (echoing topographic
  mountain maps) is used as a divider under every section title and as a
  faint background pattern in the AI Planner panel. It's the one recurring
  visual signature tying the sections together.
- **Rebuilt `css/style.css`** — glassmorphism navbar, floating search card,
  luxury cards with hover-lift + image zoom, and full styling for sections
  that previously had markup but no CSS (Adventure cards, and the newly
  added Gallery, Testimonials, AI Planner teaser, Contact and Footer).
- **Filled in `css/animations.css`** (previously empty) — fade/scale
  keyframes, hover-lift and image-zoom utilities, button ripple, and a
  floating idle animation for the planner card. Scroll-reveal is driven by
  `[data-reveal]` attributes in the HTML plus `.is-visible`, toggled from JS.
- **Filled in `js/animations.js`** (previously empty) — IntersectionObserver
  scroll reveals, button ripple effect, a testimonial auto-slider, and a
  gallery lightbox.
- **`js/navigation.js`** — kept the original scroll/mobile-menu logic, added
  closing the mobile menu on link click / outside click and an icon swap.
- **`js/app.js`** — moved from the project root into `js/` (matching the
  intended folder structure) and left focused on its one job: dismissing
  the page loader.
- **`index.html`** — kept your section order and most of the original
  markup, fixed the destination cards so all three share one consistent
  structure, and added the sections that existed as empty anchors
  (`#planner`, `#testimonials`, `#contact`) plus a new `#gallery` section,
  using only the images already in `assets/images/`.
- Added `loading="lazy"` to below-the-fold images, visible focus states,
  and `prefers-reduced-motion` support.

## Structure

```
WalPakh/
├── index.html
├── css/
│   ├── variables.css
│   ├── style.css
│   ├── responsive.css
│   └── animations.css
├── js/
│   ├── app.js
│   ├── navigation.js
│   ├── animations.js
│   └── explore-map.js
├── assets/
│   └── images/
└── README.md
```

## Running it

No build step — open `index.html` directly in a browser, or serve the
folder with any static file server.

## Notes / next steps

- The search card, package "Book Now" buttons and contact form are wired
  visually but don't submit anywhere yet — hook them up to your booking
  flow / backend when ready.
- The Gallery and Testimonials sections reuse existing imagery/content;
  swap in real guest photos and quotes when available.
- Fonts are loaded from Google Fonts (Playfair Display, Poppins, and
  JetBrains Mono for pricing/labels) — self-host them if you need to work
  offline or drop the external request.
