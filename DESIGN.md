# DESIGN.md — Pandiyan Sites

Design system for the Pandiyan Sites marketplace. One pattern: **editorial luxury**
(art-directed magazine + kinetic type). Tokens below are the single source of truth;
`tailwind.config.ts` and `src/app/globals.css` implement them.

## Design pattern

Editorial luxury. Full-bleed colour fields alternate (ink → bone → verdigris → brass),
headlines are set as masked lines that wipe up, and content is separated by tone and
space rather than cards, shadows, or rounded corners. No gradients, no glass, no
neomorphism. One accent only: brass.

Idea in one sentence: *a Chennai property listing reads like a page in an
architecture magazine, and every enquiry leaves by WhatsApp.*

## Palette — "Temple Bronze"

| Token | Hex | Use | Share |
|---|---|---|---|
| `ink-950` | `#0B0F0D` | Dark fields (hero, footer, type rail) | 60% ink/bone fields |
| `ink-900` | `#121A16` | Body text on bone, dark buttons | |
| `ink-800` | `#1A231E` | Raised dark surfaces | |
| `ink-700` | `#24302A` | Dark borders | |
| `bone` | `#EFEDE6` | Light fields, text on ink | 25% |
| `bone-100` | `#F5F3EC` | Input backgrounds | |
| `bone-200` | `#E4E1D8` | Hover surfaces, skeletons | |
| `bone-300` | `#D6D2C6` | Hairline borders on bone | |
| `brass` | `#B08D57` | Accent: rules, prices, CTAs, focus rings | 10% |
| `brass-bright` | `#D6B98C` | Brass hover state | |
| `brass-deep` | `#8A6B3F` | Brass pressed state | |
| `verdigris` | `#2F5D50` | Action green: WhatsApp, story field | 5% |
| `verdigris-deep` | `#22473D` | Verdigris hover | |
| `oxblood` | `#5A1F1F` | "Featured" flag only | accent |
| `smoke` | `#6E6A63` | Muted text on bone | |

Proportion rule: 60 field ink/bone, 25 bone steps, 10 brass, 5 verdigris. No
gradients anywhere. Selection: brass on ink. Focus: 2px brass outline, 3px offset.

## Typography

- **Display**: `Bodoni Moda` (`--font-display`), weights 400/500/700. Headlines and
  prices only. High-contrast Didone = editorial voice.
- **Text/UI**: `Geist` (`--font-sans`, local woff in `src/app/fonts/GeistVF.woff`).
  Everything else: body, labels, buttons, nav.
- Legacy aliases (`font-cormorant`, `font-dm`, `font-playfair`) resolve to the two
  faces above, so old admin pages inherit the system.

Scale (`tailwind.config.ts`):

| Class | Size | Line height | Tracking |
|---|---|---|---|
| `text-display` | `clamp(3.2rem, 9vw, 9rem)` | 0.92 | -0.03em |
| `text-section` | `clamp(2rem, 4vw, 3.4rem)` | 1.02 | -0.025em |
| `text-statement` | `clamp(1.35rem, 2.2vw, 2rem)` | 1.3 | -0.01em |
| `text-lede` | `clamp(1.05rem, 1.4vw, 1.25rem)` | 1.55 | 0 |
| `text-body` | `17px` | 1.55 | 0 |
| `text-small` | `14px` | 1.5 | 0 |

Prices and counters use `tnum` (tabular figures).

## Geometry

- Border radius: **0 everywhere** (`rounded-*` tokens all map to `0px`).
- Borders: 1px hairlines in `bone-300` on light, `bone/15` on dark.
- No resting shadows. Depth comes from field colour and space.
- Section rhythm: `py-section` = `clamp(96px, 12vw, 200px)`.
- Content width: `max-w-[1440px]`, side padding `px-5 sm:px-8`.
- Fields: `.field-ink`, `.field-bone`, `.field-verdigris` for full-bleed sections.

## Motion — "The Brass Thread"

Signature: one brass line that draws itself. A fixed scroll-progress spine
(`ScrollSpine`, xl+ only) runs down the left edge; cards grow a brass rule
(`.thread`) on hover. Headings do not repeat gold underlines.

| Motion | Where | Behaviour |
|---|---|---|
| `Reveal` | all sections | fade + 24px rise, `IntersectionObserver`, stagger via `--d` |
| `SplitLines` | headlines | each line wipes up out of its own box (clip mask), 90ms stagger |
| `Magnetic` | primary CTAs | pointer-follow, spring (stiffness 300, damping 30), max ±6px |
| `ScrollSpine` | fixed left edge | brass line scales with scroll progress |
| `CountUp` | hero stats | eases to target on enter, tabular figures |
| `Story` | pinned section | 320vh scroll: claims and pictures crossfade in place (desktop) |
| `TypeRail` | pinned section | 300vh scroll: horizontal track driven by vertical scroll (desktop) |
| `ImageReveal` | gallery | clip-path opens upward as the still enters, then settles 1.08 → 1 |
| `Navbar` | chrome | hides on scroll down, returns on scroll up; bone field after 60px |
| `PageTransition` | route change | bone curtain wipes up, then down off the new page |
| `.press` | buttons | `:active` scale 0.985 |

Easing: `ease-luxe = cubic-bezier(0.16, 1, 0.3, 1)` (default), `ease-curtain =
cubic-bezier(0.65, 0, 0.35, 1)` (curtain, wipes).

Rules:

- Entrance states exist only under `html.js-motion`, set by an inline script before
  first paint. No script → every word visible. Never hide content by default.
- `prefers-reduced-motion: reduce` zeroes all durations, clears transforms and
  clip-paths, `CountUp` jumps to target.
- `useMediaQuery` swaps pinned scroll sections for stacked lists below 1024px.

## Components

- `PropertyCard`: 4:3 image, tone-separated text block, brass rule grows on hover,
  listing flag as a flat ink rectangle, WhatsApp as a quiet text action.
- `WhatsAppButton`: four variants — `card` (text link), `detail` (verdigris block),
  `strip` (ink block on brass field), `floating` (verdigris square, mobile only).
  URL logic untouched: `https://wa.me/<number>?text=<encoded message>`.
- `SearchFilters`: square chips, `ink-900` when active; mobile opens a bottom sheet.

## Accessibility

- Focus visible: 2px brass outline, 3px offset.
- Colour pairs: bone on ink-950 and ink-900 on bone both clear WCAG AA at body size;
  smoke is for secondary text ≥14px only.
- Motion honours `prefers-reduced-motion`; pinned sections degrade to static lists.
- Icons are decorative (`aria-hidden`) beside text; icon-only buttons carry labels.
