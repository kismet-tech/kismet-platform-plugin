# Kismet — Aurora Design System

**Kismet** is the direct-booking layer for independent hotels and vacation-rental managers: keep your brand, your margin, and your guest while becoming bookable by AI agents. **Aurora** is Kismet's marketing look — an emerald/indigo/violet celestial palette, monospace section headings, and square-edged "knockout window" gradient clouds. It is used for **marketing web pages and pitch decks** (product name seen in copy: **Fixtures**, the drop-in kit that makes stays AI-bookable).

## Sources
- Attached codebase (mounted, read-only): `Kismet-Aurora-Design-System/` — `styles.css` (single-stylesheet kit with embedded webfonts, sourced from the live `/fixtures` page), `BRIEF.md`, `README.md`, and `components/<Group>/<Name>.html` working examples (Foundations, Signature, Blocks, Deck).
- Attached codebase (mounted, read-only): `kismet.travel/` — the LIVE production Next.js site. Key paths: `styles/globals.css` (the `mkt-*` marketing system), `tailwind.config.ts` (brand tokens), `app/(marketing)/fixtures/page.tsx` + `components/fixtures/*` (the /fixtures page), `components/GlobalHeader.tsx`, `app/(marketing)/layout.tsx` (fonts, footer), `public/` (logo, favicon, fixtures imagery).
- The Aurora `styles.css` is preserved verbatim in this project, split only into `css/fonts.css` (the six embedded `@font-face` rules) and `css/theme.css` (tokens + component classes).

## LIVE SITE — how kismet.travel actually builds pages
The production site is Next.js + Tailwind. The shared marketing system lives in `styles/globals.css` as `mkt-*` classes:
- **Layout:** `.mkt-container` max-width **75rem**; `.mkt-grid` 12-col grid, 2rem column gap. Pages zone dark→white→dark; `[data-dark-nav]` wrappers tell the fixed header to go black while a dark band is under it.
- **Type:** DM Sans body (`--font-dm-sans` via next/font); **global `h2,h3 { font-family: var(--font-plex-mono) }`** — the mono-heading signature is a base rule, not a class. `mkt-h1` = DM Sans semibold, `text-3xl→5xl`, leading 1.08, tracking tight, `text-wrap: balance`, color **brand-ink `#474747`**. `mkt-eyebrow` = 0.875rem semibold uppercase tracking .18em **indigo-600 `#4F46E5`**. `mkt-subhead` = lg/xl gray-600. Playfair Display is loaded (400/700) for editorial use.
- **Buttons:** `.mkt-btn` pill, 2px border, px-8 py-3.5, font-medium. Primary = **`linear-gradient(to right, indigo-600 #4F46E5, purple-600 #9333EA)`**, hover darkens to indigo-700/purple-700 (NOT the 3-color aurora — that lives only in the Aurora deck kit). Secondary = white, 2px `#474747` border, hover gray-50. `.mkt-on-dark` inverts: eyebrow indigo-300, white h1, gray-300 subhead, secondary = white/10 + white/30 border + backdrop-blur. Header "Talk to us" pill = same secondary, px-6 py-3.
- **Celestial gradient:** `bg-gradient-to-br from-emerald-950 (#022C22) via-neutral-900 (#171717) to-indigo-950 (#1E1B4B)` with **`bg-fixed`** — knockout windows are transform-free boxes over a viewport-fixed gradient, so the gradient slides behind them on scroll. Square sharp edges; `ring-1 ring-inset ring-white/10`.
- **Dark bands:** flat `bg-black` (header/hero/trio/close) and `bg-neutral-950` (footer); seams softened with big black shadows (`0 ±34px 44px -16px rgba(0,0,0,.55)`).
- **Icons:** Lucide (`lucide-react`, stroke 1.5–2) everywhere; `react-icons/si` (Simple Icons) for brand glyphs (OpenAI, Claude, Perplexity, Gemini, Meta); Material Symbols Rounded (wght 100) for amenity badges. No emoji (a lone ✓ in CheckItem).
- **Brand tokens (tailwind.config.ts):** `brand.ink #474747` (headings/body), `brand.cream #F0EEE6`, `brand.clay #C15F3C` (legacy — avoid on marketing), accents from the Tailwind indigo/purple/emerald ramps.
- **Motion:** CSS-keyframe product demos (10s looping phone booking flow), scroll-progress vars (`--p`) driving parallax/swing-ins, pure-CSS marquees (50s linear, pause on hover), IntersectionObserver-triggered one-shot sweeps. Everything gated on `prefers-reduced-motion`.
- **Assets in `assets/`:** vectors — `kismet-mark.svg` (the true-vector sun mark: cream `#F0EEE6` disc + ink `#3C3B39` rays), `favicon.svg`, `illustration.svg` + `kismet_illustration_blurred.svg`, `Model_Context_Protocol_logo.svg`, `logos/` (airbnb/booking/vrbo/gh icons, Guesty logo + house lockups incl. white variants, Streamline, Le Barthélemy); rasters — `kismet_logo_512.png` (header mark), `kismet-wordmark-logo.png`, `fixtures/` imagery (chestnut-linden, linden-rooftop, desktop-booking, forrest-lodge, magnifying-glass, bourbon-and-bubbles). ⚠ The repo's `public/kismet.svg` is an empty shell (its embedded `<image>` has no data) — not copied; use `kismet-mark.svg`.
- **Homepage (`app/(marketing)/page.tsx`) learnings:** the home hero mirrors the /fixtures hero geometry exactly (`-mt-16` + `pt-36` + a 580px square window + phone) so clicking through lands identically; its window uses the **light "daylight" mesh** (warm red/magenta left, periwinkle right, indigo bottom over off-white — now `.m-daylight` in `css/theme.css`) with grain at 0.7. Home copy voice: short stacked declaratives ("Direct booking. / For the AI era.", "Your voice. Your content. Your brand. Just you."). Below the fold: PartnersLine (PMS logos: Track, Guesty, Cloudbeds, Shiji…), PressScroll (news cards), colorful `card-backgrounds-pack` tiles with white-inverted icon PNGs.
- **Celestial clouds:** the `.m-aurora/emerald/indigo/nightfall/veil` meshes are backed by procedural SVG skies in `assets/clouds/` (turbulence-displaced aurora curtains, vertical rays, star fields over the deep celestial base) layered over the original gradient fallbacks — richer than the flat radial blurs, same palette.
- **⚠ Aurora kit vs live site:** the Aurora kit (decks/marketing-kit) stylizes the live palette — ink `#2F3444` vs live `#474747`; aurora 3-color CTA gradient vs live indigo→purple; `.canvas` grounds vs live full-bleed black bands. For WEB pages, follow the live values (see `ui_kits/marketing-site/`); for DECKS, the Aurora kit stands.

