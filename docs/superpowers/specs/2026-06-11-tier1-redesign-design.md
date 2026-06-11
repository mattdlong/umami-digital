# Umami Digital — Tier-1 Redesign Design Spec

**Date:** 2026-06-11
**Status:** Approved
**Goal:** Reimagine umamionline.com from a single-page template-grade site into a tier-1 digital agency website.

## 1. Background & Review Findings

The current site is a single static page (vanilla HTML/CSS/JS on GitHub Pages). Key problems identified in the full review:

- **Content:** interchangeable agency copy; the "umami" brand concept unused; portfolio is three AI-generated images with garbled text and no case studies; zero social proof; contact form silently discards submissions (`console.log` only).
- **Design:** 2015-template aesthetic (glassmorphism + gradient blobs + 3D tilt + magnetic buttons + ripples all at once); system font stack; gradient treatment that fights the flat red logo; live bug — `cursor: none` on nav links hides the cursor.
- **Technical:** ~7.5MB unoptimized PNGs; broken lazy-load (targets `data-src` no image uses); compounding `transform +=` scroll bug; no OG/Twitter meta, sitemap, or structured data; no reduced-motion support, focus styles, or skip link.

## 2. Decisions (user-confirmed)

| Decision | Choice |
|---|---|
| Stack | Astro 5, deployed to GitHub Pages via GitHub Actions, CNAME preserved |
| Design direction | Minimal editorial (light, type-driven, red as precision accent) |
| Scope | Multi-page |
| Positioning | Aspirational/broad — strategy, identity, web — with a confident point of view |
| Work section | Three **anonymized-composite-style case studies** written in authentic tier-1 agency voice (confidential-client codenames, sector descriptors, engagement narrative). Built as demonstration content for Umami executives to evaluate the format — the site is an internal example/proposal and will not be published live. No fabricated testimonials, client logos, or invented business metrics. Real client work replaces the composites later via frontmatter only. |

## 3. Brand Platform — "The Fifth Taste"

Umami is the taste you can't name but instantly recognize. Platform statement: **"We make the thing you can't quite name — the difference between a brand people use and a brand people remember."** Voice: confident, editorial, sensory, restrained. No hype adjectives, no gradient-speak.

## 4. Site Architecture

```
/                 Home
/work/            Work index
/work/ember/      Case study: Ember
/work/forage/     Case study: Forage
/work/atlas/      Case study: Atlas
/studio/          Point of view, principles, process
/contact/         Working contact form + email
/404              Designed 404
```

### Page contents

- **Home:** manifesto hero (signature motion moment), selected work (3 cards), services (Strategy / Identity / Web — opinionated descriptions, numbered 01–03), condensed approach, contact CTA band (dark punctuation section).
- **Work index:** all case studies, presented straight in anonymized-composite format.
- **Case study (template):** hero (codename, sector descriptor — e.g. "A national restaurant group", role tags) → brief → approach → identity system shown as **live HTML/SVG artifacts** (type specimens, palettes) → screens as crisp HTML/CSS mockup frames → outcome written as engagement-style design rationale. No invented business metrics, testimonials, or named real companies. The three existing AI-generated PNGs are deleted.
- **Studio:** the platform statement expanded; 3–4 principles; engagement process (Discover → Define → Design → Deliver); what working together is like.
- **Contact:** designed contact form (client-side validation and success/error states demonstrated) + direct email link. Since this is a proposal with no live site, the form is not wired to a backend; Web3Forms wiring is a one-line follow-on if the site ever ships.

### Case study concepts (anonymized composites, codenamed)

| Slug | Codename | Sector descriptor | Engagement | Demonstrates |
|---|---|---|---|---|
| `ember` | Ember | A multi-venue restaurant group | Identity refresh + booking platform | Brand + hospitality (on-theme) |
| `forage` | Forage | A zero-waste grocery retailer | E-commerce design + build | E-comm UX + art direction |
| `atlas` | Atlas | An early-stage fintech | Product design for a freelancer banking tool | Product design + web app |

