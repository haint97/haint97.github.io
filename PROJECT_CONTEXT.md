# PROJECT_CONTEXT.md

## 1. Project Overview
- What this project does (1-2 sentences): A single-page, scrollable personal portfolio website (static HTML/CSS/JS) showcasing profile, skills, experience, projects, certifications, and contact info with lightweight animations and modals.
- Business purpose / who uses it: Used by recruiters, hiring managers, and collaborators to learn about Hai Nguyen Thai and view demos/certificates.
- Current status (MVP / production / legacy): Production (deployed as a GitHub Pages site).

## 2. Tech Stack
- Languages & versions: HTML5, CSS3, Vanilla JavaScript (ES6+); no pinned runtime version (runs in modern browsers).
- Frameworks & key libraries: AOS (Animate On Scroll) via CDN (`unpkg.com`, version `2.3.4`); Google Fonts via CSS `@import` (Inter + JetBrains Mono).
- Database(s): None.
- Infrastructure / deployment (Docker, AWS, Vercel, etc.): GitHub Pages deployment via GitHub Actions workflow; uploads the entire repo as static content on push to `master`.
- Package manager (npm / yarn / pnpm / pip / etc.): None (no `package.json` / build step).

## 3. Architecture
- High-level architecture pattern (MVC, microservices, monorepo, etc.): Static single-page site (SPA-like UX via anchor navigation); no backend.
- Folder structure with purpose of each key directory: `/index.html` (all markup/content + modal shells); `/styles.css` (theme tokens, layout, responsive styles, animations, modal styling); `/script.js` (all client-side behavior + `projectsData`); `/certs/` (certificate images); `/pet-projects/` (demo videos); `/.github/workflows/static.yml` (GitHub Pages deploy).
- Key modules / services and what they do: navigation (hamburger + smooth scroll + active section tracking); theme toggle via `<html data-theme>` (defaults dark, no persistence); modals (certificates + project demo/details); animation (AOS + IntersectionObserver; respects `prefers-reduced-motion`).
- Data flow overview: content is hard-coded in `index.html`; project details are hydrated from `projectsData` by `data-project` keys; demo modal loads local video via `data-video`; cert modal content comes from `data-cert-*` attributes.

## 4. Coding Conventions
- Naming conventions (files, variables, components): files are `index.html`, `styles.css`, `script.js` in repo root; asset names often include spaces; CSS classes are kebab-case and semantic (e.g. `project-card`, `nav-menu`, `cert-modal`); JS is mostly `const` + function declarations and uses `id`/class selectors and `data-*` keys.
- Code style / linter config (ESLint, Prettier, Black, etc.): None present.
- Patterns we always use: accessibility-first UI controls (`aria-*`, `role`, keyboard support, focus trapping/return focus); progressive enhancement (content readable without JS); respect reduced motion (`prefers-reduced-motion` disables/limits animations and AOS).
- Patterns we NEVER use: no backend logic or API calls; no client-side frameworks/build tooling unless explicitly introduced; no storage persistence (explicit comment: "no localStorage" for theme).

## 5. Key Domain Concepts
- Sections (each is a `<section id="...">`): `home`, `about`, `skills`, `experience`, `projects`, `certifications`, `education`, `contact`.
- Project cards: "Demo" buttons use `.btn-project-demo` with `data-demo="<key>"` and optional `data-video="<path>"`; "Details" buttons use `.btn-project-details` with `data-project="<key>"` that must exist in `projectsData`.
- Certifications: `.cert-card` buttons define `data-cert-name`, `data-cert-icon`, `data-cert-issuer`, `data-cert-verify`, and optional `data-cert-image`; `.achievement-badge[data-cert]` opens `/certs/<filename>` in the certificate modal.
- Modals: `openModalDialog` / `closeModalDialog` in `script.js` handle open/close state, focus trapping/return focus, and scroll locking.

## 6. Current Development Context
- What feature/module is actively being worked on: Portfolio content + UI polish (projects modals, animations, responsiveness). (Update as needed.)
- Known issues or tech debt to be aware of: one certification verify URL is missing a scheme (`coursera.org/...`); some GitHub links are placeholders (`href="#"`) or commented out; demo videos are `.mov` (format support varies); `pet-projects/llm-tegegram-bot/` name has a typo and is referenced by `data-video`.
- Anything AI should NOT change or touch: don't rename/move assets in `/certs` or `/pet-projects` without updating references; don't introduce bundlers/framework migrations unless explicitly requested.

## 7. Common Tasks & How We Do Them
- How to add a new API endpoint: Not applicable (no backend/API layer in this repo).
- How to add a new UI component: Add markup in `index.html`; add styles in `styles.css`; add behavior in `script.js` (prefer `data-*` attributes + a11y support).
- How to add a new DB migration: Not applicable (no database).
- How to run tests: No automated tests configured; validate manually in a browser (desktop + mobile widths). Local preview (one option): `python3 -m http.server 8000` then open `http://localhost:8000`.
- How to add a new project: Add a new `.project-card` in the `#projects` section in `index.html`; add/update the matching entry in `projectsData` in `script.js` (keyed by `data-project`); optionally add a demo video under `pet-projects/` and reference it via `data-video`.
- How to add a new certification/award: Add a new `.cert-card` or `.achievement-badge` in `index.html` with the correct `data-*` attributes; add the image to `certs/`; use full `https://...` verify URLs.

## 8. External Integrations
- Third-party APIs / services used: AOS library via CDN (`unpkg.com`); Google Fonts via `fonts.googleapis.com` `@import`; outbound links for certificate verification (Credly/Udacity/Coursera) and LinkedIn.
- Auth provider: None.
- Any webhooks or event systems: None.
