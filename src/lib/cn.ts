/** Minimal class-name joiner (replaces a dependency such as clsx). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
