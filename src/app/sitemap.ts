import type { MetadataRoute } from "next";
import { routes } from "@/config/nav";
import { getSiteUrl } from "@/config/site";

/** Only routes that are actually built are listed; planned routes never reach search engines. */
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl();
  return Object.values(routes)
    .filter((route) => route.live)
    .map((route) => ({
      url: new URL(route.href, origin).toString(),
      changeFrequency: "monthly" as const,
      priority: route.href === "/" ? 1 : 0.7,
    }));
}
