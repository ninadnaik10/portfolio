# Portfolio

Single-route portfolio. Next.js App Router + HeroUI v3 + Tailwind CSS v4,
statically generated so crawlers that never run JS still see every word.

Content is sourced from **resume.ninadnaik.me** — keep the YAML in step with the
resume PDF.

```bash
npm run dev     # http://localhost:3000
npm run build   # prerenders / to static HTML
npm start       # serve the production build
```

## Editing content

**All content lives in [`content/portfolio.yaml`](content/portfolio.yaml).** Nothing
in `components/` needs to change to add a job, project, or link — edit the YAML
and rebuild.

The YAML is re-read on every render in development, so edits show up on
refresh. In production it is read once, at build time. (`getContent()` handles
this — a module-scope constant would be cached for the life of the dev server,
since the YAML is not a module dependency and never invalidates it.)

| Key            | What it drives                                                    |
| -------------- | ----------------------------------------------------------------- |
| `profile`      | Name, role, tagline, location, email, photo, resume button         |
| `about`        | Paragraphs in the intro block — one list item per paragraph        |
| `socials`      | Icon links in the header and footer                                |
| `experience`   | §01 timeline. Newest first; ordering is taken as written           |
| `open_source`  | §02 — `programs` render as a timeline, `contributions` as cards    |
| `projects`     | §03 card grid                                                      |
| `skills`       | §04 grouped chips (`group` + `items`)                              |
| `education`    | §05 degrees, followed by `roles`                                   |
| `roles`        | §05 "Roles of Responsibility" list                                 |
| `recognition`  | §06 papers and awards (`title` + `detail`)                         |
| `footer.note`  | Small print in the footer. Delete the block to hide it             |

Section numbers come from the `index` prop in `app/page.tsx`, not the YAML — if
you reorder or drop a section, renumber there. The header nav is a separate
`NAV` array in `components/site-header.tsx`; add new sections there too.

## Header nav

The same seven links render two ways. At `xl` and above they sit inline beside
the name. Below `xl` they become a second header row that scrolls sideways,
wrapped in HeroUI's `ScrollShadow` so the fade signals there is more to reach.
Only one of the two `<nav>` elements is ever in the accessibility tree, since
the other is `display: none` at any given width.

The second row makes the header ~102px tall instead of 65px, which is why
sections carry `scroll-mt-32 xl:scroll-mt-24`. If you change the header's
height, change that pair to match or anchored headings will land underneath it.

Notes on specific fields:

- `socials[].icon` must be one of `github`, `linkedin`, `twitter`, `instagram`,
  `mail`, `globe`, `rss`. Anything else silently falls back to the globe.
- `skills[].items` are plain strings; artwork is matched by name in
  `components/skill-icon.tsx` — see **Skill icons**.
- `projects[].featured: true` widens that card to span two columns on desktop.
- `projects[].date` is optional and shows in mono beside the title.
- `experience[].note` renders parenthesised after the company, e.g. Commotion
  *(acquired by Tata Communications)*.
- `open_source.programs` uses the same shape as `experience`, so a mentorship
  gets a full timeline entry with dated highlights.
- A card links to `url` when present, otherwise `repo`. When both are set, the
  title links to the live site and a small "Source" link is added.
- `profile.name` is required — the build fails loudly if it is missing, rather
  than shipping a page with empty sections.

## Skill icons