## CONTENT FUNDAMENTALS
- **Voice:** confident, precise, a little bold. Plainspoken and specific; never corporate-fluffy. Active voice — a control says exactly what it does ("Get Fixtures", "Book a demo", "See how it works").
- **Signature cadence:** short declarative pairs. *"Own the guest. Keep the margin."* / *"Built for AI. Honed for human experience."*
- **Concrete over abstract:** copy uses real numbers and mechanics — *"A $300 booking is worth $300 — not $240 after an OTA takes its cut."* / *"0 JavaScript required for an AI agent to read you."*
- **Address:** second person to the operator ("your brand, your margin, your guest"). Kismet speaks as "we" rarely; the operator is the hero.
- **Casing:** sentence case for headlines and buttons. UPPERCASE reserved for eyebrows, footer column titles, quote attributions, and slide footers (all mono/tracked).
- **Enemy framing:** OTAs and re-intermediation. Comparisons are welcome ("OTAs vs Kismet — same booking, different economics").
- **No emoji.** No exclamation marks in the source copy. Em-dashes and middots (·) are idiomatic.

## VISUAL FOUNDATIONS
- **Color:** celestial base `#022C22 → #171717/#12121A → #1E1B4B` (emerald-950 → neutral-900 → indigo-950) for dark grounds and knockout clouds. Accents: indigo `#4F46E5` (`--accent`, the single accent), violet `#7C3AED` (glow), emerald `#10B981`; on dark use emerald-300 `#6EE7B7` and indigo-300 `#A5B4FC`. Primary CTA and big numerals = the **aurora gradient** `linear-gradient(120deg,#8B5CF6,#4F46E5 46%,#10B981)`. Neutrals are cool: ink `#2F3444`, soft `#565E70`, faint `#8892A3`, mist `#EEF1F9`, white. ⛔ **Never clay/terracotta/warm cream/orange** — that reads as Anthropic, not Kismet.
- **Type:** DM Sans (body, hero H1, feature body, CTA h3) · IBM Plex Mono (**section headings h2/h3 — the signature**, wordmark, eyebrow-kickers, stats numerals, slide footers, footer links headers) · Playfair Display 500 (editorial pull-quotes only). Embedded weights: DM Sans 400/500/600, IBM Plex Mono 500/600, Playfair 500.
- **Signature motif — knockout windows:** square, sharp-edged frames (`border-radius:2px`, `aspect-ratio:1/1`; `.big` = 16:10) onto grainy celestial aurora clouds (`.mesh .m-aurora|m-emerald|m-indigo|m-nightfall|m-veil` + `.grain`). **Square edges are intentional — don't round them.** Optional centered glass `.chip` with aurora `.cdot`.
- **Texture:** film grain everywhere on celestial surfaces — `--grain` SVG noise at 190px, opacity .4–.42, `mix-blend-mode:soft-light`.
- **Section rhythm:** alternate dark celestial sections with clean white bands (dark hero → white pillars → mist band → dark close). `.canvas` (white) / `.canvas.mist` / `.canvas.dark` / `.canvas.aurorabg`, inner `.container` max-width 64rem; page `--maxw` 80rem. Generous whitespace; left-aligned headings.
- **Buttons:** full-pill (999px), 2px border, padding .72rem 1.7rem, DM Sans 500. Primary = aurora gradient on white text (hover: `brightness(1.07) saturate(1.05)`); secondary = white with ink outline (hover `#F4F6FB`). On dark, secondary inverts to translucent white (`rgba(255,255,255,.08)`, border `rgba(255,255,255,.4)`). On `.aurorabg`, primary inverts to white with indigo text. Focus: 2px accent outline, 3px offset.
- **Corners:** `--radius:.5rem` for swatches/cards; 9px feature marks; 12–14px block/slide frames; **2px on knockout windows**; 999px pills. 
- **Shadows:** cool navy-tinted — `--shadow-sm/md/lg` (e.g. md `0 10px 34px rgba(24,28,45,.10)`). Dark theme deepens to black shadows.
- **Motion:** one entrance animation — `rise` (fade + 10px translateY, .5s `cubic-bezier(.2,.7,.2,1)`). Hovers are color/border transitions (.15–.2s) — footer links go emerald-300, toggles go accent. No bounces, no parallax. `prefers-reduced-motion` kills all animation.
- **Transparency & blur:** glass chips on knockouts (`rgba(255,255,255,.94)` + `backdrop-filter:blur(6px)`), knockout labels (`rgba(10,11,20,.42)` + blur 3px). Used only on top of celestial imagery.
- **Numerals:** stats and slide numerals are IBM Plex Mono 600, tabular-nums, aurora-gradient text-fill.
- **Theming:** light default; dark mode via `prefers-color-scheme` and `:root[data-theme]` swaps neutrals only — accents and the aurora stay fixed.

