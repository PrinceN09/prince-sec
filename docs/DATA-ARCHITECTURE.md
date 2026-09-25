# PrinceSec Data Architecture

PostgreSQL with Prisma ORM is the planned structured backend. This document is the design;
`docs/adr/0004-postgresql-prisma-data-layer.md` records the decision. **Nothing here is built
or installed yet, and Phase 1 has no database dependency.**

## 1. Principles

1. The browser never touches the database.
2. The public read path does not query Postgres per request (snapshot or files).
3. Credentials are server-side, least-privilege, and separated by purpose.
4. Migrations are version-controlled SQL, applied by CI or by you, never by the running app.
5. Nothing stored in the database is compiled or executed.
6. Skills are never self-rated. A skill's state (Demonstrated, In Progress, Learning) is derived
   from evidence at read time. There is deliberately no `level` column.
7. The database enforces the site's honesty rules (redaction review, alt text, dates) so no
   script or future admin screen can bypass them.

## 2. What lives where

| Data                                           | Store                                                 | Notes                                                       |
| ---------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| Projects, sections, taxonomy, learning entries | Postgres (system of record from Stage B)              | Files until the admin phase (see section 4)                 |
| Case-study narrative and evidence structure    | Postgres `ProjectSection.content` (typed JSON blocks) | Validated by Zod on write and on read                       |
| Screenshots and diagrams (bytes)               | Repo `public/` at first, object storage later         | Postgres holds metadata, alt text and redaction status only |
| Contact messages                               | Postgres only                                         | Personal data: minimal fields, automatic expiry             |
| Rate-limit counters                            | Provider edge/WAF or a small store                    | Not in the content database                                 |
| Secrets                                        | Host environment variables / secrets manager          | Never in the repository                                     |

## 3. Data flow

```
                    BUILD / PUBLISH TIME                          REQUEST TIME
 (Stage A)  content/*.ts ──import (idempotent)──► Postgres        Browser ──► Next.js server
               │                                     │                          │  reads typed content
               └──────────────► ContentSource(files) ┘                          ▼
 (Stage B)  Postgres ──content:export (Zod-validated)──► snapshot.json ─► ContentSource(snapshot)
                                                                                │
                                              no database call on page views ◄──┘

 Contact form:  Browser ─► POST /api/contact (server) ─► app_runtime role ─► INSERT ContactMessage
                (the only runtime write path; failure degrades to a mailto fallback, the site stays up)
```

`ContentSource` is a small interface (`getProjects`, `getProject(slug)`, `getSkills`, …) with three
implementations: `files`, `snapshot`, and `db` (used by scripts and the future admin, not by
public pages). Public pages import only the interface, selected by `CONTENT_SOURCE`.

## 4. System of record

- **Stage A** (Phase 2 until admin ships): files are the system of record; the database mirrors them
  through an idempotent import. Nothing edits the database directly.
- **Stage B** (admin ships): the database is the system of record; the site reads a snapshot
  exported from it. Files become a read-only export for backup and review.

The flip is a single setting because pages only know the interface.

## 5. Schema overview

Draft: `docs/data/schema.draft.prisma` (13 models, validated against Prisma 7.10.0's schema
engine). Key decisions:

- **Taxonomy** (`Domain`, `Tool`, `Skill`) uses natural slug primary keys ("soc", "wazuh") so content
  and seeds stay readable and typos fail as foreign-key errors.
- **`Project`** carries the metadata, the 30-second glance block, `visibility` (DRAFT/PUBLIC),
  `featured`, and `sanitizationReviewed`. Domains, tools and skills are explicit join tables. Deleting
  a taxonomy row that is in use is blocked (`Restrict`); deleting a project cascades.
- **`ProjectSection`** is one row per case-study section (`SUMMARY`, `SCENARIO`, `DETECTION`,
  `INVESTIGATION`, `INDICATORS`, `OUTCOME`, …) with a typed `content` JSON tree. A section that does not
  exist is not rendered, so a small lab never needs empty headings.
