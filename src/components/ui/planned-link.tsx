import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Stand-in for a link that is planned or not yet configured. It is only ever rendered
 * when `showPlanned()` is true (development, or SHOW_PLANNED=true). It is a disabled
 * link: not focusable, clearly marked, and never navigates.
 */
export function PlannedLink({
  reason,
  className,
  children,
}: {
  reason: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      role="link"
      aria-disabled="true"
      title={`${reason} (visible in development only)`}
      className={cn("cursor-not-allowed border-dashed opacity-60", className)}
    >
      {children}
    </a>
  );
}
