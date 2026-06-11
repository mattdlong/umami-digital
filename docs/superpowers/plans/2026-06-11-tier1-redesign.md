# Umami Digital Tier-1 Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild umami-digital as a multi-page, minimal-editorial, tier-1 agency website in Astro 5 with three anonymized-composite case studies (Ember, Forage, Atlas), as an internal proposal — no deployment.

**Architecture:** Astro 5 static site at the repo root on branch `redesign/tier1` (main, which serves the current live site, is never touched). Case studies are a content collection rendered through one template plus bespoke HTML/CSS artifact components (type specimens, palettes, product screens). All visuals are live HTML/SVG — no raster project images.

**Tech Stack:** Astro 5, @astrojs/sitemap, Fraunces Variable + Inter Variable (self-hosted via @fontsource-variable), vanilla TS/JS. Node 20+.

**Spec:** `docs/superpowers/specs/2026-06-11-tier1-redesign-design.md`

**Verification approach:** There is no unit-test framework for a static brochure site; the TDD loop here is *check → build → preview*. Every task ends with `npm run check` (astro check), `npm run build` (must end `Complete!`), and a stated manual check in `npm run dev` / `npm run preview`. Never claim a task done without running those.

**Design tokens (single source of truth, used everywhere):** paper `#FAF7F2`, ink `#141414`, red `#E94E3D`, hairline `rgba(20,20,20,.14)`. Display font Fraunces, text font Inter. No gradients anywhere. Every animation must respect `prefers-reduced-motion`.

---

## File Structure

```
astro.config.mjs, package.json, tsconfig.json        # Task 1
public/  favicon.ico, favicon-{16,32,256}.png, robots.txt
src/
  styles/global.css                                   # Task 2 — tokens, base type, utilities
  components/
    Logo.astro                                        # Task 3 — inline SVG mark + wordmark
    Nav.astro, Footer.astro                           # Task 3
    SectionHeading.astro                              # Task 3 — eyebrow + title pattern
    PaletteSwatch.astro, TypeSpecimen.astro,
    ScreenFrame.astro                                 # Task 5 — case-study artifacts
    screens/EmberScreen.astro, ForageScreen.astro,
            AtlasScreen.astro                         # Task 5 — bespoke product mockups
    WorkCard.astro                                    # Task 6 — editorial work list row
    CtaBand.astro                                     # Task 8 — dark contact band
    HeroBlank.astro                                   # Task 8 — signature hero animation
  layouts/BaseLayout.astro                            # Task 3 — head/SEO/nav/footer/reveals
  content.config.ts                                   # Task 4 — work collection schema
  content/work/{ember,forage,atlas}.md                # Task 4 — full case-study copy
  pages/
    index.astro                                       # Task 8 — home
    work/index.astro                                  # Task 6
    work/[slug].astro                                 # Task 7 — case-study template
    studio.astro                                      # Task 9
    contact.astro                                     # Task 10
    404.astro                                         # Task 3
```

---

### Task 1: Branch, scaffold, and clean slate

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (placeholder), `public/robots.txt`
- Modify: `.gitignore`
- Delete (branch only): `index.html`, `styles.css`, `script.js`, `approach.png`, `brand_transformation.png`, `ecommerce.png`, `immersive.png`, `logo-light.png`, `logo-dark.png`, `favicon-preview.png`, `favicon-48.png`, `favicon-64.png`, `favicon-128.png`, `favicon.png`
- Move: `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-256.png` → `public/`

- [ ] **Step 1: Create the branch**

```bash
git checkout -b redesign/tier1
```

- [ ] **Step 2: Remove the old site and relocate favicons**

```bash
git rm index.html styles.css script.js approach.png brand_transformation.png ecommerce.png immersive.png logo-light.png logo-dark.png favicon-preview.png favicon-48.png favicon-64.png favicon-128.png favicon.png
mkdir -p public src/pages src/styles
git mv favicon.ico favicon-16.png favicon-32.png favicon-256.png public/
```

Note: `CNAME` stays at repo root untouched (it is not in `public/`, so it never ships — the proposal is not deployed).

- [ ] **Step 3: Write `package.json`**

```json
{
  "name": "umami-digital",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/sitemap": "^3.2.0",
    "@fontsource-variable/fraunces": "^5.1.0",
    "@fontsource-variable/inter": "^5.1.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 4: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://umamionline.com',
  integrations: [sitemap()],
});
```

- [ ] **Step 5: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 6: Append build artifacts to `.gitignore`**

```
node_modules/
dist/
.astro/
```

- [ ] **Step 7: Write placeholder `src/pages/index.astro`** (replaced in Task 8 — exists only so the build passes)

```astro
---
---
<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><title>Umami Digital</title></head>
<body><h1>Umami Digital — redesign in progress</h1></body></html>
```

- [ ] **Step 8: Write `public/robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://umamionline.com/sitemap-index.xml
```

- [ ] **Step 9: Install and verify build**

Run: `npm install && npm run build`
Expected: install succeeds; build output ends with `Complete!` and `dist/index.html` exists.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro 5 project, remove legacy static site (branch only)"
```

---

### Task 2: Design tokens and global stylesheet

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Write `src/styles/global.css`** — the complete design system base. No gradients. Reduced-motion kill-switch at the bottom.

```css
/* ===== Tokens ===== */
:root {
  --paper: #FAF7F2;
  --ink: #141414;
  --ink-70: #3f3d3a;
  --ink-50: #6f6c66;
  --red: #E94E3D;
  --hairline: rgba(20, 20, 20, 0.14);
  --hairline-light: rgba(250, 247, 242, 0.2);

  --font-display: 'Fraunces Variable', Georgia, 'Times New Roman', serif;
  --font-text: 'Inter Variable', system-ui, -apple-system, sans-serif;

  --step-0: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --step-1: clamp(1.25rem, 1.1rem + 0.6vw, 1.6rem);
  --step-2: clamp(1.6rem, 1.35rem + 1.2vw, 2.4rem);
  --step-3: clamp(2.2rem, 1.7rem + 2.4vw, 3.6rem);
  --step-4: clamp(2.9rem, 2rem + 4.5vw, 5.4rem);

  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;
  --space-5: 4rem;
  --space-6: clamp(4.5rem, 4rem + 4vw, 7.5rem);

  --container: 1280px;
}

/* ===== Base ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-text);
  font-size: var(--step-0);
  line-height: 1.65;
  color: var(--ink);
  background: var(--paper);
  -webkit-font-smoothing: antialiased;
}
img, svg { display: block; max-width: 100%; }
a { color: inherit; }
h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 540;
  line-height: 1.06;
  letter-spacing: -0.015em;
  text-wrap: balance;
}
p { max-width: 65ch; }

:focus-visible { outline: 2px solid var(--red); outline-offset: 3px; }

/* ===== Utilities ===== */
.container { max-width: var(--container); margin-inline: auto; padding-inline: clamp(1.25rem, 4vw, 2.5rem); }
.section { padding-block: var(--space-6); }
.display { font-size: var(--step-4); }
.eyebrow {
  font-family: var(--font-text);
  font-size: 0.78rem;
  font-weight: 650;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--red);
}
.hairline { border: 0; border-top: 1px solid var(--hairline); }
.muted { color: var(--ink-50); }

