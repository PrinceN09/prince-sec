import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { isExternal, isSafeLinkTarget, showPlanned } from "@/config/site";
import { PlannedLink } from "./planned-link";

type Variant = "primary" | "secondary";
type Size = "md" | "sm";

const base =
  "btn inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] " +
  "whitespace-nowrap select-none transition-[background-color,border-color,color,transform] " +
  "duration-[var(--duration-ui)] ease-[var(--ease-premium)] active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-fg text-bg hover:bg-white",
  secondary: "border border-line-strong text-fg hover:border-white/35 hover:bg-white/[0.06]",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[0.9375rem]",
  sm: "h-9 px-4 text-[0.875rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonLinkProps {
  /** `undefined` means "not provided yet": hidden in production, marked placeholder in development. */
  href: string | undefined;
  /** Shown as the tooltip on the development placeholder. */
  unavailableReason: string;
  variant?: Variant;
  size?: Size;
  /** Same-origin files (e.g. the résumé PDF) use a real download link. */
  download?: boolean;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({
  href,
  unavailableReason,
  variant = "primary",
  size = "md",
  download = false,
  className,
  children,
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);

  if (href === undefined) {
    if (!showPlanned()) return null;
    return (
      <PlannedLink reason={unavailableReason} className={classes}>
        {children}
      </PlannedLink>
    );
  }

  if (!isSafeLinkTarget(href)) {
    throw new Error(`Unsafe link target rejected: ${href}`);
  }

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  if (download) {
    return (
      <a href={href} download className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/** Small arrow that nudges on hover (see .btn-arrow in globals.css). */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      className={cn("btn-arrow", className)}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
