import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { Wordmark } from "@/components/brand/wordmark";
import { GitHubIcon } from "@/components/icons/github";
import { LinkedInIcon } from "@/components/icons/linkedin";
import { ButtonLink } from "@/components/ui/button";
import { IconLink } from "@/components/ui/icon-link";
import { Container } from "@/components/ui/container";
import { primaryNav, visibleRoutes } from "@/config/nav";
import { showPlanned, site } from "@/config/site";
import { MobileMenu } from "./mobile-menu";
import { NavEntry } from "./nav-entry";

function Brand() {
  return (
    <Link href="/" aria-label={`${site.brand} home`} className="inline-flex items-center gap-2.5">
      <LogoMark className="h-7 w-auto text-fg" />
      <Wordmark />
    </Link>
  );
}

export function SiteHeader() {
  const items = visibleRoutes(primaryNav, showPlanned());

  return (
    <header className="site-header">
      <Container className="grid h-full grid-cols-[1fr_auto] items-center lg:grid-cols-[1fr_auto_1fr]">
        <div className="justify-self-start">
          <Brand />
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {items.map((entry) => (
            <NavEntry key={entry.href} entry={entry} className="nav-link" />
          ))}
        </nav>

        <div className="flex items-center justify-self-end">
          <div className="hidden lg:block">
            <ButtonLink
              href={site.links.resume}
              unavailableReason="Résumé file not provided yet"
              variant="secondary"
              size="sm"
              download
            >
              Résumé
            </ButtonLink>
          </div>
          <MobileMenu brand={<Brand />}>
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-1 py-10">
              {items.map((entry) => (
                <NavEntry key={entry.href} entry={entry} className="mobile-menu-link" />
              ))}
            </nav>
            <div className="flex flex-col gap-6 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
              <div>
                <ButtonLink
                  href={site.links.resume}
                  unavailableReason="Résumé file not provided yet"
                  variant="primary"
                  download
                >
                  Résumé
                </ButtonLink>
              </div>
              <div className="flex flex-wrap gap-x-7 gap-y-2">
                <IconLink
                  href={site.links.linkedin}
                  label="LinkedIn"
                  icon={<LinkedInIcon className="size-[18px]" />}
                  unavailableReason="LinkedIn URL not provided yet"
                />
                <IconLink
                  href={site.links.github}
                  label="GitHub"
                  icon={<GitHubIcon className="size-[18px]" />}
                  unavailableReason="GitHub URL not provided yet"
                />
              </div>
            </div>
          </MobileMenu>
        </div>
      </Container>
    </header>
  );
}
