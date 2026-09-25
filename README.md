# PrinceSec

The cybersecurity portfolio of **Prince Ntunka**: engineering security, detection and
incident response, built on a foundation in software, cloud infrastructure and DevOps.

Next.js (App Router) · TypeScript (strict) · Tailwind CSS v4 · self-hosted Geist Sans.

## Run it

Requires Node.js 20.9 or newer (`.nvmrc` pins 22).

```bash
npm install          # first time only
npm run dev          # http://localhost:3000
```

## Scripts

| Command                           | What it does                                                           |
| --------------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`                     | Development server                                                     |
| `npm run build` / `npm start`     | Production build and server                                            |
| `npm run lint`                    | ESLint                                                                 |
| `npm run typecheck`               | TypeScript, no emit                                                    |
| `npm run format` / `format:check` | Prettier                                                               |
| `npm run test:a11y`               | Playwright + axe accessibility and security-header tests (build first) |
| `npm run verify`                  | lint + typecheck + build + tests                                       |

First time running the tests: `npx playwright install chromium`.

## Configuration

- **Identity, brand and all outbound links** live once in `src/config/site.ts`
  (LinkedIn, GitHub, résumé path, contact email). Leave a value `undefined` until it exists:
  it is hidden from public builds and shown as a marked placeholder in development.
- **Navigation and route status** live in `src/config/nav.ts`. Set `live: true` when a page ships.
- **Environment variables**: copy `.env.example` to `.env.local`. Never commit real secrets.
- **Résumé**: put the PDF at `public/resume.pdf` (create the folder) and set `links.resume` to `"/resume.pdf"`.

## Structure

```
src/app/           routes, metadata, sitemap, robots, security.txt, icons, OG image
src/components/    brand, layout, home, icons, ui
src/config/        site, nav, security headers
src/proxy.ts       per-request CSP nonce
src/styles/        design tokens + global styles
src/fonts/         Geist Sans (SIL OFL)
docs/              SECURITY.md, ADRs, EVIDENCE-CHECKLIST.md
tests/             accessibility and security tests
```

## Principles

Evidence over claims. Nothing here is invented: missing information is a clearly marked
placeholder, never fabricated content. See `docs/SECURITY.md` and `docs/EVIDENCE-CHECKLIST.md`.

## Architecture

Static-first: the public site reads typed content and never queries a database on page views.
PostgreSQL with Prisma is the planned structured backend (projects, skills, certifications,
contact data, later admin), kept strictly server-side and least-privilege. See
`docs/DATA-ARCHITECTURE.md`.

## Status

Phase 1 (foundations, brand, design system, shell, hero) is complete, with no database dependency.
Next: Phase 2 (content system) and Phase 2b (data foundation), then case studies, projects, contact
and the remaining pages.
