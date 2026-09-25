import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { isSafeLinkTarget, showPlanned } from "@/config/site";
import { PlannedLink } from "./planned-link";

interface IconLinkProps {
  /** External profile URL. `undefined` = not provided yet. */
  href: string | undefined;
  label: string;
  icon: ReactNode;
  unavailableReason: string;
  className?: string;
}

const classes =
  "group inline-flex items-center gap-2.5 py-1 text-[0.875rem] tracking-[-0.005em] text-fg-3 " +
  "transition-colors duration-[var(--duration-ui)] ease-[var(--ease-premium)] hover:text-fg";

/** External professional link (LinkedIn, GitHub…). Always opens externally and safely. */
export function IconLink({ href, label, icon, unavailableReason, className }: IconLinkProps) {
  if (href === undefined) {
    if (!showPlanned()) return null;
    return (
      <PlannedLink reason={unavailableReason} className={cn(classes, "border-b", className)}>
        {icon}
        <span>{label}</span>
      </PlannedLink>
    );
  }

  if (!isSafeLinkTarget(href) || !href.startsWith("https://")) {
    throw new Error(`External link must be https: ${href}`);
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn(classes, className)}>
      {icon}
      <span>{label}</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
