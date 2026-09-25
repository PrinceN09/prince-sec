/**
 * Single source of truth for identity, brand and outbound links.
 * URLs are defined ONCE here and consumed everywhere else.
 *
 * Rules:
 *  - A link left `undefined` is omitted from production builds (never a dead link).
 *    In development it renders as a clearly-marked placeholder so layout can be reviewed.
 *  - External URLs must be https. Internal downloads (e.g. the résumé) must start with "/".
 *  - Nothing in this file is a secret. Secrets belong in server-only environment variables.
 */

export interface SiteLinks {
  /** Full LinkedIn profile URL, e.g. https://www.linkedin.com/in/<handle> */
  readonly linkedin: string | undefined;
  /** Full GitHub profile URL, e.g. https://github.com/<handle> */
  readonly github: string | undefined;
  /** Résumé PDF: a path under /public (e.g. "/resume.pdf") or an https URL. */
  readonly resume: string | undefined;
  /** Public contact address. Also powers /.well-known/security.txt when set. */
  readonly contactEmail: string | undefined;
}

export const site = {
  brand: "PrinceSec",
  person: "Prince Ntunka",
  displayLine: "Engineering Security.",
  focusAreas: [
    { label: "Cybersecurity", emphasis: "high" },
    { label: "Detection", emphasis: "high" },
    { label: "Incident Response", emphasis: "high" },
    // Direction, not yet evidenced by projects: deliberately quieter than the rest.
    { label: "Cloud & DevSecOps", emphasis: "low" },
  ],
  foundation: "Building on a foundation in software, cloud infrastructure and DevOps.",
  title: "Prince Ntunka | PrinceSec",
  description:
    "PrinceSec is the cybersecurity portfolio of Prince Ntunka: detection, investigation and incident response, built on a foundation in software, cloud infrastructure and DevOps.",
  keywords: [
    "Prince Ntunka",
    "PrinceSec",
    "cybersecurity portfolio",
    "security engineer",
    "SOC analyst",
    "incident response",
    "threat detection",
    "Wazuh",
    "DevSecOps",
    "cloud security",
  ],
  links: {
    linkedin: undefined,
    github: undefined,
    resume: undefined,
    contactEmail: undefined,
  } satisfies SiteLinks,
} as const;

const DEFAULT_SITE_URL = "http://localhost:3000";

/** Canonical origin. Server-side env only; falls back to localhost for development. */
export function getSiteUrl(): URL {
  const raw = process.env.SITE_URL?.trim();
  if (!raw) return new URL(DEFAULT_SITE_URL);
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.hostname !== "localhost") {
      throw new Error("SITE_URL must use https outside localhost");
    }
    return url;
  } catch (error) {
    throw new Error(`Invalid SITE_URL: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Whether unfinished things (planned routes, unconfigured links) are visible.
 * Always true in development so they can be reviewed; opt-in for a production build
 * via SHOW_PLANNED=true. Public deployments leave it unset, so visitors never see them.
 */
export function showPlanned(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.SHOW_PLANNED === "true";
}

/** Guards outbound URLs: https only for external links, root-relative for local files. */
export function isSafeLinkTarget(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function isExternal(value: string): boolean {
  return !value.startsWith("/");
}
