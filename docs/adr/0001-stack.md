# ADR 0001: Technology stack

Status: accepted (Phase 1)

## Decision

- Next.js (App Router, React Server Components) with TypeScript in strict mode.
- Tailwind CSS v4, with design tokens defined CSS-first in `src/styles/tokens.css`.
- Self-hosted Geist Sans (SIL OFL) through `next/font/local`. Geist Mono is not loaded yet:
  Phase 1 only uses mono for three tiny labels, which does not justify a 70 KB font, so
  `--font-mono` is the system monospace stack. Geist Mono is added in Phase 4 when code and
  evidence components need it.
- npm as the package manager, with an exact-pinned lockfile (`save-exact=true`).
- Playwright with axe-core for accessibility and security-header tests.

## Rationale

- Server Components keep client JavaScript near zero. The only client component in Phase 1
  is the mobile menu, and it is tiny.
- CSS-first Tailwind keeps tokens in one readable file and removes a config file.
- Local fonts remove third-party requests, which keeps the CSP tight and the page fast.
- npm ships with Node and adds no setup on Windows.

## Deliberately not added

- No UI kit, no animation library, no smooth-scroll library, no icon package. Animation
  is CSS (transform and opacity only). The two brand icons are inlined SVG (Lucide is
  moving away from brand icons). `motion`, `zod`, `lucide-react` and MDX arrive only when a
  component needs them.
- No `clsx`: `src/lib/cn.ts` is six lines.
- ESLint is on v9 because `eslint-config-next` does not yet support v10. Revisit when it does.

## Note on planned routes

Routes that are not built yet are flagged `live: false` in `src/config/nav.ts`. They render
as clearly-marked disabled items for the owner in development (or with `SHOW_PLANNED=true`)
and are omitted from public production builds, so visitors never meet a dead link.
`typedRoutes` is off until the routes exist; turn it on in Phase 2.

## Update

The data layer (PostgreSQL with Prisma) is decided in `docs/adr/0004-postgresql-prisma-data-layer.md`.
The earlier plan to author case studies in MDX is superseded there: case studies become typed,
validated content blocks so nothing stored in the database is ever compiled.