.btn {
  display: inline-block;
  font-family: var(--font-text);
  font-weight: 600;
  font-size: var(--step-0);
  padding: 0.85rem 1.7rem;
  border: 1px solid var(--ink);
  border-radius: 999px;
  background: transparent;
  color: var(--ink);
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
.btn:hover { background: var(--ink); color: var(--paper); }
.btn--solid { background: var(--ink); color: var(--paper); }
.btn--solid:hover { background: var(--red); border-color: var(--red); color: #fff; }
.btn--paper { border-color: var(--paper); color: var(--paper); }
.btn--paper:hover { background: var(--paper); color: var(--ink); }

.tag {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 550;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.3rem 0.85rem;
  border: 1px solid var(--hairline);
  border-radius: 999px;
  color: var(--ink-70);
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: -3rem;
  z-index: 100;
  background: var(--ink);
  color: var(--paper);
  padding: 0.6rem 1rem;
  border-radius: 0 0 8px 8px;
  text-decoration: none;
  transition: top 0.2s ease;
}
.skip-link:focus { top: 0; }

/* ===== Scroll reveal (activated by BaseLayout script) ===== */
.reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.is-visible { opacity: 1; transform: none; }

/* ===== Reduced motion ===== */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify build still passes**

Run: `npm run build`
Expected: `Complete!` (the CSS isn't imported yet; this catches syntax-level tooling issues only).

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add design tokens and global stylesheet"
```

---

### Task 3: Logo, base layout, nav, footer, 404

**Files:**
- Create: `src/components/Logo.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`, `src/components/SectionHeading.astro`, `src/layouts/BaseLayout.astro`, `src/pages/404.astro`
- Modify: `src/pages/index.astro` (wire to layout)

- [ ] **Step 1: Write `src/components/Logo.astro`** — inline SVG replacing the PNG logos. Wordmark inherits `currentColor` so it works on paper and ink grounds.

```astro
---
interface Props { wordmark?: boolean }
const { wordmark = true } = Astro.props;
---
<svg
  viewBox={wordmark ? '0 0 196 44' : '0 0 44 44'}
  height="36"
  role="img"
  aria-label="Umami Digital"
>
  <rect width="44" height="44" rx="11" fill="#E94E3D" />
  <text x="22" y="30" text-anchor="middle" font-family="Inter Variable, sans-serif" font-weight="800" font-size="20" fill="#fff">UD</text>
  {wordmark && (
    <g font-family="Inter Variable, sans-serif" font-weight="800" font-size="15" fill="currentColor" letter-spacing="1">
      <text x="56" y="19">UMAMI</text>
      <text x="56" y="38">DIGITAL</text>
    </g>
  )}
</svg>
```

- [ ] **Step 2: Write `src/components/Nav.astro`** — no hamburger; the link set is small enough to stay inline at every width (YAGNI).

```astro
---
import Logo from './Logo.astro';
const links = [
  { href: '/work/', label: 'Work' },
  { href: '/studio/', label: 'Studio' },
];
const path = Astro.url.pathname;
---
<header class="site-nav">
  <div class="container row">
    <a href="/" class="logo-link" aria-label="Umami Digital — home"><Logo /></a>
    <nav aria-label="Main">
      <ul>
        {links.map(({ href, label }) => (
          <li>
            <a href={href} aria-current={path.startsWith(href) ? 'page' : undefined}>{label}</a>
          </li>
        ))}
        <li><a href="/contact/" class="btn btn--solid nav-cta">Start a project</a></li>
      </ul>
    </nav>
  </div>
</header>

<style>
  .site-nav { padding-block: 1.1rem; border-bottom: 1px solid var(--hairline); background: var(--paper); }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  ul { display: flex; align-items: center; gap: clamp(1rem, 3vw, 2.2rem); list-style: none; margin: 0; padding: 0; }
  nav a:not(.btn) { text-decoration: none; font-weight: 550; font-size: 0.95rem; }
  nav a:not(.btn):hover, nav a[aria-current='page']:not(.btn) { color: var(--red); }
  .nav-cta { padding: 0.55rem 1.2rem; font-size: 0.9rem; }
  @media (max-width: 480px) { .nav-cta { display: none; } }
</style>
```

- [ ] **Step 3: Write `src/components/Footer.astro`**

```astro
---
import Logo from './Logo.astro';
const year = new Date().getFullYear();
---
<footer class="site-footer">
  <div class="container">
    <a href="mailto:hello@umamionline.com" class="footer-email">hello@umamionline.com</a>
    <div class="row">
      <a href="/" aria-label="Umami Digital — home"><Logo /></a>
      <nav aria-label="Footer">
        <a href="/work/">Work</a>
        <a href="/studio/">Studio</a>
        <a href="/contact/">Contact</a>
      </nav>
      <p class="muted-light">&copy; {year} Umami Digital</p>
    </div>
  </div>
</footer>

<style>
  .site-footer { background: var(--ink); color: var(--paper); padding-block: var(--space-5); margin-top: auto; }
  .footer-email {
    font-family: var(--font-display);
    font-size: var(--step-3);
    text-decoration: none;
    display: inline-block;
    margin-bottom: var(--space-4);
    border-bottom: 2px solid transparent;
  }
  .footer-email:hover { border-bottom-color: var(--red); color: #fff; }
  .row {
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.5rem;
    border-top: 1px solid var(--hairline-light); padding-top: var(--space-3);
  }
  nav { display: flex; gap: 1.8rem; }
  nav a { text-decoration: none; font-size: 0.9rem; opacity: 0.85; }
  nav a:hover { color: var(--red); opacity: 1; }
  .muted-light { opacity: 0.6; font-size: 0.85rem; }
</style>
```

- [ ] **Step 4: Write `src/components/SectionHeading.astro`**

```astro
---
interface Props { eyebrow: string; title: string }
const { eyebrow, title } = Astro.props;
---
<div class="section-heading reveal">
  <p class="eyebrow">{eyebrow}</p>
  <h2>{title}</h2>
</div>

<style>
  .section-heading { margin-bottom: var(--space-4); }
  .eyebrow { margin-bottom: 0.6rem; }
  h2 { font-size: var(--step-3); }
</style>
```

- [ ] **Step 5: Write `src/layouts/BaseLayout.astro`** — fonts, SEO head, view transitions, skip link, reveal script. Note `astro:page-load` (not `DOMContentLoaded`) so scripts re-run after view transitions.

```astro
---
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource-variable/inter';
import '../styles/global.css';
import { ClientRouter } from 'astro:transitions';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props { title: string; description: string }
const { title, description } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const ogImage = new URL('/favicon-256.png', Astro.site);
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon-256.png" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Umami Digital" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImage} />
    <meta name="twitter:card" content="summary" />
    <script type="application/ld+json" set:html={JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Umami Digital',
      url: 'https://umamionline.com',
      email: 'hello@umamionline.com',
    })} />
    <ClientRouter />
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <Nav />
    <main id="main"><slot /></main>
    <Footer />
    <noscript><style>.reveal { opacity: 1 !important; transform: none !important; }</style></noscript>
    <script>
      function initReveals() {
        const els = document.querySelectorAll('.reveal');
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          els.forEach((el) => el.classList.add('is-visible'));
          return;
        }
        const io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
              }
            }
          },
          { threshold: 0.15 }
        );
        els.forEach((el) => io.observe(el));
      }
      document.addEventListener('astro:page-load', initReveals);
    </script>
  </body>
