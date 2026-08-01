# Sofya — Portfolio 2026

Интерактивное инженерное портфолио Софьи Гришковой на Vite, GSAP и Three.js.

```bash
npm install
npm run dev
```

Контент адаптирован по `Sofya_Grishkova_CV.pdf`.

## Production

```bash
npm run build          # production bundle in dist/
npm run deploy:check   # build + Cloudflare dry run
npm run deploy         # build + Cloudflare deploy
```

Cloudflare configuration lives in `wrangler.jsonc`. Static headers, caching,
security policy, manifest, robots and sitemap are copied from `public/` during
the Vite build. The canonical production URL is `https://grisshk.work/`.

## Interactive experience

The hero contains an interactive Three.js experience orbit, with GSAP-driven
motion and reduced-motion/mobile fallbacks. Three.js and GSAP are split into
cacheable vendor chunks for production.

## Local inspiration sources

- `portfolio-website` — MIT; 3D scene interaction and loading/UI language.
- `kintarowwwards` — MIT; cursor spring, particle-field and blur-reveal principles.
- `shader-gallary` — scroll-velocity and pointer-parallax principles.
- `stack-scroll` — stacked, scroll-driven content choreography.
- `AW-2025-Portfolio` — CC BY-NC 4.0; wave-grid, binary separator, screen wipes and typographic direction were substantially reworked for this portfolio.

The local PP font files came with the AW reference repository, but no separate
font licence was included. Verify or replace their licences before commercial
publication. Unused source assets are kept in `source-assets/` and are excluded
from the deployed bundle.
