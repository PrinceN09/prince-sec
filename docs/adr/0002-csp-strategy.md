# ADR 0002: Content Security Policy strategy

Status: accepted (Phase 1 spike)

## Options considered

1. **Static CSP with `'unsafe-inline'`** (set in `next.config.ts`). Keeps pages fully static and
   CDN-cacheable, but `script-src 'unsafe-inline'` removes most of the value of a CSP against XSS.
2. **Nonce-based CSP with `'strict-dynamic'`** (set per request in `src/proxy.ts`). Strong
   protection, but Next.js can only apply a nonce during server rendering, so every page is
   rendered per request (no static optimisation, no CDN page cache).
3. **Hash/SRI-based CSP for static pages.** Keeps static rendering, but Next.js inline bootstrap
   scripts change per page and the approach is experimental and bundler-dependent.

## Decision

Option 2. For a security portfolio, a strict, verifiable CSP is part of the product, and the
cost is small: PrinceSec is a tiny site, so per-request rendering is cheap.

## Consequences

- The root layout calls `await connection()` to opt into per-request rendering.
- Pages respond with `Cache-Control: private, no-cache, must-revalidate` (set in `src/proxy.ts`).
  `no-store` is avoided on purpose because it disables the browser back/forward cache. TTFB
  depends on the host's region and server, so it is measured, not assumed.
- Production script policy: `'self' 'nonce-…' 'strict-dynamic'`. Production style policy:
  `'self' 'nonce-…'`. No `'unsafe-inline'` or `'unsafe-eval'` in production.
- Development adds `'unsafe-eval'` (React debugging), `'unsafe-inline'` for styles and `ws:`
  for HMR. These are gated on `NODE_ENV === "development"`.
- Do not use inline `style=""` attributes in components. Use classes or CSS variables.
- Static assets (`/_next/static`, icons) skip the proxy. The sitemap, robots and OG image
  routes are static and unaffected.
- Any future third-party origin (analytics, Turnstile) must be added deliberately to
  `buildCsp` and documented here.

## Revisit when

Next.js ships a stable static-friendly nonce or hash mechanism, or if hosting cost or latency
for per-request rendering becomes a real problem.