</html>

<style is:global>
  body { display: flex; min-height: 100vh; flex-direction: column; }
</style>
```

- [ ] **Step 6: Write `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Page not found — Umami Digital" description="This page doesn't exist.">
  <section class="section container">
    <p class="eyebrow">404</p>
    <h1 class="display">Nothing here has flavour.</h1>
    <p class="muted lede">The page you're after doesn't exist — but the work does.</p>
    <div class="actions">
      <a href="/" class="btn btn--solid">Back home</a>
      <a href="/work/" class="btn">See the work</a>
    </div>
  </section>
</BaseLayout>

<style>
  .lede { font-size: var(--step-1); margin-block: var(--space-3); }
  .actions { display: flex; gap: 1rem; flex-wrap: wrap; }
</style>
```

- [ ] **Step 7: Rewrite `src/pages/index.astro`** to use the layout (still placeholder content; full home in Task 8)

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Umami Digital — Strategy, identity and web"
  description="Umami Digital is a strategy, identity and web studio for brands that want to be remembered, not just recognised."
>
  <section class="section container">
    <h1 class="display">Umami Digital</h1>
  </section>
</BaseLayout>
```

- [ ] **Step 8: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors; `Complete!`.
Then `npm run dev` and check `http://localhost:4321/`: nav with SVG logo, footer with large email line, working `/404` (visit `/nope`), Fraunces rendering on the h1, skip link appears on first Tab press.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: base layout, nav, footer, logo SVG, 404"
```

---

### Task 4: Work content collection — schema and the three case studies

**Files:**
- Create: `src/content.config.ts`, `src/content/work/ember.md`, `src/content/work/forage.md`, `src/content/work/atlas.md`

- [ ] **Step 1: Write `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: z.object({
    codename: z.string(),
    sector: z.string(),
    engagement: z.string(),
    services: z.array(z.string()),
    order: z.number(),
    summary: z.string(),
    palette: z.array(z.object({
      name: z.string(),
      hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    })),
    type: z.object({ display: z.string(), text: z.string() }),
  }),
});

export const collections = { work };
```

- [ ] **Step 2: Write `src/content/work/ember.md`** (complete file)

```markdown
---
codename: Ember
sector: A multi-venue restaurant group
engagement: Identity refresh and booking platform
services: [Brand identity, Art direction, Web design, Build]
order: 1
summary: One identity system and an in-house booking flow for a restaurant group whose five venues had five looks — and no shared taste.
palette:
  - { name: Charcoal, hex: "#1C1A17" }
  - { name: Flame, hex: "#D8491B" }
  - { name: Smoke, hex: "#A39E94" }
  - { name: Bone, hex: "#F4EFE6" }
type:
  display: High-contrast serif — tight, hot, slightly wonky
  text: Quiet grotesque that stays out of the food's way
---

## The brief

The group had grown venue by venue. Each room had its own look, its own menu
language and its own third-party booking widget. Loyal guests followed the
chefs; nobody followed the group. Ownership wanted a parent brand strong enough
to open the next venue under — without flattening what made each room
different.

## The approach

We built the identity around heat. One charcoal-and-bone system that each venue
dials up or down through a single flame accent and its own display weight.
Menus, signage and the website share one typographic skeleton, so the group
reads as one hand even when the venues sound different.

Booking was brought in-house and redesigned as the most branded moment of the
journey: confirm a table in three steps, without leaving the page, in the
group's own voice.

## Where it landed

The group now opens venues into a system instead of starting from zero — a new
room needs a name, a heat level and a menu, and the identity does the rest.
Booking, previously a white-label widget, became the strongest expression of
the brand a guest touches before they walk in.
```

- [ ] **Step 3: Write `src/content/work/forage.md`** (complete file)

```markdown
---
codename: Forage
sector: A zero-waste grocery retailer
engagement: E-commerce design and build
services: [UX, Art direction, E-commerce, Build]
order: 2
summary: An online store that sells the way the retailer's best floor staff do — by routine, not by category.
palette:
  - { name: Moss, hex: "#3D4A32" }
  - { name: Clay, hex: "#B66E41" }
  - { name: Oat, hex: "#EFE8DA" }
  - { name: Ink, hex: "#20231D" }
type:
  display: Sturdy serif with a hand-set warmth
  text: Plainspoken grotesque, generous line height
---

## The brief

The retailer converted well in its shops and badly online. The existing store
was a template: a grid of jars, refill logic hidden behind FAQs, and
sustainability copy doing the work the experience should have done. The ask
was simple to say and hard to do — make the store sell the way their best
floor staff sell.

## The approach

We rebuilt the catalogue around how people actually shop refills: by routine,
not by category. The product page leads with weight, price per 100g and what
container the order arrives in. The basket keeps a running tally of packaging
avoided — stated plainly, never celebrated.

Art direction swaps glossy lifestyle photography for honest texture: produce,
paper and glass on oat-coloured ground, photographed flat and lit like a
market stall, not a studio.

## Where it landed

The store now explains zero-waste mechanics inside the interface itself — no
manifesto page required. Refill reordering is a two-tap routine, and the
design system absorbs seasonal range changes without new layouts.
```

- [ ] **Step 4: Write `src/content/work/atlas.md`** (complete file)

```markdown
---
codename: Atlas
sector: An early-stage fintech
engagement: Product design for a freelancer banking tool
services: [Product strategy, UX, UI design, Design system]
order: 3
summary: A dashboard built around one number — what a freelancer can actually spend this month.
palette:
  - { name: Deep Navy, hex: "#10182B" }
  - { name: Signal Blue, hex: "#2E5BFF" }
  - { name: Cloud, hex: "#F2F4F8" }
  - { name: Slate, hex: "#5A6478" }
type:
  display: Engineered grotesque, tight tracking
  text: The same family at text sizes — one voice, two volumes
---

## The brief

The team had a working prototype of a banking tool for freelancers — income
smoothing, automatic tax set-asides — and an interface that explained none of
it. Ahead of a raise, the product needed to demonstrate its own logic in two
screens or fewer.

## The approach

We designed the dashboard around one number: what you can actually spend this
month. Everything else — invoices due, the tax pot, the smoothing buffer — is
shown as the machinery behind that number, revealed progressively instead of
dumped on a chart.

A calm navy system with a single signal blue keeps the product feeling like
infrastructure, not an app competing for attention.

