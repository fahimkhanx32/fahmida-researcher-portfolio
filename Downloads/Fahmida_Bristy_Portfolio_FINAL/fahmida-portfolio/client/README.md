# Dr. Fahmida Bristy — Academic Portfolio

Vite + React 19 + Tailwind CSS v4. Frontend only: no backend, database or authentication is connected yet.
The project contains **no e-commerce code**.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build
npm run lint
```

## How the code is organised

**One `.jsx` file per feature. Everything that belongs to a feature lives inside its file** (its sub-components,
hooks and helpers). Styling is **Tailwind classes only**: there are no component CSS files.

```
src/
  index.css            the only stylesheet: Tailwind + colour tokens (light/dark) + animation keyframes
  main.jsx  App.jsx    entry + routes
  pages/
    Portfolio.jsx      "/"  assembles the sections, owns the scroll-spy
    Login.jsx          "/login"            (own CONFIG block at the top of the file)
    ForgotPassword.jsx "/forgot-password"  (own CONFIG block at the top of the file)
  components/
    Navbar.jsx         top bar, main bar, spotlight beam, More menu, mobile menu, Light/Dark switch, theme logic
    Hero.jsx           hero + profile photo
    About.jsx  Research.jsx  Experience.jsx  Education.jsx  Achievements.jsx  Profiles.jsx
    Publications.jsx   search/filter, cards, detail dialog, citation + copy button
    Projects.jsx       status filter, cards, detail dialog, status badge
    Contact.jsx        contact details + collaboration form (with validation)
    Footer.jsx         footer + back-to-top button
    Preview.jsx        "Sample content" switch and the data it controls (review helper)
    ui.jsx             shared pieces: Container, Section, Button, CvButton, Badge, Icon, EmptyState,
                       Modal, Timeline, ImagePlaceholder, scroll helpers
  data/                all content (see below)
```

### Colours and theme
All colours are tokens in `src/index.css` (`:root` = light, `.dark` = dark). Components use them as Tailwind
classes (`bg-canvas`, `text-ink`, `border-line`, `text-gold-ink`, `bg-beam` …). Edit those two blocks to retheme.
The dark/light choice is saved in `localStorage` (key `theme`) and applied before first paint by a script in `index.html`.

## Where to edit content

| File | Controls |
| --- | --- |
| `data/siteConfig.js` | name, intro, photo, **CV path**, registration, **navigation**, **navbar CTA**, academic profile URLs, **contact phone/email**, collaboration types |
| `data/research.js` | research-interest cards |
| `data/publications.js` | `publications` (verified) + labelled `samplePublications` |
| `data/projects.js` | `projects` (verified) + labelled `sampleProjects` |
| `data/timeline.js` | experience and education timelines |
| `data/achievements.js` | conferences, training, awards |

- **CV:** put the file in `public/cv/` and set `cvUrl: '/cv/<file>.pdf'`. Until then the button explains the CV is pending.
- **Photo:** add the image to `public/` and set `photo: { src, alt }`.
- **Navbar:** `navigation` (`short` = compact label, `more: true` = listed under "More"), `navCta` (label + target section),
  `contactDetails.phone/email` (shown in the top bar and the Contact section; `null` hides them).
  The full bar shows from 1024px up; below that the hamburger menu is used.
- **Spotlight beam colour:** `--c-beam` / `--c-beam-soft` in `src/index.css`.
- **Header height** is about 128px. Dependents: `scroll-mt-32` (Section, Hero), the Hero `min-h`, and `useScrollSpy(180)` in `pages/Portfolio.jsx`.
- **Login pages:** background image is `public/silverdoor.webp` (change `CONFIG.background`). Sign-in and password reset are
  **not connected to a server**; the `TODO(backend)` comment in each file marks where the request goes.
- **Sample content switch** (bottom-left): shows/hides labelled placeholders. Before launch, remove `PreviewToggle` and the
  `sample*` arrays (`components/Preview.jsx`, `pages/Portfolio.jsx`).
