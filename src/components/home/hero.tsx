import { GitHubIcon } from "@/components/icons/github";
import { LinkedInIcon } from "@/components/icons/linkedin";
import { ArrowIcon, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { IconLink } from "@/components/ui/icon-link";
import { Section } from "@/components/ui/section";
import { routes } from "@/config/nav";
import { site } from "@/config/site";

/**
 * A quiet echo of the signature Investigation Rail: seven stages, the active node arriving
 * at stage three. Decorative only (aria-hidden): it carries no information yet, so it must
 * not carry any meaning. Real stage data arrives with the case-study system.
 */
function HeroRail() {
  const top = 24;
  const step = 400 / 6;
  const stages = Array.from({ length: 7 }, (_, i) => top + i * step);
  const active = 2;
  const activeY = stages[active] ?? top;

  return (
    <svg
      viewBox="0 0 64 448"
      width="64"
      height="448"
      aria-hidden="true"
      focusable="false"
      className="hidden opacity-90 lg:block"
    >
      <line
        x1="32"
        y1={top}
        x2="32"
        y2={top + 400}
        stroke="var(--color-line-strong)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        className="rail-progress"
        x="31.25"
        y={top}
        width="1.5"
        height={activeY - top}
        fill="var(--color-fg-2)"
      />
      {stages.map((y, i) =>
        i === active ? null : i < active ? (
          <circle key={y} cx="32" cy={y} r="3.5" fill="var(--color-fg-2)" />
        ) : (
          <circle
            key={y}
            cx="32"
            cy={y}
            r="3.5"
            fill="var(--color-bg)"
            stroke="var(--color-fg-3)"
            strokeWidth="1.25"
          />
        ),
      )}
      <g className="rail-node">
        <circle
          cx="32"
          cy={activeY}
          r="15"
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity="0.28"
          strokeWidth="1"
        />
        <circle cx="32" cy={activeY} r="8" fill="var(--color-accent)" />
      </g>
    </svg>
  );
}

export function Hero() {
  const [firstLine, secondLine] = ["Engineering", "Security"];

  return (
    <Section
      id="top"
      labelledBy="hero-title"
      spacing="none"
      className="relative isolate overflow-hidden"
    >
      <div className="hero-glow" aria-hidden="true" />

      <Container className="relative z-10 grid min-h-svh grid-cols-1 items-end gap-12 pb-[clamp(3.5rem,9vh,7rem)] pt-[calc(var(--header-h)+3.5rem)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:pb-[clamp(3rem,7vh,6rem)]">
        <div>
          <h1 id="hero-title">
            <span className="reveal-headline reveal-0 mb-6 block text-lead font-medium text-fg-2 lg:mb-8">
              {site.person}
            </span>
            <span className="sr-only"> — </span>
            <span className="reveal-headline reveal-1 block text-display-xl text-fg">
              {firstLine}
              <br />
              {secondLine}
              <span className="text-accent">.</span>
            </span>
          </h1>

          <ul
            aria-label="Focus areas"
            className="reveal reveal-2 mt-10 flex flex-col items-start gap-y-1 text-[1.125rem] tracking-[-0.01em] sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-9 sm:text-lead"
          >
            {site.focusAreas.map((area) => (
              <li key={area.label} className={area.emphasis === "high" ? "text-fg" : "text-fg-3"}>
                {area.label}
              </li>
            ))}
          </ul>

          <p className="reveal reveal-3 mt-5 max-w-[34rem] text-body text-fg-2">
            {site.foundation}
          </p>

          <div className="reveal reveal-4 mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink
              href={routes.work.live ? routes.work.href : undefined}
              unavailableReason="Planned: the projects page is not built yet"
              variant="primary"
            >
              Explore My Work
              <ArrowIcon />
            </ButtonLink>
            <ButtonLink
              href={site.links.resume}
              unavailableReason="Résumé file not provided yet"
              variant="secondary"
              download
            >
              Résumé
            </ButtonLink>
          </div>

          <div className="reveal reveal-5 mt-10 flex flex-wrap items-center gap-x-7 gap-y-2">
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

        <HeroRail />
      </Container>
    </Section>
  );
}