## ICONOGRAPHY
- **Icon library (canonical, all surfaces):** **lucide-react** for UI icons (thin stroke 1.5–2) and **react-icons/si** (Simple Icons) for brand glyphs (OpenAI, Claude, Perplexity, Gemini, Meta…). In static HTML, inline the same geometry (lucide-static CDN or copied SVG). Material Symbols Rounded (weight 100) only for amenity badges. No emoji.
- **Live site:** Lucide icons for UI; Simple Icons brand glyphs for AI channels; real logo assets in `assets/` (`kismet_logo_512.png` header mark + "Kismet" in DM Sans medium; `favicon.svg` sun mark).
- **Aurora deck kit:** iconography is typographic and geometric — numbered feature marks (`.mk`), aurora gradient dots, kicker dash; the `.word` mono wordmark. Press-wall "logos" are mono wordmarks in gray.
- Never draw or approximate the Kismet logo — use the copied assets.

## Index
- `styles.css` — global entry; `@import`s `css/fonts.css` + `css/theme.css` (verbatim source kit) + `css/aurora-extensions.css` (header/forms/new-slide classes, additive).
- `readme.md` — this guide. `SKILL.md` — agent skill wrapper.
- `guidelines/` — foundation specimen cards (Colors, Type, Brand groups in the Design System tab).
- `components/core/` — Button, Wordmark, Eyebrow, Headline, Subhead, Section.
- `components/signature/` — KnockoutWindow.
- `components/header/` — GlobalHeader (light/dark/auto + full-screen menu, ported from the live GlobalHeader.tsx).
- `components/forms/` — Field, Input, Textarea, Select, Checkbox, EmailCapture (light + dark celestial treatments).
- `components/charts/` — BarChart, LineChart (aurora primary series, cool-gray comparison, mono labels).
- `components/blocks/` — Hero, FeatureGrid, StatBand, CtaBanner, Quote, PressWall, SiteFooter.
- `components/deck/` — TitleSlide, DividerSlide, BigStatSlide, CompareSlide, QuoteSlide, BulletsSlide, ChartSlide.
- `ui_kits/marketing-site/index.html` — faithful recreation of the live kismet.travel/fixtures page (real code + assets).
- `ui_kits/pitch-deck/index.html` — 5-slide click-through deck.
- `templates/pitch-deck/` + `templates/landing-page/` — starting-point templates for consuming projects.
- `slides/` — one card per slide type (Slides group).

## Intentional additions
- `Section`, `Wordmark`, `Eyebrow/Headline/Subhead` as named React primitives — direct 1:1 wrappers of source classes (`.canvas`, `.word`, `.mkt-*`), added so kits compose without re-typing class soup. No visual invention.
- `GlobalHeader` — 1:1 port of the live `components/GlobalHeader.tsx` (fixed bar, `[data-dark-nav]` scroll detection, full-screen dropdown menu, white "Talk to us" pill in both themes). Lucide menu/x geometry inlined.
- `components/forms/` — no form controls exist on the live site (it uses a Calendly embed), so these are designed to system rules: DM Sans, `--radius` corners, 1.5px `--line-strong` borders, indigo-accent focus rings, aurora-gradient checked states; dark variants use the on-dark translucent-white treatment from `.mkt-on-dark`.
- `components/charts/` + `BulletsSlide`/`ChartSlide` — deck data-viz to system rules: aurora gradient reserved for the primary series, cool gray `--line-strong` for comparisons, IBM Plex Mono tabular labels, hairline `--line` grids, 2px bar corners (knockout sharpness).
