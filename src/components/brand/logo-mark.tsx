import { cn } from "@/lib/cn";

/**
 * The PrinceSec mark: a rail and its active node, which together form a "P".
 *
 * The stem is the Investigation Rail (signature case-study component): bright where the
 * investigation has progressed, dim where it has not. The bowl is the active node, the one
 * place the accent colour appears. Pure geometry (no gradients, masks or filters), so it
 * stays crisp at 16px. Same geometry as src/app/icon.svg, cropped tight for inline use.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="14 7 36 50"
      className={cn("shrink-0", className)}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="17" y="10" width="7" height="44" rx="3.5" fill="currentColor" opacity="0.34" />
      <rect x="17" y="10" width="7" height="24" rx="3.5" fill="currentColor" />
      <circle cx="33.5" cy="26.5" r="13.5" fill="var(--color-accent)" />
    </svg>
  );
}