## Where it landed

The two-screen story now exists: this is your real income, and here is the
engine that steadies it. The design system ships as tokens and components, so
the founding team can build new features without inheriting design debt on
day one.
```

- [ ] **Step 5: Verify schema and content parse**

Run: `npx astro sync && npm run check && npm run build`
Expected: sync generates types without error; 0 check errors; `Complete!`.

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/content/work/
git commit -m "feat: work content collection with Ember, Forage, Atlas case studies"
```

---

### Task 5: Case-study artifact components (palette, type specimen, screens)

**Files:**
- Create: `src/components/PaletteSwatch.astro`, `src/components/TypeSpecimen.astro`, `src/components/ScreenFrame.astro`, `src/components/screens/EmberScreen.astro`, `src/components/screens/ForageScreen.astro`, `src/components/screens/AtlasScreen.astro`

- [ ] **Step 1: Write `src/components/PaletteSwatch.astro`**

```astro
---
interface Props { palette: { name: string; hex: string }[] }
const { palette } = Astro.props;
const isLight = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
};
---
<div class="palette" role="list" aria-label="Colour palette">
  {palette.map(({ name, hex }) => (
    <div class="swatch" role="listitem" style={`background:${hex};color:${isLight(hex) ? '#141414' : '#FAF7F2'}`}>
      <span class="name">{name}</span>
      <span class="hex">{hex}</span>
    </div>
  ))}
</div>

<style>
  .palette { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; }
  .swatch {
    aspect-ratio: 1 / 1.1; border-radius: 12px; padding: 1rem;
    display: flex; flex-direction: column; justify-content: flex-end;
    border: 1px solid var(--hairline);
  }
  .name { font-weight: 600; font-size: 0.95rem; }
  .hex { font-size: 0.78rem; opacity: 0.75; font-variant-numeric: tabular-nums; }
</style>
```

