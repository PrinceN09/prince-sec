# ADR 0003: Design tokens, accent and the PrinceSec mark

Status: accepted (Phase 1)

## Accent

`#7DB7FF` was approved as the starting accent. It was checked, and no adjustment was needed.

| Pair                                                                        | Ratio                                           |
| --------------------------------------------------------------------------- | ----------------------------------------------- |
| fg `#F2F4F7` on bg `#07090C`                                                | 18.09:1                                         |
| fg-2 `#A9B1BC` on bg                                                        | 9.21:1                                          |
| fg-3 `#7C8592` on bg                                                        | 5.34:1 (on surface-1: 5.11, on surface-2: 4.86) |
| accent `#7DB7FF` on bg                                                      | 9.58:1                                          |
| primary button: bg on fg                                                    | 18.09:1                                         |
| ink `#0B0D10` on paper `#F4F3EF`                                            | 17.52:1                                         |
| severity on bg: critical 6.64, high 9.48, medium 12.29, low 9.71, info 6.66 | all above 4.5:1                                 |

Visually, the accent stays restrained: it appears only in the mark's node, the full stop in
"Engineering Security.", the active node of the hero rail, focus rings, and text selection.
It is never used as a large fill or a button colour. Primary buttons are light-on-dark.

`--color-fg-3` is the quietest permitted text colour. Do not introduce anything dimmer.

## Coverage states use shape, not colour

Demonstrated = solid node, In Progress = half-filled node, Learning = dashed outline, each
with a text label. Severity colours are reserved for severity and are always paired with a
label and icon.

## The mark

The mark is a "P" built from the Investigation Rail: the stem is the rail (bright where the
investigation has progressed, dim where it has not) and the bowl is the active node in the
accent colour. Geometry lives in `src/components/brand/logo-mark.tsx` (inline) and
`src/app/icon.svg` (favicon tile). `apple-icon.png` and `favicon.ico` are rasterised from it.

Explored and rejected:

- A rail with a gapped node (a knocked-out halo) read as a keyhole/padlock, which is the
  cyber cliché we are avoiding.
- A node centred on a rail read as a UI slider.
- Multi-node steppers turned into a bone/keyhole silhouette at small sizes.

The "P" is distinctive, needs no gap or halo, and stays legible at 16px. It also reads as
progress along a rail.

## Typography

Geist Sans (UI and display), a self-hosted variable font under the SIL Open Font License
(`src/fonts/GEIST-OFL-LICENSE.txt`). Monospace uses the system stack until Geist Mono is
introduced with the case-study evidence components. Display size is fluid, from 52px
on phones to 136px on large screens, with tight tracking (-0.05em) and 0.92 line height.

## Motion

All motion is `transform` and `opacity`. Entrance staggers run once. The headline moves but
never starts transparent, so it is visible at first paint and the largest contentful element
is not delayed by animation (measured: LCP fell from about 1.7s to 0.66s under 4x CPU and
slow-4G throttling). The header surface
fades in via a scroll-driven animation where supported (a permanent frosted bar elsewhere).
`prefers-reduced-motion` disables every animation and transition; the resting state of each
animated element is its final, visible state.