Logos come from [svgl](https://svgl.app) via
[`@ridemountainpig/svgl-react`](https://github.com/ridemountainpig/svgl-react) —
full-colour brand marks, rendered at build time. Skills is a server component,
so the SVGs are inlined into the static HTML and **none of the package's 2.3MB
reaches the browser**.

Names in `content/portfolio.yaml` stay plain strings. The mapping lives in
`components/skill-icon.tsx`, keyed by display name (matched
case-insensitively). A skill with no entry there renders a dashed monogram
tile, so adding one to the YAML never breaks the grid — it just arrives without
artwork until you add a line to `LOGOS`.

**Light/Dark pairs.** svgl ships `Light` and `Dark` variants for logos that
would otherwise vanish against one background. The naming is the opposite of
what it looks like: `Dark` is the variant *for* dark backgrounds (white
artwork), `Light` the one for light backgrounds. Both are rendered and toggled
with the `dark:` variant, so the right mark shows with no JS and no flash:

```tsx
<span className="contents dark:hidden"><LightLogo /></span>
<span className="hidden dark:contents"><DarkLogo /></span>
```

Seven logos are paired this way: Go, React.js, MySQL, MongoDB, Kafka, AWS, MCP.
The rest are single components.

Three technologies have no svgl artwork and render as monograms: **REST, gRPC,
OAuth2.0**.

**Monochrome until hover.** Logos render desaturated (`grayscale(1)`, 72%
opacity) so the grid reads as one calm block rather than 26 competing brand
colours, and bloom into full colour on tile hover. That lives in
`.skill-logo` / `.skill-tile:hover .skill-logo` in `globals.css`, as plain CSS
— Tailwind has been observed silently not emitting a utility for this
component, so the rules are written where they can be verified. Reduced-motion
drops the transition but keeps the effect.

Note this is hover-only, so touch users see the monochrome state throughout.
It is purely decorative — the logo and its text label both read fine
desaturated — but if you want colour unconditionally, delete the `.skill-logo`
filter rule.

Logos are not all square — Go and AWS are wordmarks (85px and 53px wide at 32px
tall), MongoDB's leaf is narrow at 15px. Tiles are a fixed height and the marks
are vertically centred, so rows stay even even though widths vary.

## Your photo

Drop a square image at **`public/profile.jpg`** (or point `profile.photo` at a
different filename). Until then the build prints a warning and renders
`profile.initials` instead — the missing file is never prerendered as a broken
`<img>`.

## How the theme works

`next-themes` writes `class="dark"` on `<html>`; HeroUI's tokens key off that
(and off `[data-theme="dark"]`), so components restyle with no extra wiring.
Two consequences worth knowing:

- Colors come from HeroUI semantic tokens — `bg-background`, `text-foreground`,
  `text-muted`, `bg-surface`, `border-border`, `text-accent`. Prefer those over
  hardcoded palette values so both themes stay correct for free.
- Do **not** add `@custom-variant dark` to `globals.css`. `@heroui/styles`
  already defines it, and its selector covers both the class and the
  `data-theme` attribute.

The theme button renders a same-size placeholder until hydration, because the
active theme genuinely isn't knowable while prerendering.

`storageKey` is namespaced on purpose. next-themes defaults to the key `"theme"`
and feeds whatever it reads straight into `classList.add()` without validating
it — and every dev server on `localhost:3000` shares one localStorage origin, so
a value left behind by another project throws `InvalidCharacterError`.

### Theme control and change animation

The control is a three-option segmented slider — Light / Dark / System — built
on HeroUI's `ToggleButtonGroup` with `selectionMode="single"` and
`disallowEmptySelection`, so React Aria supplies radio-group semantics and
arrow-key navigation. The visible thumb is a separate absolutely-positioned
span translated by `index * 32px`; the ToggleButtons themselves are kept
transparent (`data-[selected=true]:bg-transparent`) so HeroUI's own selected
background does not fight it.

That 32px pitch assumes zero gap between buttons. `isDetached` sets
`gap: var(--spacing)` from `@layer components`, and the `gap-0` utility sits in
`@layer utilities`, which wins on layer order — so the pitch holds. If you
restyle the track, re-check that.

Selecting a theme reveals the incoming one as a circle expanding from the
button you clicked, via the View Transitions API. Three details are
load-bearing:

- `:root` must carry an explicit `view-transition-name: root`. Chrome 153
  computes `none` on the document element — it no longer auto-assigns the
  `root` name that `::view-transition-*(root)` targets — so without it the
  pseudo-elements are never created and the animation rule matches nothing.
  `startViewTransition()` still resolves `ready` normally, with zero
  pseudo-element animations, which is why this failed completely silently.
- The reveal is a real CSS `@keyframes theme-reveal` animation on
  `::view-transition-new(root)`, parameterised by `--theme-reveal-x/y/r` which
  JS sets on `:root` beforehand (custom properties inherit into the
  `::view-transition` pseudo tree). The widely-posted alternative —
  `animation: none` on both pseudo-elements plus `Element.animate()` on
  `transition.ready` — is avoided because it races: with no CSS animations to
  wait for, the browser can finish and tear down the transition before the
  JS-attached animation starts. Keyframes remove that race, but note it was
  *not* the cause of the original silent failure — the missing
  `view-transition-name` above was.
- next-themes applies the theme class from a **passive effect**, which lands
  after `startViewTransition()` has already snapshotted the DOM. So
  `components/theme-toggle.tsx` flips the class itself inside the transition
  callback, then calls `setTheme` to sync React state and localStorage.
- `disableTransitionOnChange` must stay **off** the provider — it injects a
  stylesheet that kills all transitions during the switch.

The keyframes carry fallbacks (`50% 50%`, `150vmax`), so if the track cannot be
measured the reveal still plays from the centre rather than silently not
running.

Choosing System when it resolves to the appearance already on screen repaints
nothing, so no reveal plays — that is correct, not a bug. Browsers without View
Transitions get a 280ms colour cross-fade via a `theme-fade` class that is
removed straight after, so no global transition lingers to slow down hover
states. `prefers-reduced-motion` skips both paths and switches instantly.

## Structure

```
content/portfolio.yaml   all site content
lib/content.ts           YAML loader, types, build-time validation
components/skill-icon.tsx  svgl logo map, incl. light/dark pairs
app/layout.tsx           metadata, fonts, Person JSON-LD
app/providers.tsx        next-themes provider (client)
app/globals.css          tailwind + heroui imports, .eyebrow / .section-title
components/              header, hero, timeline, work-grid, skills,
                         education, recognition, footer, icons, theme-toggle
```

Social icons are inlined SVGs in `components/icons.tsx` — no icon package, and
nothing fetched at runtime.
