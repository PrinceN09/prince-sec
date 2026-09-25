"use client";

import { useRef, useState, type ReactNode } from "react";

/**
 * Full-screen mobile navigation built on the native Popover API:
 * Escape and click-outside dismissal, top-layer stacking and focus return are provided by
 * the browser, so this client component only syncs aria-expanded, moves focus to the close
 * button on open, and closes the menu when a link inside it is chosen.
 */
export function MobileMenu({ brand, children }: { brand: ReactNode; children: ReactNode }) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        popoverTarget="site-menu"
        aria-controls="site-menu"
        aria-expanded={open}
        aria-label="Menu"
        className="-mr-2 grid size-11 place-items-center rounded-full text-fg lg:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          aria-hidden="true"
          focusable="false"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M4 9h16M4 15h16" />
        </svg>
      </button>

      <div
        id="site-menu"
        ref={popoverRef}
        popover="auto"
        aria-label="Site menu"
        className="mobile-menu"
        onToggle={(event) => {
          const isOpen = (event.nativeEvent as ToggleEvent).newState === "open";
          setOpen(isOpen);
          if (isOpen) closeRef.current?.focus();
        }}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a[href]")) {
            popoverRef.current?.hidePopover();
          }
        }}
      >
        <div className="mx-auto flex min-h-full w-full max-w-[var(--content-max)] flex-col px-[var(--gutter)]">
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between">
            {brand}
            <button
              ref={closeRef}
              type="button"
              popoverTarget="site-menu"
              popoverTargetAction="hide"
              aria-label="Close menu"
              className="-mr-2 grid size-11 place-items-center rounded-full text-fg"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                aria-hidden="true"
                focusable="false"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
