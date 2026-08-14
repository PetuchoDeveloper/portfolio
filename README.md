# Petucho — Portfolio

Personal portfolio site: built to win freelancing clients and rank in search.

**Stack:** [Astro](https://astro.build) (static-first, zero JS shipped to the
browser by default) + `@astrojs/sitemap`. Self-hosted variable fonts
(Space Grotesk, Fraunces). No trackers, no cookies, no client-side framework.

## Design language

- Near-black violet surfaces, one flat wisteria accent, **no gradients**.
- Oversized display type, uppercase eyebrows, hairline borders, generous
  negative space. Footer uses an oversized wordmark.

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero + proof numbers + services + featured work + process + CTA |
| `/work/` | Project index (SED flagship; more case studies pending) |
| `/work/sed/` | SED case study |
| `/services/` | Two primary offers + included security review |
| `/about/` | Positioning and working method |
| `/contact/` | Email-first contact (mailto form, no backend) |
| `/blog/` | SEO content (content collection, markdown) |

## SEO

- Canonical URLs, Open Graph + Twitter cards, `sitemap-index.xml`, `robots.txt`.
- JSON-LD: `Person` (site-wide), `ProfessionalService` (home),
  `SoftwareApplication` (SED case study), `BlogPosting` (articles).
- Add real content to `src/content/blog/` — articles are the long-tail engine.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
```

Remote preview over SSH (loopback-only):

```bash
# on your machine
ssh -L 4321:127.0.0.1:4321 opc@<host>
# open http://127.0.0.1:4321
```

## Deploy

Any static host (Netlify, Vercel, Cloudflare Pages, or an Nginx box):

```bash
npm run build      # outputs dist/
```

Before going public: replace `petucho.dev` in `astro.config.mjs`,
`src/data/site.ts`, and `public/robots.txt` with the real domain. The OG
image lives at `public/og.jpg` (1200×630) — regenerate it if you change the
brand line.
