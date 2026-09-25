/**
 * Route registry and primary navigation.
 *
 * `live: false` means the route is planned but not built yet. Planned routes are shown
 * to the owner in development (see `showPlanned`) and hidden from public production
 * builds so visitors never meet a dead link. Flip `live` to true as each phase ships.
 */

export interface RouteEntry {
  readonly href: string;
  readonly label: string;
  readonly live: boolean;
}

export const routes = {
  home: { href: "/", label: "Home", live: true },
  work: { href: "/projects", label: "Work", live: false },
  capabilities: { href: "/skills", label: "Capabilities", live: false },
  about: { href: "/about", label: "About", live: false },
  learning: { href: "/learning", label: "Learning", live: false },
  glance: { href: "/glance", label: "At a glance", live: false },
  contact: { href: "/contact", label: "Contact", live: false },
} as const satisfies Record<string, RouteEntry>;

export const primaryNav: readonly RouteEntry[] = [
  routes.work,
  routes.capabilities,
  routes.about,
  routes.learning,
  routes.glance,
];

export function visibleRoutes(entries: readonly RouteEntry[], includePlanned: boolean) {
  return entries.filter((entry) => entry.live || includePlanned);
}
