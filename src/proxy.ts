import { NextResponse, type NextRequest } from "next/server";
import { buildCsp, generateNonce } from "@/config/security-headers";

/**
 * Per-request Content-Security-Policy with a fresh nonce.
 * Next.js reads the nonce from the request's CSP header and applies it to its own
 * scripts and styles during server rendering (which is why pages render dynamically).
 */
export function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const csp = buildCsp(nonce, process.env.NODE_ENV === "development");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  // Per-request HTML must not be shared-cached, but `no-store` needlessly disables the
  // browser back/forward cache. `private, no-cache` revalidates every time and keeps bfcache.
  response.headers.set("Cache-Control", "private, no-cache, must-revalidate");
  return response;
}

export const config = {
  matcher: [
    {
      // Skip static assets and prefetches; everything else gets the CSP.
      source: "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
