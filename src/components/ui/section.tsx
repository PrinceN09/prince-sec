import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  id?: string;
  /** id of the heading that names this section (gives the region an accessible name). */
  labelledBy?: string;
  /** "paper" is the light band used for dark/light rhythm. */
  tone?: "dark" | "paper";
  spacing?: "default" | "none";
  className?: string;
  children: ReactNode;
}

export function Section({
  id,
  labelledBy,
  tone = "dark",
  spacing = "default",
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        tone === "paper" && "bg-paper text-ink",
        spacing === "default" && "py-[var(--section-y)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
