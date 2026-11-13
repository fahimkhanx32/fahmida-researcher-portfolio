# Dr. Fahmida Bristy — Academic Portfolio (Phase 1: frontend)

Vite + React 19 + Tailwind CSS v4 (JavaScript), built on the existing `aldhib` project.
No backend, database, API, authentication or admin area exists yet (Phase 2 is locked until approved).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build
```

## Where to edit content

All content lives in `src/data/` (no content inside components):

| File | Controls |
| --- | --- |
| `siteConfig.js` | name, intro, photo, **CV path**, registration, nav, academic profile URLs, contact details, collaboration types |
| `research.js` | suggested research-interest cards (editable suggestions, not confirmed specializations) |
| `publications.js` | verified `publications` (empty) + labelled `samplePublications` |
| `projects.js` | verified `projects` (empty) + labelled `sampleProjects` |
| `timeline.js` | experience and education timelines |
| `achievements.js` | conferences, training, awards (empty) + labelled samples |

- **CV:** copy the file to `public/cv/`, then set `cvUrl: '/cv/<file>.pdf'` in `siteConfig.js`. Until then the button explains the CV is pending.
- **Photo:** add the image to `public/` and set `photo: { src, alt }`. Until then a labelled placeholder is shown.
- **Profile links / contact:** any value left `null` is hidden.
- **Sample content:** the "Frontend review → Sample content" switch (bottom-left) shows or hides labelled placeholders so both the populated UI and the empty states can be reviewed. Remove `PreviewToggle`, `PreviewContext` and the `sample*` arrays before launch.

## Structure

```
src/
  data/         content + config (separate from UI)
  context/      PreviewContext (sample-content switch)
  hooks/        useScrollSpy, useScrolled, usePublicationFilter
  utils/        scroll helpers, citation formatting
  styles/       portfolio.css (design tokens, light/dark themes)
  pages/        PortfolioPage (new "/"), LegacyShopHome (old shop home, "/legacy-shop")
  components/
    common/ layout/ sections/ publications/ projects/ contact/
```

Existing shop components, Login and Registration are untouched and remain reachable
(`/legacy-shop`, `/login`, `/registration`); they are lazy-loaded so they do not weigh on the portfolio bundle.
