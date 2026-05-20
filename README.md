# Dev/Motion — Anmol Malhan's Portfolio

Personal portfolio site. Built to feel fast, deliberate, and motion-aware while staying accessible.

## Stack

- **Next.js 16** (App Router, experimental view transitions)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** with custom design tokens (`globals.css`)
- **GSAP** (ScrollTrigger) and **Lenis** for animation and smooth scroll
- **lucide-react** for icons

## Local development

```bash
npm install
npm run dev
```

The dev server runs at <http://localhost:3000>.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, SmoothScroll wrapper
│   ├── template.tsx        # Page transition wrapper
│   ├── page.tsx            # Home (hero, code section, horizontal carousel, footer reveal)
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── projects/
│       ├── page.tsx
│       └── [slug]/page.tsx
├── components/
│   ├── ui/Header.tsx
│   └── animations/
│       ├── CustomCursor.tsx
│       └── SmoothScroll.tsx
└── data/projects.ts        # Project catalogue
```

## Notes

- Custom design tokens live in `src/app/globals.css` under `:root` and `@theme inline`. Add new colors in both blocks so Tailwind can generate utilities.
- The contact form submits via `mailto:` — no backend required.
- The fixed footer reveal pattern uses an IntersectionObserver to toggle `inert`, so keyboard users don't tab into invisible content.
