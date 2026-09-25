import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { Wordmark } from "@/components/brand/wordmark";
import { GitHubIcon } from "@/components/icons/github";
import { LinkedInIcon } from "@/components/icons/linkedin";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { IconLink } from "@/components/ui/icon-link";
import { routes, visibleRoutes } from "@/config/nav";
import { showPlanned, site } from "@/config/site";
import { NavEntry } from "./nav-entry";

const headingClass = "font-mono text-[0.75rem] uppercase tracking-[0.14em] text-fg-3";
const linkClass =
  "inline-block py-1 text-[0.9375rem] text-fg-2 transition-colors duration-[var(--duration-ui)] ease-[var(--ease-premium)] hover:text-fg";

export function SiteFooter() {
  const siteLinks = visibleRoutes([routes.glance, routes.contact], showPlanned());
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <Container className="grid gap-14 py-16 lg:grid-cols-[1.5fr_1fr_1fr] lg:py-20">
        <div>
          <Link
            href="/"
            aria-label={`${site.brand} home`}
            className="inline-flex items-center gap-2.5"
          >
            <LogoMark className="h-7 w-auto text-fg" />
            <Wordmark />
          </Link>
          <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-fg-3">
            {site.person}. Cybersecurity, detection and incident response, built on an engineering
            foundation.
          </p>
        </div>

        <nav aria-labelledby="footer-elsewhere">
          <h2 id="footer-elsewhere" className={headingClass}>
            Elsewhere
          </h2>
          <ul className="mt-4 flex flex-col items-start gap-1">
            <li>
              <IconLink
                href={site.links.linkedin}
                label="LinkedIn"
                icon={<LinkedInIcon className="size-[18px]" />}
                unavailableReason="LinkedIn URL not provided yet"
                className="text-fg-2"
              />
            </li>
            <li>
              <IconLink
                href={site.links.github}
                label="GitHub"
                icon={<GitHubIcon className="size-[18px]" />}
                unavailableReason="GitHub URL not provided yet"
                className="text-fg-2"
              />
            </li>
            <li>
              <ButtonLink
                href={site.links.resume}
                unavailableReason="Résumé file not provided yet"
                variant="secondary"
                size="sm"
                download
                className="mt-3"
              >
                Résumé
              </ButtonLink>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-site">
          <h2 id="footer-site" className={headingClass}>
            Site
          </h2>
          <ul className="mt-4 flex flex-col items-start gap-1">
            {siteLinks.map((entry) => (
              <li key={entry.href}>
                <NavEntry entry={entry} className={linkClass} />
              </li>
            ))}
            {site.links.contactEmail ? (
              <li>
                <a href="/.well-known/security.txt" className={linkClass}>
                  security.txt
                </a>
              </li>
            ) : null}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-6 text-[0.8125rem] text-fg-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.person}
          </p>
          <p>{site.brand}: evidence over claims.</p>
        </Container>
      </div>
    </footer>
  );
}
