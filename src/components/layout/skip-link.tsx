/** First focusable element on every page: lets keyboard users bypass the header. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-transform duration-[var(--duration-ui)] ease-[var(--ease-premium)] focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}
