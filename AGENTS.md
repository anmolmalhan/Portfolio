<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working in this repo

Guidance for anyone, human or agent, changing this codebase.

## Never

- **Never** add `Co-authored-by` or any AI attribution to commit messages or PR bodies.
- **Never** use em-dashes in reader-facing copy. Use a comma, colon, or full stop. Enforced by lint (`no-restricted-syntax` in `eslint.config.mjs`); code comments are exempt.
- **Never** push without running the suite. The hooks do this for you; do not reach for `--no-verify`.
- **Never** hardcode brand details. Name, email, socials, location and nav all live in `src/config/site.ts`.

## Always

- **Always** import through `@/`.
- **Always** style from design tokens, not raw hex: `bg-background`, `text-muted-foreground`, `border-border`. The brand layer and the shadcn semantic layer are both defined in `src/app/globals.css`, in light and dark.
- **Always** wrap page content in `<Container>`. It is the single definition of where the page starts; ad-hoc `max-w-*` is what made every route begin at a different x-offset.

## Layout

`--page-max` and `--page-gutter` in `globals.css` define the spine. `<Container>` consumes them:

- `size="default"` (1680px) for the header and the home hero, which has artwork to fill it.
- `size="content"` (1152px, centred) for text-led inner pages.

Full-bleed sections that cannot wrap their content in a `Container` use the `.page-inset-left` utility to line up with it. `.page-container` deliberately sets no `max-width`: it is defined after Tailwind's import, so a `max-width` there silently beats any `max-w-*` utility.

## Motion, and the LCP trap

Two entrance patterns. Picking the wrong one is a measurable regression:

- **Above the fold: `.rise`.** Transform only, never opacity. LCP does not count a transparent or zero-height-clipped element as painted, so fading in visible-on-load content defers LCP until the animation ends. This cost roughly 1.2s on the inner pages once already.
- **Below the fold: `<Reveal>` / `<SplitReveal>`.** Opacity-based, triggered by IntersectionObserver. Fine, because the element is not painted at load anyway.

Anything whose height depends on where text wraps needs that height reserved, or made a function of item count. Geist Mono arrives after first paint and the fallback wraps differently; that mismatch cost 0.168 CLS in the hero spec grid.

## Theme

Tri-state via `data-theme` on `<html>`: `light`, `dark`, or absent for system. Read it through `src/lib/theme.ts` (`useSyncExternalStore`), never from component state. The `dark:` variant is wired to both resolution paths in `globals.css`, and an inline pre-paint script sets the attribute before first paint to avoid a flash.

## Checks

Hooks run automatically via `lefthook`, installed by `npm install`:

| Stage | Runs | Why |
|---|---|---|
| pre-commit | lint-staged, `tsc --noEmit`, unit tests | Seconds, so it can run every time |
| pre-push | `npm ci --dry-run`, build, e2e | Catches what CI catches, before CI does |

`npm ci --dry-run` is there specifically because a desynced lockfile is invisible to `npm install` and only fails on Linux CI.

## Gotchas

- **Optional platform deps.** `@rolldown/binding-wasm32-wasi` pins `@emnapi/*` to an exact version. macOS skips that optional dependency entirely, so lockfile problems are invisible locally until Linux CI runs. Keep those pins exact.
- **`shadcn add` rewrites `globals.css`.** It has previously overwritten the brand accent and emitted no dark-mode semantic tokens, which renders cards light-on-dark. Diff the file after running it.
- **`CommandDialog` needs an explicit `<Command>` root.** shadcn's version renders children straight into `DialogContent`; without the root, cmdk's store context is undefined and the resulting crash unmounts the whole tree, not just the dialog.
