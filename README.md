# Umami Digital

The Umami Digital website — [umamionline.com](https://umamionline.com).
Deployed automatically to GitHub Pages on push to `main`
(`.github/workflows/deploy.yml`).

## Local development

    npm install
    npm run dev       # local dev server
    npm run build     # production build
    npm run preview   # serve the production build locally

## Stack

Astro 5 · Fraunces + Inter (self-hosted) · no client framework.
Case studies live in `src/content/work/` as markdown; all case-study
visuals are live HTML/SVG components in `src/components/`.

## Spec & plan

- docs/superpowers/specs/2026-06-11-tier1-redesign-design.md
- docs/superpowers/plans/2026-06-11-tier1-redesign.md
