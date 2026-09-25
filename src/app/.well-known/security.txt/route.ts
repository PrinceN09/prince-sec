import { getSiteUrl, site } from "@/config/site";

export const dynamic = "force-static";

/**
 * RFC 9116 security.txt, generated from the single site config.
 * Returns 404 until a public contact address is configured, so we never publish a
 * placeholder or a wrong contact.
 */
export function GET() {
  const contact = site.links.contactEmail;
  if (!contact) return new Response("Not found", { status: 404 });

  const expires = new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString();
  const body = [
    `Contact: mailto:${contact}`,
    `Expires: ${expires}`,
    "Preferred-Languages: en",
    `Canonical: ${new URL("/.well-known/security.txt", getSiteUrl()).toString()}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
