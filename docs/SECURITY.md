# PrinceSec Security Notes

A cybersecurity portfolio is judged on its own hygiene. This document records the
security decisions behind PrinceSec, the reason for each, and what is still to come.
Update it whenever a decision changes.

## Scope and threat model (Phase 1)

PrinceSec is a public, read-only site with no accounts, no database and no user-generated
content. The realistic threats are: script injection (XSS) through content or dependencies,
clickjacking, malicious or hijacked third-party resources, leaked secrets in the repository,
vulnerable dependencies, and, from Phase 7, abuse of the contact form.

## Controls in place

| Control                                                                           | Where                                            | Why                                                                                                  |
| --------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Nonce-based CSP with `strict-dynamic`                                             | `src/proxy.ts`, `src/config/security-headers.ts` | Blocks injected inline scripts; no `unsafe-inline`, no `unsafe-eval` in production. See ADR 0002.    |
| `frame-ancestors 'none'` + `X-Frame-Options: DENY`                                | same                                             | Clickjacking protection, including old browsers.                                                     |
| `base-uri 'none'`, `object-src 'none'`, `form-action 'self'`                      | CSP                                              | Removes base-tag and plugin injection and off-site form posts.                                       |
| HSTS (2 years, includeSubDomains)                                                 | `next.config.ts`                                 | HTTPS only. `preload` is deliberately off until launch; preloading is hard to undo.                  |
| `X-Content-Type-Options: nosniff`                                                 | headers                                          | Stops MIME sniffing.                                                                                 |
| `Referrer-Policy: strict-origin-when-cross-origin`                                | headers                                          | Avoids leaking paths to other origins.                                                               |
| `Permissions-Policy` denying camera, mic, geolocation, USB, payment, etc.         | headers                                          | The site needs none of them.                                                                         |
| COOP `same-origin`, CORP `same-site`                                              | headers                                          | Process isolation and hotlink protection.                                                            |
| `X-Powered-By` removed                                                            | `next.config.ts`                                 | Do not advertise the framework.                                                                      |
| Self-hosted fonts, no third-party requests                                        | `src/fonts`, `next/font/local`                   | No external origins, so a tight CSP and no visitor tracking by CDNs.                                 |
| Outbound links validated (https only) and opened with `rel="noopener noreferrer"` | `ButtonLink`, `IconLink`                         | Prevents `javascript:` targets and reverse tabnabbing. Invalid URLs fail the build/render.           |
| No `dangerouslySetInnerHTML`, no user input rendered                              | codebase                                         | Nothing to inject into.                                                                              |
| Secrets policy                                                                    | `.gitignore`, `.env.example`, gitleaks in CI     | `.env*` is ignored except the example; there are no secrets in Phase 1.                              |
| `SITE_URL` validated                                                              | `getSiteUrl()`                                   | Rejects non-https origins outside localhost.                                                         |
| Minimal dependencies                                                              | `package.json`                                   | Runtime deps are only `next`, `react`, `react-dom`.                                                  |
| Dependency and code scanning                                                      | `.github/workflows/ci.yml`, `dependabot.yml`     | `npm audit`, CodeQL, gitleaks, and weekly update PRs.                                                |
| Security tests                                                                    | `tests/security-headers.spec.ts`                 | Headers, CSP strictness, nonce uniqueness, and zero CSP violations are asserted on every build.      |
| `security.txt` (RFC 9116)                                                         | `src/app/.well-known/security.txt/route.ts`      | Generated from config; returns 404 until a real contact is set, so no placeholder is ever published. |

## Secrets and environment variables

- Real values live only in `.env.local` (git-ignored) or the hosting provider's encrypted
  environment settings. `.env.example` documents names with safe placeholder values.
- Nothing is prefixed `NEXT_PUBLIC_`, so nothing is bundled into browser code.
- From Phase 7 the contact form's mail and CAPTCHA secrets are server-only and are read
  only inside the route handler.

## Evidence hygiene (for case studies)

- Never host malware samples; publish hashes only.
- Redact real IPs, personal names, hostnames, tokens and credentials from every screenshot
  and log, on a copy. Keep raw originals private. See `docs/EVIDENCE-CHECKLIST.md`.
- Indicators of compromise are displayed defanged by default (Phase 2+).

## Deferred (planned, not yet built)

- PostgreSQL + Prisma data layer: least-privilege roles, row-level security, server-only
  boundary enforcement, version-controlled migrations, contact-data retention. Design in
  `docs/DATA-ARCHITECTURE.md` and `docs/adr/0004-postgresql-prisma-data-layer.md`.
- Contact form: server-side Zod validation, honeypot + time trap, Cloudflare Turnstile, rate
  limiting, Origin/Sec-Fetch-Site checks, header-injection stripping (Phase 7).
- HSTS preload submission (after launch and a DNS/HTTPS review).
- Subresource Integrity is not needed today (no third-party scripts).
- Branch protection, required reviews and 2FA on GitHub and the host: account settings,
  to be enabled when the repository is created.

## Verifying

```bash
npm run verify        # lint + typecheck + build + accessibility + security tests
```

External check after deploy: securityheaders.com and Mozilla Observatory.