## 5. Design System

- **Typography:** Fraunces (variable, display) + Inter (variable, text/UI). Self-hosted woff2, `font-display: swap` with size-adjusted fallbacks to avoid layout shift.
- **Color:** paper `#FAF7F2`, ink `#141414`, umami red `#E94E3D` (accent only — underlines, markers, hover, the hero blank). Dark sections (`#141414` ground) used only as punctuation (contact band, footer). **No gradients anywhere.**
- **Layout:** 12-column grid, max-width ~1200–1320px, oversized display headlines (clamp-based), hairline rules, numbered sections, generous vertical rhythm.
- **Motion:**
  - Signature: hero headline "We design the *[blank]* you can't name" — the blank cycles through sense words with a soft blur-settle (CSS + small JS, pausable, reduced-motion → static word).
  - Supporting: quiet IntersectionObserver reveals (opacity/translate only), Astro view transitions between pages.
  - Hard rule: every animation respects `prefers-reduced-motion`.
- **Logo:** redrawn as inline SVG (rounded red square + UD + wordmark); favicon set retained.

## 6. Technical Architecture

- **Astro 5**, static output. Case studies as a content collection (`src/content/work/*.md` + frontmatter schema via zod).
- **Components:** layout (Base, Nav, Footer), primitives (Button, Tag, SectionHeading, Rule), case-study artifacts (TypeSpecimen, PaletteSwatch, ScreenFrame), home sections.
- **Images:** `astro:assets` for any raster images; prefer SVG/HTML artifacts. Old PNGs (approach/work/AI images) deleted; logo PNGs replaced by SVG.
- **SEO:** per-page title/description, canonical, Open Graph + Twitter cards, generated OG image, `@astrojs/sitemap`, robots.txt, JSON-LD Organization.
- **Accessibility:** skip link, semantic landmarks, visible focus styles, AA contrast, real `<label>`s on the form, reduced-motion.
- **Delivery:** internal example/proposal only — no live deployment. Work happens on a feature branch (`redesign/tier1`) so the existing site currently served at umamionline.com from `main` stays untouched; executives view the proposal via `astro build && astro preview` (or a shared zip of `dist/`). Deploy automation is out of scope; if the proposal is approved later, a GitHub Actions → Pages pipeline is a small follow-on.
- **Budgets:** Lighthouse ≥95 (all categories), <200KB first-load transfer, zero CLS from fonts/images.

## 7. Error Handling

- Contact form: client-side validation, explicit success state, explicit failure state with direct email fallback ("or email hello@umamionline.com"). Not wired to a backend for the proposal; email link always works.
- Designed 404 routes users back to home/work.

## 8. Testing & Verification

- `astro build` + `astro check` clean.
- Manual pass per page: desktop + 375px mobile, keyboard-only navigation, reduced-motion enabled.
- Lighthouse run against the production build (budgets above).
- Link check across all internal links.

## 9. Out of Scope

Journal/blog, CMS, dark-mode toggle, analytics, i18n. All additive later; none required for launch.

## 10. Elevation Pass Addendum (2026-06-11, post-launch)

User feedback: too sparse for tier-1. Keep the system; add density of craft:

- **ProjectArt** — bespoke SVG color-field compositions per project (Ember/Forage/Atlas palettes, subtle grain), used on work cards and case heroes with Astro view-transition continuity (art + title morph from card to case page).
- **Case studies** — full-bleed hero on the project's ground colour with art; numbered narrative headings (CSS counters); artifacts on a full-bleed tint band; ink next-case band.
- **Home** — ghost "umami" word in hero; marquee strip (Strategy · Identity · Web · The fifth taste); staggered asymmetric services grid.
- **Studio** — full-width pull-quote band; offset two-column principles grid.
- **Footer** — oversized full-width wordmark.
- **Micro-interactions** — button lift, work-card art zoom, animated link underlines. All motion remains reduced-motion safe; all text combinations stay AA.
