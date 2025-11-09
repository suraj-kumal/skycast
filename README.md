# Skycast

A small Vite + React app. This repository contains the source, configuration, and basic styling for a frontend app built with Vite and React.

## Quick start

1. Install dependencies

```bash
npm install
```

2. Run the dev server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Preview the production build

```bash
npm run preview
```

(These scripts are provided via [package.json](package.json).)

## Project structure

- [.eslintrc.cjs](.eslintrc.cjs) — ESLint configuration
- [.gitignore](.gitignore)
- [index.html](index.html) — App entry HTML
- [package.json](package.json) — Project metadata & scripts
- [README.md](README.md) — This file
- [styles.css](styles.css) — Global CSS
- [vite.config.js](vite.config.js) — Vite configuration

src/

- [src/App.jsx](src/App.jsx) — Main React component (`App`)
- [src/App.css](src/App.css) — Styles for `App`
- [src/index.css](src/index.css) — Base styles
- [src/main.jsx](src/main.jsx) — React entry point that mounts the app
- [src/assets/](src/assets/) — Static assets
  - [src/assets/img/](src/assets/img/) — Images used by the app
- [src/components/Popup.jsx](src/components/Popup.jsx) — Reusable `Popup` component (`Popup`)

References in code:

- Main app component: [`App`](src/App.jsx)
- App entry: [`main`](src/main.jsx)
- Popup component: [`Popup`](src/components/Popup.jsx)



