/**
 * Security headers for PrinceSec. Every decision here is documented in docs/SECURITY.md
 * and docs/adr/0002-csp-strategy.md.
 *
 * - Static headers are applied through next.config.ts.
 * - The Content-Security-Policy is per-request (it carries a nonce) and is applied in
 *   src/proxy.ts using `buildCsp` below.
 */

export interface HeaderEntry {
  readonly key: string;
  readonly value: string;
}

export const staticSecurityHeaders: HeaderEntry[] = [
  // HTTPS only for two years. `preload` is intentionally NOT set yet: submitting to the
  // preload list is effectively permanent, so it is enabled deliberately after launch.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing on this site needs powerful features; deny them all.
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), autoplay=(), browsing-topics=(), camera=(), display-capture=(), " +
      "geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), " +
      "publickey-credentials-get=(), usb=(), xr-spatial-tracking=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  // Legacy clickjacking defence for browsers that predate CSP frame-ancestors.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

/** Generates a fresh, unpredictable nonce (128 bits, base64) for each request. */
export function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function buildCsp(nonce: string, isDev: boolean): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // 'strict-dynamic' lets nonce-approved scripts load their own chunks while every
    // host allow-list is ignored by modern browsers. No 'unsafe-inline'. No eval in production.
    "script-src": [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
    // Development tooling injects styles it cannot nonce; production stays nonce-only.
    "style-src": ["'self'", ...(isDev ? ["'unsafe-inline'"] : [`'nonce-${nonce}'`])],
    "img-src": ["'self'", "data:"],
    "font-src": ["'self'"],
    "connect-src": ["'self'", ...(isDev ? ["ws:", "wss:"] : [])],
    "media-src": ["'none'"],
    "object-src": ["'none'"],
    "worker-src": ["'self'"],
    "manifest-src": ["'self'"],
    "base-uri": ["'none'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    ...(isDev ? {} : { "upgrade-insecure-requests": [] }),
  };

  return Object.entries(directives)
    .map(([name, values]) => (values.length > 0 ? `${name} ${values.join(" ")}` : name))
    .join("; ");
}
