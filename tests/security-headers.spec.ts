import { expect, test } from "@playwright/test";

function nonceFrom(csp: string): string {
  const match = /script-src[^;]*'nonce-([^']+)'/.exec(csp);
  if (!match?.[1]) throw new Error(`No script nonce in CSP: ${csp}`);
  return match[1];
}

test.describe("security headers", () => {
  test("sets the expected static headers and hides the framework", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();
    expect(headers["strict-transport-security"]).toMatch(/max-age=\d{8,}/);
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["x-powered-by"]).toBeUndefined();
  });

  test("CSP is strict: nonce + strict-dynamic, no unsafe-inline/eval for scripts", async ({
    request,
  }) => {
    const csp = (await request.get("/")).headers()["content-security-policy"] ?? "";
    const scriptSrc = /script-src([^;]*)/.exec(csp)?.[1] ?? "";
    const styleSrc = /style-src([^;]*)/.exec(csp)?.[1] ?? "";
    expect(scriptSrc).toContain("'strict-dynamic'");
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).not.toContain("'unsafe-eval'");
    expect(styleSrc).not.toContain("'unsafe-inline'");
    for (const directive of [
      "default-src 'self'",
      "object-src 'none'",
      "base-uri 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ]) {
      expect(csp).toContain(directive);
    }
  });

  test("nonce is unique per request and matches the rendered scripts", async ({ request }) => {
    const first = await request.get("/");
    const second = await request.get("/");
    const firstNonce = nonceFrom(first.headers()["content-security-policy"] ?? "");
    const secondNonce = nonceFrom(second.headers()["content-security-policy"] ?? "");
    expect(firstNonce).not.toBe(secondNonce);
    expect(await first.text()).toContain(`nonce="${firstNonce}"`);
  });

  test("the page raises no CSP violations or console errors", async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") problems.push(message.text());
    });
    page.on("pageerror", (error) => problems.push(error.message));
    await page.addInitScript(() => {
      (window as unknown as { __csp: string[] }).__csp = [];
      document.addEventListener("securitypolicyviolation", (event) => {
        (window as unknown as { __csp: string[] }).__csp.push(
          `${event.violatedDirective} ${event.blockedURI}`,
        );
      });
    });
    await page.goto("/", { waitUntil: "networkidle" });
    const violations = await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp);
    expect(violations).toEqual([]);
    expect(problems).toEqual([]);
  });
});

test.describe("discovery routes", () => {
  test("sitemap lists only routes that are built", async ({ request }) => {
    const body = await (await request.get("/sitemap.xml")).text();
    expect(body.match(/<loc>/g)).toHaveLength(1);
  });

  test("robots.txt points at the sitemap", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toContain("Sitemap:");
  });

  test("security.txt is not published until a contact is configured", async ({ request }) => {
    const response = await request.get("/.well-known/security.txt");
    expect(response.status()).toBe(404);
  });
});
