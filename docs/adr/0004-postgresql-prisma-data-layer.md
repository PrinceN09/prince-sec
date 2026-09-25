# ADR 0004: PostgreSQL and Prisma as the structured backend

Status: accepted (architecture only; nothing is built or installed yet)

## Decision

PostgreSQL, accessed through Prisma ORM, becomes the structured backend for projects,
skills, tools, domains, certifications and learning, evidence assets (metadata), contact
messages, and later the admin functions. Phase 1 stays exactly as it is: static-first, with no
database dependency of any kind.

Five rules govern everything that follows:

1. **The browser never touches the database.** No client-side DB access, no `NEXT_PUBLIC_`
   database variables, no database code importable from a client component.
2. **The public read path does not query Postgres per request.** The public site reads typed
   content from a `ContentSource`, backed by files today and by a validated published snapshot
   exported from Postgres later. If the database is down, the portfolio is still up.
3. **Credentials are server-side and least-privilege.** The deployed app connects as a role that
   can read public content and insert contact messages, and can do nothing else.
4. **Schema changes are version-controlled migrations**, reviewed as SQL, applied by CI or by
   you, and never by the running app.
5. **Nothing stored in the database is ever compiled or executed.** Case-study content is a
   typed block tree validated with Zod and rendered by our own React components. No MDX from
   the database.

## Options considered

- **Database on the public read path (server components query Postgres per request).** Simple,
  and always fresh, but it couples uptime and latency of every page view to the database, adds
  cost, and widens the attack surface of the most exposed code. Rejected as the default.
- **Static-first with a DB-derived snapshot (chosen).** The database is the structured system of
  record once admin exists; the public site consumes a validated snapshot, so page views need no
  database. Publishing is a snapshot export plus a rebuild or revalidation. This keeps the
  Phase 1 promise and the CSP/performance work intact.
- **Keep everything in files, add a database only for contact.** Lowest complexity, and it is
  what Phase 2 does at first. It does not give the queryable, editable backend you asked for, so
  it is only the first stage of the migration path, not the destination.

## System of record: an explicit two-stage switch

Two live sources of truth for the same content is how portfolios rot, so the switch is explicit.

- **Stage A (Phase 2 onward, until admin exists):** content files are the system of record. The
  site reads them. An idempotent import script mirrors them into Postgres, which is used for
  integrity checks, queries, and admin readiness. Contact messages already live only in Postgres.
- **Stage B (when the admin phase ships):** Postgres is the system of record. The site reads a
  published snapshot exported from it (`CONTENT_SOURCE=snapshot`). The files become a read-only
  export and backup.

The flip is one configuration change because the site only ever talks to the `ContentSource`
interface.

## Why not MDX in the database

Compiling MDX means executing JavaScript. Content that is edited through a web admin and stored
in a database must therefore be treated as code, which turns any admin compromise or injection
into remote code execution on the server. A typed block model (headings, Markdown text with no
raw HTML, code, screenshots with required alt text, tables, indicators, alerts, stages and
steps) gives the same storytelling with a bounded, validated, testable surface. This is a
change from the earlier "MDX for case studies" plan and needs your confirmation.

## Versions

Prisma ORM **7.10.0** (stable), pinned exactly with `@prisma/client` and `@prisma/adapter-pg`.
At the time of writing npm's `latest` tag for `prisma` points at an **8.0 release candidate**,
so a bare `npm install prisma` would install a release candidate. Always pin. Revisit 8.x once
it is generally available.

## Consequences

- New dependencies arrive in Phase 2b, not now: `prisma` (dev), `@prisma/client`,
  `@prisma/adapter-pg`, `pg`, `server-only`, and `zod` (already planned).
- The existing Phase 1 code, tests and deployment are untouched.
- The full design lives in `docs/DATA-ARCHITECTURE.md`; a validated draft schema in
  `docs/data/schema.draft.prisma`; and tested SQL drafts in `docs/data/`.