- **`Asset`** stores metadata only: storage key, dimensions, checksum, required alt text, and
  `redactionReviewed`. Bytes live in object storage or the repo.
- **`LearningEntry`** covers certifications, training, learning paths and lab series with a status. For
  a certification, COMPLETED means earned. Entries link to domains and skills, which is what
  drives the "Learning" state on the Coverage Map.
- **`ContactMessage`** has bounded lengths, an HMAC of the IP instead of the IP, a Turnstile result, a
  triage status, and a mandatory `purgeAfter` date.
- Table names use Prisma defaults (PascalCase) and columns are camelCase; hand-written SQL uses
  quoted identifiers.
- Deferred until the admin phase: admin users, sessions, audit log, publish/release history.

Integrity rules Prisma cannot express are tested SQL in `docs/data/integrity-checks.draft.sql`:
a public completed project must be redaction-reviewed; completed needs a completion date; dates
cannot run backwards; only public projects can be featured, and only one at a time; assets need
non-blank alt text; completed learning needs a date; contact purge dates lie in the future.

## 6. Content blocks

`ProjectSection.content` is a discriminated union validated by Zod (`src/lib/content/schema.ts`,
Phase 2), for example: `markdown` (no raw HTML), `code`, `figure` (asset id, alt, caption),
`table`, `indicator-list`, `alert`, `stage` (with ordered `step`s), `callout`. The Investigation Rail,
IOC table and alert cards render from these blocks. Asset ids inside blocks are checked to exist
and to belong to the project before a write is accepted. The same block types are used by the file
source, so there is one rendering path.

## 7. Security architecture

**Credentials and the client boundary**

- `DATABASE_URL` (runtime, pooled, role `app_runtime`) and `DIRECT_URL` (migrations, role
  `app_migrator`) are server-only variables. Nothing is prefixed `NEXT_PUBLIC_`.
- `DIRECT_URL` exists only on your machine and in the CI migration job. It is never set on the
  deployed application, so a compromised app cannot alter the schema.
- All database code lives in `src/server/` and starts with `import "server-only"`, which makes the
  build fail if a client component imports it.
- ESLint `no-restricted-imports` blocks `@/server/*`, `@prisma/*` and `pg` inside `src/components`.
- A CI step scans the built client bundle (`.next/static`) for database URL fragments and Prisma/pg
  markers and fails if any are found.
- Environment variables are parsed once with Zod in a server-only module that fails fast at boot.

**Least-privilege roles** (`docs/data/roles.draft.sql`, tested on Postgres 16)

- `app_runtime`: SELECT on content tables, INSERT on `ContactMessage` plus `SELECT (id)` only so
  `INSERT … RETURNING id` works (call `create({ data, select: { id: true } })`). No UPDATE, no
  DELETE, no DDL.
- Row-level security lets `app_runtime` see only `PUBLIC` rows, so even a query bug cannot leak a draft.
  Verified: with one draft and two public projects, the runtime role sees two; the owner sees three.
- A future admin role gets its own grants and is never the runtime role.

**Transport, injection, PII**

- TLS required (`sslmode=verify-full` where the provider supports it). Managed Postgres with encryption
  at rest, automated backups and point-in-time recovery; restore is tested before launch.
- Prisma's typed API is parameterised. `$queryRawUnsafe` and `$executeRawUnsafe` are banned by lint.
- Contact data: only what is needed; raw IP never stored (HMAC with a server secret); rows expire
  automatically; not logged; never rendered as HTML; retention period to be confirmed by you.
- Connection pooling: serverless hosts need the provider's pooled endpoint for runtime and a direct
  endpoint for migrations. Pooler compatibility with `@prisma/adapter-pg` is a Phase 2b spike item,
  not an assumption.

## 8. Migrations