- [ ] **Step 2: Write `src/components/TypeSpecimen.astro`** — renders the project's typographic voice using the site's variable fonts (Fraunces axes differentiate each project's display style).

```astro
---
interface Props {
  display: string;       // description label from frontmatter
  text: string;          // description label from frontmatter
  displayStyle?: string; // CSS for the Aa glyph, e.g. font-variation-settings
  accent: string;        // project accent hex
}
const { display, text, displayStyle = '', accent } = Astro.props;
---
<div class="specimen">
  <div class="glyph-cell">
    <span class="glyph" style={`color:${accent};${displayStyle}`} aria-hidden="true">Aa</span>
  </div>
  <dl>
    <div><dt>Display</dt><dd>{display}</dd></div>
    <div><dt>Text</dt><dd>{text}</dd></div>
  </dl>
</div>

<style>
  .specimen {
    display: grid; grid-template-columns: minmax(160px, 240px) 1fr; gap: var(--space-3);
    align-items: center; border: 1px solid var(--hairline); border-radius: 12px; padding: var(--space-3);
  }
  .glyph-cell { display: grid; place-items: center; }
  .glyph { font-family: var(--font-display); font-size: clamp(5rem, 10vw, 8rem); line-height: 1; }
  dl { display: grid; gap: 1rem; margin: 0; }
  dt { font-size: 0.78rem; font-weight: 650; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-50); }
  dd { margin: 0; font-size: var(--step-1); font-family: var(--font-display); }
  @media (max-width: 600px) { .specimen { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 3: Write `src/components/ScreenFrame.astro`** — neutral browser-style frame; bespoke screen content goes in the slot.

```astro
---
interface Props { caption: string }
const { caption } = Astro.props;
---
<figure class="frame reveal">
  <div class="chrome" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="screen"><slot /></div>
  <figcaption class="muted">{caption}</figcaption>
</figure>

<style>
  .frame { margin: 0; }
  .chrome {
    display: flex; gap: 6px; padding: 10px 14px;
    background: var(--ink); border-radius: 14px 14px 0 0;
  }
  .chrome i { width: 9px; height: 9px; border-radius: 50%; background: rgba(250, 247, 242, 0.3); }
  .screen { border: 1px solid var(--hairline); border-top: 0; border-radius: 0 0 14px 14px; overflow: hidden; }
  figcaption { font-size: 0.85rem; margin-top: 0.75rem; }
</style>
```

- [ ] **Step 4: Write `src/components/screens/EmberScreen.astro`** — the in-house booking flow, on Ember's palette.

```astro
<div class="ember">
  <p class="venue-label">Book a table</p>
  <div class="venues" aria-hidden="true">
    <span class="pill active">The Grill Room</span>
    <span class="pill">Cinder</span>
    <span class="pill">Ash &amp; Oak</span>
  </div>
  <div class="row" aria-hidden="true">
    <div class="field"><span class="k">Date</span><span class="v">Fri 26 Jun</span></div>
    <div class="field"><span class="k">Time</span><span class="v">19:30</span></div>
    <div class="field"><span class="k">Guests</span><span class="v">4</span></div>
  </div>
  <span class="cta">Confirm table — step 3 of 3</span>
</div>

<style>
  .ember { background: #1C1A17; color: #F4EFE6; padding: clamp(1.5rem, 4vw, 2.5rem); font-family: var(--font-text); }
  .venue-label { font-family: var(--font-display); font-size: var(--step-2); margin-bottom: 1.25rem; }
  .venues { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
  .pill { border: 1px solid #A39E94; border-radius: 999px; padding: 0.35rem 0.9rem; font-size: 0.85rem; color: #A39E94; }
  .pill.active { background: #D8491B; border-color: #D8491B; color: #F4EFE6; }
  .row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
  .field { border: 1px solid rgba(163, 158, 148, 0.4); border-radius: 10px; padding: 0.75rem; display: grid; gap: 0.2rem; }
  .k { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: #A39E94; }
  .v { font-weight: 600; }
  .cta { display: inline-block; background: #D8491B; color: #F4EFE6; border-radius: 999px; padding: 0.7rem 1.4rem; font-weight: 600; font-size: 0.95rem; }
</style>
```

- [ ] **Step 5: Write `src/components/screens/ForageScreen.astro`** — product card + packaging tally, on Forage's palette.

```astro
<div class="forage">
  <div class="grid" aria-hidden="true">
    <div class="product">
      <div class="ph oats"></div>
      <p class="name">Rolled oats</p>
      <p class="meta">500g · £0.32 / 100g</p>
      <p class="container-line">Arrives in: returned jar</p>
    </div>
    <div class="product">
      <div class="ph lentils"></div>
      <p class="name">Red lentils</p>
      <p class="meta">400g · £0.48 / 100g</p>
      <p class="container-line">Arrives in: paper bag</p>
    </div>
    <div class="product">
      <div class="ph oil"></div>
      <p class="name">Olive oil refill</p>
      <p class="meta">750ml · £1.10 / 100ml</p>
      <p class="container-line">Arrives in: your bottle</p>
    </div>
  </div>
  <p class="tally">412 g of packaging avoided this order</p>
</div>

<style>
  .forage { background: #EFE8DA; color: #20231D; padding: clamp(1.5rem, 4vw, 2.5rem); font-family: var(--font-text); }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.25rem; }
  .ph { border-radius: 10px; aspect-ratio: 4 / 3; margin-bottom: 0.6rem; }
  .oats { background: #B66E41; }
  .lentils { background: #3D4A32; }
  .oil { background: #20231D; }
  .name { font-weight: 650; font-size: 0.95rem; }
  .meta { font-size: 0.8rem; color: #3D4A32; }
  .container-line { font-size: 0.75rem; font-style: italic; color: #5a5346; }
  .tally { border-top: 1px solid rgba(32, 35, 29, 0.2); padding-top: 0.9rem; font-weight: 600; font-size: 0.9rem; color: #3D4A32; }
  @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 6: Write `src/components/screens/AtlasScreen.astro`** — the one-number dashboard, on Atlas's palette.

```astro
<div class="atlas">
  <p class="k">Spendable this month</p>
  <p class="big">£2,340</p>
  <div class="rows" aria-hidden="true">
    <div class="row"><span>Smoothing buffer</span><span class="num">£1,180</span></div>
    <div class="row"><span>Tax pot <em>(set aside automatically)</em></span><span class="num">£4,260</span></div>
    <div class="row"><span>Invoices due</span><span class="num">£3,900</span></div>
  </div>
  <div class="bar" aria-hidden="true"><i style="width: 62%"></i></div>
  <p class="hint">62% of a typical month — buffer will top up the rest</p>
</div>

<style>
  .atlas { background: #10182B; color: #F2F4F8; padding: clamp(1.5rem, 4vw, 2.5rem); font-family: var(--font-text); }
  .k { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.12em; color: #5A6478; margin-bottom: 0.3rem; }
  .big { font-size: clamp(2.4rem, 6vw, 3.6rem); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 1.25rem; font-variant-numeric: tabular-nums; }
  .rows { display: grid; gap: 0.6rem; margin-bottom: 1.25rem; }
  .row { display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgba(90, 100, 120, 0.3); padding-bottom: 0.6rem; font-size: 0.92rem; }
  .row em { font-style: normal; color: #5A6478; font-size: 0.8rem; }
  .num { font-variant-numeric: tabular-nums; font-weight: 600; }
  .bar { height: 8px; border-radius: 999px; background: rgba(90, 100, 120, 0.3); overflow: hidden; margin-bottom: 0.5rem; }
  .bar i { display: block; height: 100%; background: #2E5BFF; border-radius: 999px; }
  .hint { font-size: 0.8rem; color: #5A6478; }
</style>
```

- [ ] **Step 7: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors; `Complete!` (components aren't mounted on a page yet — visual verification happens in Task 7).

- [ ] **Step 8: Commit**

```bash
git add src/components/
git commit -m "feat: case-study artifact components — palette, type specimen, screens"
```

---

### Task 6: Work index page

**Files:**
- Create: `src/components/WorkCard.astro`, `src/pages/work/index.astro`

- [ ] **Step 1: Write `src/components/WorkCard.astro`** — editorial list row, type-led, no images.

```astro
---
interface Props {
  slug: string;
  codename: string;
  sector: string;
  engagement: string;
  services: string[];
}
const { slug, codename, sector, engagement, services } = Astro.props;
---
<a href={`/work/${slug}/`} class="work-card reveal">
  <div class="head">
    <h3 class="codename">{codename}</h3>
    <span class="arrow" aria-hidden="true">→</span>
  </div>
  <p class="line">{sector} — {engagement.toLowerCase()}</p>
  <ul class="tags" role="list">
    {services.map((s) => <li class="tag">{s}</li>)}
  </ul>
</a>

<style>
  .work-card {
    display: block; text-decoration: none;
    border-top: 1px solid var(--hairline);
    padding-block: var(--space-4);
    transition: padding-left 0.25s ease;
  }
  .work-card:hover { padding-left: 0.75rem; }
  .head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
  .codename { font-size: var(--step-3); }
  .work-card:hover .codename { color: var(--red); }
  .arrow { font-size: var(--step-2); color: var(--red); opacity: 0; transition: opacity 0.25s ease; }
  .work-card:hover .arrow { opacity: 1; }
  .line { color: var(--ink-70); margin-block: 0.6rem 1rem; font-size: var(--step-1); font-family: var(--font-display); }
  .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none; margin: 0; padding: 0; }
</style>
```

- [ ] **Step 2: Write `src/pages/work/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import WorkCard from '../../components/WorkCard.astro';

const entries = (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
---
<BaseLayout
  title="Work — Umami Digital"
  description="Selected engagements across brand identity, e-commerce and product design."
>
  <section class="section container">
    <p class="eyebrow">Selected work</p>
    <h1 class="display">The proof is in the tasting.</h1>
    <p class="muted framing">Codenames stand in where confidentiality applies.</p>
    <div class="list">
      {entries.map((e) => (
        <WorkCard
          slug={e.id}
          codename={e.data.codename}
          sector={e.data.sector}
          engagement={e.data.engagement}
          services={e.data.services}
        />
      ))}
    </div>
  </section>
</BaseLayout>

<style>
  .framing { margin-block: var(--space-2) var(--space-5); }
  .list { border-bottom: 1px solid var(--hairline); }
</style>
```

- [ ] **Step 3: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors; `Complete!`.
Then in `npm run dev`, visit `/work/`: three rows ordered Ember, Forage, Atlas; hover shows red arrow and indent; rows link to `/work/ember/` etc. (404 until Task 7 — expected).

- [ ] **Step 4: Commit**

```bash
git add src/components/WorkCard.astro src/pages/work/index.astro
git commit -m "feat: work index page with editorial case list"
```

---

### Task 7: Case-study template

**Files:**
- Create: `src/pages/work/[slug].astro`

- [ ] **Step 1: Write `src/pages/work/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PaletteSwatch from '../../components/PaletteSwatch.astro';
import TypeSpecimen from '../../components/TypeSpecimen.astro';
import ScreenFrame from '../../components/ScreenFrame.astro';
import EmberScreen from '../../components/screens/EmberScreen.astro';
import ForageScreen from '../../components/screens/ForageScreen.astro';
import AtlasScreen from '../../components/screens/AtlasScreen.astro';

export async function getStaticPaths() {
  const entries = await getCollection('work');
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const { codename, sector, engagement, services, summary, palette, type } = entry.data;

const screens: Record<string, { component: any; caption: string; displayStyle: string }> = {
  ember: {
    component: EmberScreen,
    caption: 'The booking flow — three steps, fully in the group’s voice.',
    displayStyle: "font-variation-settings: 'SOFT' 0, 'WONK' 1; font-weight: 600;",
  },
  forage: {
    component: ForageScreen,
    caption: 'Product cards lead with weight, unit price and container.',
    displayStyle: "font-variation-settings: 'SOFT' 100, 'WONK' 0; font-weight: 500;",
  },
  atlas: {
    component: AtlasScreen,
    caption: 'The dashboard — one number, machinery revealed progressively.',
    displayStyle: "font-variation-settings: 'SOFT' 0, 'WONK' 0; font-weight: 380; font-family: var(--font-text); letter-spacing: -0.04em;",
  },
};
const { component: Screen, caption, displayStyle } = screens[entry.id];

const all = (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
const idx = all.findIndex((e) => e.id === entry.id);
const next = all[(idx + 1) % all.length];
---
<BaseLayout title={`${codename} — Umami Digital`} description={summary}>
  <article>
    <header class="section container">
      <p class="eyebrow">{sector}</p>
      <h1 class="display">{codename}</h1>
      <p class="engagement">{engagement}</p>
      <ul class="tags" role="list">
        {services.map((s) => <li class="tag">{s}</li>)}
      </ul>
    </header>

    <div class="container narrative reveal">
      <Content />
    </div>

    <section class="container section artifacts" aria-label="Identity system">
      <h2 class="art-heading">The system</h2>
      <TypeSpecimen display={type.display} text={type.text} displayStyle={displayStyle} accent={palette[1].hex} />
      <PaletteSwatch palette={palette} />
      <ScreenFrame caption={caption}><Screen /></ScreenFrame>
    </section>

    <nav class="container next-case" aria-label="Next case study">
      <a href={`/work/${next.id}/`}>
        <span class="eyebrow">Next case</span>
        <span class="next-name">{next.data.codename} →</span>
      </a>
    </nav>
  </article>
</BaseLayout>

<style>
  .engagement { font-family: var(--font-display); font-size: var(--step-1); color: var(--ink-70); margin-block: var(--space-2) var(--space-3); }
  .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none; margin: 0; padding: 0; }
  .narrative { max-width: 760px; }
  .narrative :global(h2) { font-size: var(--step-2); margin-block: var(--space-4) var(--space-2); }
  .narrative :global(p) { margin-bottom: var(--space-2); color: var(--ink-70); font-size: var(--step-0); }
  .artifacts { display: grid; gap: var(--space-4); }
  .art-heading { font-size: var(--step-2); }
  .next-case { padding-block: var(--space-5); border-top: 1px solid var(--hairline); }
  .next-case a { text-decoration: none; display: grid; gap: 0.4rem; }
  .next-name { font-family: var(--font-display); font-size: var(--step-3); }
  .next-case a:hover .next-name { color: var(--red); }
</style>
```

- [ ] **Step 2: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors; build emits `dist/work/ember/index.html`, `dist/work/forage/index.html`, `dist/work/atlas/index.html`.
In `npm run dev`, visit all three case pages: hero (sector eyebrow, codename, engagement, tags) → narrative (brief/approach/landed) → type specimen → palette swatches → screen mockup in browser frame → "Next case" link cycles Ember → Forage → Atlas → Ember.

- [ ] **Step 3: Commit**

```bash
git add src/pages/work/
git commit -m "feat: case-study template with live identity artifacts"
```

---

### Task 8: Home page with signature hero

**Files:**
- Create: `src/components/HeroBlank.astro`, `src/components/CtaBand.astro`
- Modify: `src/pages/index.astro` (full rewrite)

- [ ] **Step 1: Write `src/components/HeroBlank.astro`** — the signature moment. Word cycles with a blur-settle; static under reduced motion; guards against double-init across view transitions.

```astro
<h1 class="display hero-title">
  We design the <span class="blank"><span class="word" data-hero-word>taste</span></span> you can&rsquo;t name.
</h1>

<style>
  .hero-title { max-width: 14ch; }
  .blank { color: var(--red); font-style: italic; font-variation-settings: 'SOFT' 100; }
  .word { display: inline-block; transition: opacity 0.35s ease, filter 0.35s ease; }
  .word.is-out { opacity: 0; filter: blur(8px); }
</style>

<script>
  function initHeroBlank() {
    const el = document.querySelector<HTMLElement>('[data-hero-word]');
    if (!el || el.dataset.init) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.dataset.init = '1';
    const words = ['taste', 'feeling', 'pull', 'instinct', 'difference'];
    let i = 0;
    setInterval(() => {
      el.classList.add('is-out');
      setTimeout(() => {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.classList.remove('is-out');
      }, 350);
    }, 2800);
  }
  document.addEventListener('astro:page-load', initHeroBlank);
</script>
```

- [ ] **Step 2: Write `src/components/CtaBand.astro`**

```astro
<section class="cta-band">
  <div class="container reveal">
    <p class="eyebrow">Start something</p>
    <h2 class="display">Got something worth tasting?</h2>
    <p class="line">Tell us what you&rsquo;re making. We&rsquo;ll tell you what we&rsquo;d do with it.</p>
    <a href="/contact/" class="btn btn--paper">Start a project</a>
  </div>
</section>

<style>
  .cta-band { background: var(--ink); color: var(--paper); padding-block: var(--space-6); }
  .line { font-size: var(--step-1); opacity: 0.8; margin-block: var(--space-3) var(--space-4); }
</style>
```

- [ ] **Step 3: Rewrite `src/pages/index.astro`** (full home page)

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroBlank from '../components/HeroBlank.astro';
import SectionHeading from '../components/SectionHeading.astro';
import WorkCard from '../components/WorkCard.astro';
import CtaBand from '../components/CtaBand.astro';

const entries = (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);

const services = [
  {
    n: '01',
    name: 'Strategy',
    blurb: 'Positioning, naming, narrative. We find the one true thing about your brand and sharpen it until it cuts through.',
  },
  {
    n: '02',
    name: 'Identity',
    blurb: 'From logo to language — identity systems with a point of view, built to flex and designed to last.',
  },
  {
    n: '03',
    name: 'Web',
    blurb: 'Design and build, under one roof. Fast, accessible, editorial websites that feel as considered as they look.',
  },
];

const steps = [
  { name: 'Discover', blurb: 'We listen before we sketch — stakeholders, customers, competitors. The brief behind the brief.' },
  { name: 'Define', blurb: 'One page, one position, one measure of success. Agreed before any pixels move.' },
  { name: 'Design', blurb: 'Iterative, transparent, opinionated. You see work early and often — never a big reveal.' },
  { name: 'Deliver', blurb: 'Built properly, handed over cleanly, measured honestly.' },
];
---
<BaseLayout
  title="Umami Digital — Strategy, identity and web"
  description="Umami Digital is a strategy, identity and web studio for brands that want to be remembered, not just recognised."
>
  <section class="hero container">
    <HeroBlank />
    <p class="hero-sub">
      Umami is the fifth taste — the depth you notice before you can explain it.
      We bring it to brands: strategy, identity and web for companies that want
      to be remembered, not just recognised.
    </p>
    <div class="hero-actions">
      <a href="/contact/" class="btn btn--solid">Start a project</a>
      <a href="/work/" class="btn">See the work</a>
    </div>
  </section>

  <section class="section container" aria-label="Selected work">
    <SectionHeading eyebrow="Selected work" title="The proof is in the tasting." />
    <div class="work-list">
      {entries.map((e) => (
        <WorkCard
          slug={e.id}
          codename={e.data.codename}
          sector={e.data.sector}
          engagement={e.data.engagement}
          services={e.data.services}
        />
      ))}
    </div>
    <a href="/work/" class="all-link">All work →</a>
  </section>

  <section class="section container" aria-label="What we do">
    <SectionHeading eyebrow="What we do" title="Three disciplines. One standard." />
    <p class="muted intro reveal">Nothing forgettable leaves the studio.</p>
    <div class="services">
      {services.map((s) => (
        <div class="service reveal">
          <span class="n" aria-hidden="true">{s.n}</span>
          <h3>{s.name}</h3>
          <p class="muted">{s.blurb}</p>
        </div>
      ))}
    </div>
  </section>

  <section class="section container" aria-label="How we work">
    <SectionHeading eyebrow="How we work" title="No big reveals. No small print." />
    <ol class="steps">
      {steps.map((s) => (
        <li class="reveal">
          <h3>{s.name}</h3>
          <p class="muted">{s.blurb}</p>
        </li>
      ))}
    </ol>
  </section>

  <CtaBand />
</BaseLayout>

<style>
  .hero { padding-block: var(--space-6); }
  .hero-sub { font-size: var(--step-1); color: var(--ink-70); margin-block: var(--space-4); max-width: 46ch; }
  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
  .work-list { border-bottom: 1px solid var(--hairline); margin-bottom: var(--space-3); }
  .all-link { font-weight: 600; text-decoration: none; }
  .all-link:hover { color: var(--red); }
  .intro { font-size: var(--step-1); margin-bottom: var(--space-4); font-family: var(--font-display); }
  .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-4); }
  .service .n { font-family: var(--font-display); font-size: var(--step-2); color: var(--red); }
  .service h3 { font-size: var(--step-2); margin-block: 0.5rem 0.75rem; }
  .steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-4); counter-reset: step; }
  .steps li { border-top: 2px solid var(--ink); padding-top: var(--space-2); }
  .steps h3 { font-size: var(--step-1); margin-bottom: 0.5rem; }
</style>
```

- [ ] **Step 4: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors; `Complete!`.
In `npm run dev` at `/`: hero word cycles every ~2.8s with blur-settle (and does NOT cycle with macOS Reduce Motion enabled — System Settings → Accessibility → Display); three work rows; services 01–03; four approach steps; dark CTA band; all nav/footer links resolve.

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroBlank.astro src/components/CtaBand.astro src/pages/index.astro
git commit -m "feat: home page with signature hero, work, services, approach, CTA"
```

---

### Task 9: Studio page

**Files:**
- Create: `src/pages/studio.astro`

- [ ] **Step 1: Write `src/pages/studio.astro`** (complete copy included)

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SectionHeading from '../components/SectionHeading.astro';
import CtaBand from '../components/CtaBand.astro';

const principles = [
  { n: '01', name: 'Restraint is a flavour.', blurb: 'The confidence to leave things out is what makes the remaining things land.' },
  { n: '02', name: 'Type does the talking.', blurb: 'Typography carries more identity than any logo. We treat it that way.' },
  { n: '03', name: 'Craft is strategy.', blurb: 'How something is made is part of what it says. Sloppy execution undoes sharp thinking.' },
  { n: '04', name: 'Ship the difference.', blurb: 'A brand isn’t what’s in the deck; it’s what people meet. We build what we design.' },
];

const process = [
  { name: 'Discover', blurb: 'Two weeks of listening: stakeholder interviews, customer conversations, a hard look at the competition. You get the brief behind the brief — what’s actually in the way.' },
  { name: 'Define', blurb: 'Strategy on one page: positioning, audience, message, measure of success. Nothing moves to design until this is agreed, because everything downstream answers to it.' },
  { name: 'Design', blurb: 'Short, opinionated rounds. You see real work in the first week and every week after — direction settles by decision, not by attrition.' },
  { name: 'Deliver', blurb: 'We build what we designed: accessible, fast, documented. Handover includes the system, not just the files.' },
];
---
<BaseLayout
  title="Studio — Umami Digital"
  description="Umami is the fifth taste — the depth you notice before you can explain it. How the studio thinks and works."
>
  <section class="section container">
    <p class="eyebrow">The studio</p>
    <h1 class="display">The fifth taste.</h1>
    <div class="manifesto reveal">
      <p>
        Sweet, salty, sour, bitter — and umami: the one you can&rsquo;t point to,
        but can&rsquo;t miss. Most brands stop at recognisable. The ones people
        return to have something deeper — a quality you notice before you can
        explain it.
      </p>
      <p><strong>That&rsquo;s the thing we make.</strong></p>
    </div>
  </section>

  <section class="section container" aria-label="Principles">
    <SectionHeading eyebrow="Principles" title="Four rules we don't break." />
    <div class="principles">
      {principles.map((p) => (
        <div class="principle reveal">
          <span class="n" aria-hidden="true">{p.n}</span>
          <h3>{p.name}</h3>
          <p class="muted">{p.blurb}</p>
        </div>
      ))}
    </div>
  </section>

  <section class="section container" aria-label="Process">
    <SectionHeading eyebrow="Process" title="How an engagement runs." />
    <ol class="process">
      {process.map((s) => (
        <li class="reveal">
          <h3>{s.name}</h3>
          <p class="muted">{s.blurb}</p>
        </li>
      ))}
    </ol>
    <p class="working reveal">
      We&rsquo;re a small studio by design: senior people only, a direct line to
      whoever is doing the work, and a fixed scope per phase so you always know
      what you&rsquo;re buying.
    </p>
  </section>

  <CtaBand />
</BaseLayout>

<style>
  .manifesto { margin-top: var(--space-4); max-width: 56ch; }
  .manifesto p { font-family: var(--font-display); font-size: var(--step-1); margin-bottom: var(--space-2); }
  .principles { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-4); }
  .principle .n { font-family: var(--font-display); font-size: var(--step-2); color: var(--red); }
  .principle h3 { font-size: var(--step-1); margin-block: 0.5rem 0.75rem; }
  .process { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-4); }
  .process li { border-top: 2px solid var(--ink); padding-top: var(--space-2); }
  .process h3 { font-size: var(--step-1); margin-bottom: 0.5rem; }
  .working { margin-top: var(--space-5); font-size: var(--step-1); font-family: var(--font-display); max-width: 50ch; }
</style>
```

- [ ] **Step 2: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors; `Complete!`. In dev, `/studio/` shows manifesto, four principles, four process steps, working-with-us line, CTA band.

- [ ] **Step 3: Commit**

```bash
git add src/pages/studio.astro
git commit -m "feat: studio page — manifesto, principles, process"
```

---

### Task 10: Contact page

**Files:**
- Create: `src/pages/contact.astro`

- [ ] **Step 1: Write `src/pages/contact.astro`** — real `<label>`s, client-side validation, explicit success/error states. Not wired to a backend (proposal only); the email link is the always-working path.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Contact — Umami Digital"
  description="Tell us what you're making. A sentence is enough to start."
>
  <section class="section container grid">
    <div>
      <p class="eyebrow">Contact</p>
      <h1 class="display">Tell us what you&rsquo;re making.</h1>
      <p class="sub muted">A sentence is enough to start. We reply within two working days.</p>
      <a class="email-link" href="mailto:hello@umamionline.com">hello@umamionline.com</a>
    </div>

    <form id="contact-form" novalidate>
      <div class="field">
        <label for="name">Name</label>
        <input id="name" name="name" type="text" autocomplete="name" required />
        <p class="error" data-error-for="name" hidden>Please tell us your name.</p>
      </div>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" autocomplete="email" required />
        <p class="error" data-error-for="email" hidden>That email doesn&rsquo;t look right.</p>
      </div>
      <div class="field">
        <label for="company">Company <span class="muted">(optional)</span></label>
        <input id="company" name="company" type="text" autocomplete="organization" />
      </div>
      <div class="field">
        <label for="message">What are you making?</label>
        <textarea id="message" name="message" rows="5" required></textarea>
        <p class="error" data-error-for="message" hidden>Give us at least a sentence.</p>
      </div>
      <button type="submit" class="btn btn--solid">Send it over</button>
    </form>

    <div id="form-success" class="success" hidden>
      <h2>Thanks — it&rsquo;s with us.</h2>
      <p class="muted">We&rsquo;ll reply within two working days. If it&rsquo;s urgent,
        email <a href="mailto:hello@umamionline.com">hello@umamionline.com</a>.</p>
    </div>
  </section>
</BaseLayout>

<style>
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); align-items: start; }
  .sub { font-size: var(--step-1); margin-block: var(--space-3); }
  .email-link { font-family: var(--font-display); font-size: var(--step-2); text-decoration: none; border-bottom: 2px solid var(--red); }
  .email-link:hover { color: var(--red); }
  form { display: grid; gap: var(--space-3); }
  .field { display: grid; gap: 0.4rem; }
  label { font-weight: 600; font-size: 0.92rem; }
  input, textarea {
    font: inherit; color: var(--ink); background: #fff;
    border: 1px solid var(--hairline); border-radius: 10px; padding: 0.8rem 1rem;
  }
  input:focus, textarea:focus { outline: 2px solid var(--red); outline-offset: 1px; border-color: transparent; }
  .field.invalid input, .field.invalid textarea { border-color: var(--red); }
  .error { color: var(--red); font-size: 0.85rem; }
  button { justify-self: start; }
  .success h2 { font-size: var(--step-2); margin-bottom: var(--space-2); }
  @media (max-width: 800px) { .grid { grid-template-columns: 1fr; } }
</style>

<script>
  function initContactForm() {
    const form = document.getElementById('contact-form') as HTMLFormElement | null;
    const success = document.getElementById('form-success');
    if (!form || !success || form.dataset.init) return;
    form.dataset.init = '1';

    const setError = (name: string, show: boolean) => {
      const field = form.querySelector(`[name="${name}"]`)?.closest('.field');
      const msg = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
      field?.classList.toggle('invalid', show);
      if (msg) msg.hidden = !show;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') ?? '').trim();
      const email = String(data.get('email') ?? '').trim();
      const message = String(data.get('message') ?? '').trim();

      const nameOk = name.length > 0;
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const messageOk = message.length >= 10;
      setError('name', !nameOk);
      setError('email', !emailOk);
      setError('message', !messageOk);
      if (!nameOk || !emailOk || !messageOk) return;

      // Proposal build: no backend wired. Swap this block for a Web3Forms
      // POST when the site ships.
      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ block: 'center' });
    });
  }
  document.addEventListener('astro:page-load', initContactForm);
</script>
```

- [ ] **Step 2: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors; `Complete!`.
In dev at `/contact/`: submitting empty form shows the three inline errors and does not show success; valid input swaps form for the success panel; email link present; keyboard-only completion possible.

- [ ] **Step 3: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: contact page with validated (unwired) form"
```

---

### Task 11: Accessibility, polish, and final verification

**Files:**
- Modify: `README.md` (rewrite for the new project)
- Possibly touch: any file failing the checks below

- [ ] **Step 1: Rewrite `README.md`**

```markdown
# Umami Digital — Tier-1 Redesign (Proposal)

Internal redesign proposal. Not deployed — `main` still serves the current
live site; this branch (`redesign/tier1`) is viewed locally.

## View the proposal

    npm install
    npm run build
    npm run preview   # open the printed localhost URL

## Stack

Astro 5 · Fraunces + Inter (self-hosted) · no client framework.
Case studies live in `src/content/work/` as markdown; all case-study
visuals are live HTML/SVG components in `src/components/`.

## Spec & plan

- docs/superpowers/specs/2026-06-11-tier1-redesign-design.md
- docs/superpowers/plans/2026-06-11-tier1-redesign.md
```

- [ ] **Step 2: Full-site keyboard pass** (manual, in `npm run preview`)

Tab through every page: skip link appears first on each page; every link/button/input shows the red focus ring; the contact form is completable by keyboard; no focus traps. Fix anything that fails before proceeding.

- [ ] **Step 3: Reduced-motion pass** (manual)

Enable Reduce Motion (System Settings → Accessibility → Display). Reload `/`: hero word is static, reveal sections are immediately visible (not stuck transparent), no movement anywhere. Disable again afterwards.

- [ ] **Step 4: Responsive pass** (manual)

In browser devtools at 375px width, check every page: no horizontal scroll, nav fits (CTA hidden ≤480px by design), screens/specimens stack to one column, type scales down via clamp.

- [ ] **Step 5: Link and output check**

```bash
npm run build
grep -rhoE 'href="/[^"]*"' dist --include='*.html' | sort -u
ls dist dist/work
```

Expected: `dist/` contains `index.html`, `404.html`, `studio/`, `contact/`, `work/` (with `ember/`, `forage/`, `atlas/`), `sitemap-index.xml`, `robots.txt`, favicons. Every internal `href` in the grep output corresponds to a built page (`/`, `/work/`, `/work/ember/`, `/work/forage/`, `/work/atlas/`, `/studio/`, `/contact/`).

- [ ] **Step 6: Lighthouse**

Run: `npm run preview`, then in Chrome DevTools run Lighthouse (mobile) against `/`, `/work/ember/`, `/contact/`.
Expected: ≥95 in Performance, Accessibility, Best Practices, SEO. If Performance dips: check font subsetting (fontsource full.css for Fraunces is the likely culprit — swap to `@fontsource-variable/fraunces` default import plus `@fontsource-variable/fraunces/wght-italic.css` and inline the `font-variation-settings` usages accordingly, then re-measure).

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "chore: README, a11y and performance polish for proposal build"
```

- [ ] **Step 8: Verify branch state**

```bash
git log --oneline main..redesign/tier1
git status
```

Expected: ~11 commits on the branch, clean working tree. `main` untouched (`git diff main --stat -- index.html` shows the old site still present on main).
