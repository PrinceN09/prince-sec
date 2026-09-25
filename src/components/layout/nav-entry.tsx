import Link from "next/link";
import { cn } from "@/lib/cn";
import type { RouteEntry } from "@/config/nav";
import { PlannedLink } from "@/components/ui/planned-link";

/**
 * A single navigation entry. Live routes are real links; planned routes are visible only
 * when the owner is reviewing (see showPlanned) and are disabled so nobody hits a 404.
 * The caller decides whether planned entries should be included at all.
 */
export function NavEntry({ entry, className }: { entry: RouteEntry; className?: string }) {
  if (entry.live) {
    return (
      <Link href={entry.href} className={className}>
        {entry.label}
      </Link>
    );
  }
  return (
    <PlannedLink
      reason={`Planned page: ${entry.href} is not built yet`}
      className={cn(className, "border-b border-dashed border-line-strong")}
    >
      {entry.label}
    </PlannedLink>
  );
}