- `prisma/migrations/` and `migration_lock.toml` are committed. The generated SQL is reviewed like code.
- Local: `prisma migrate dev` against a local database. Never `db push` outside a throwaway database.
- CI (pull requests): start an ephemeral Postgres service container with a throwaway password, apply all
  migrations, run the integrity tests, and fail on schema drift between migrations and `schema.prisma`.
- Production: a separate CI job with a protected GitHub Environment (required reviewer) runs
  `prisma migrate deploy` with `DIRECT_URL` before the app deploys. The app never migrates itself.
- Destructive changes use expand/contract across two releases so the previous app version keeps working.
- A guard script refuses `migrate reset` or destructive commands unless the target host is localhost.
- Hand-written SQL (constraints, roles, RLS) is added with `migrate dev --create-only`, so it is
  versioned like everything else.

## 9. Planned files (Phase 2b, after approval)

```
prisma/schema.prisma            prisma/migrations/…            prisma.config.ts
prisma/seed/                    (taxonomy: domains, tools, skills)
src/server/db/client.ts         (server-only singleton, PrismaPg adapter)
src/server/db/env.ts            (Zod-validated server env)
src/server/content/{source.ts,files-source.ts,snapshot-source.ts,db-source.ts,index.ts}
src/lib/content/schema.ts       (Zod block + entity schemas, shared by all sources)
scripts/{content-import.ts,content-export.ts,db-guard.mjs}
docker-compose.dev.yml          (local Postgres bound to 127.0.0.1, dev-only credentials)
.github/workflows/ci.yml        (+ postgres service job, drift check, client-bundle scan)
docs/data/…                     (drafts move into prisma/)
```

## 10. Environment variables

| Variable         | Where                         | Purpose                                               |
| ---------------- | ----------------------------- | ----------------------------------------------------- |
| `DATABASE_URL`   | app runtime                   | Pooled connection as `app_runtime`                    |
| `DIRECT_URL`     | local + CI migration job only | Direct connection as `app_migrator` for migrations    |
| `CONTENT_SOURCE` | app                           | `files` (default), `snapshot`, later `db` for scripts |
| `IP_HASH_SECRET` | app (Phase 7)                 | Key for the contact-form IP HMAC                      |

## 11. Roadmap change

- Phase 1: complete, no database.
- Phase 2: content system on `ContentSource` with the file implementation and Zod schemas that mirror the model.
- **Phase 2b (new): data foundation.** Prisma 7.10.0 pinned, schema and first migration, integrity-checks
  migration, seed and import, snapshot export and source, roles, CI Postgres job, boundary lint and bundle
  scan, local dev database. No admin.
- Phase 7: contact uses `ContactMessage` through the insert-only role.
- Later: admin (authentication with passkeys or equivalent, audit log, publish flow, Stage B switch).

## 12. What was verified, and what was not

Verified here:

- The draft schema is valid under Prisma 7.10.0's schema engine (WASM), 13 models.
- Integrity constraints and the role/RLS SQL were applied to a real PostgreSQL 16.13 and behaved as
  designed (12 constraint cases, 9 privilege cases).

Not verified, because the sandbox blocks Prisma's engine download (`binaries.prisma.sh`):

- Prisma-generated migration SQL, `prisma generate`, and the Prisma client against a database. The
  tested SQL used hand-made stand-in tables with the same names and columns, not Prisma-generated DDL.
  The first `migrate dev` on your machine is the real check.
- Pooled-endpoint behaviour with the `pg` adapter, and exact Prisma 7 CLI flags for the drift check. Both
  are confirmed at scaffold time.

## 13. Decisions I need from you

1. Approve the two-stage system-of-record plan (files first, database once admin exists).
2. Confirm dropping MDX for case studies in favour of typed blocks.
3. Postgres host preference: a serverless managed Postgres with pooled and direct endpoints
   (my default recommendation, current pricing and limits not checked), or another provider.
4. Do you have Docker Desktop on Windows for a local dev database, or should we use a hosted dev branch?
5. Contact-message retention period (my default: 90 days).
