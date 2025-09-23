# DuckHub

DuckHub is a demo comics reader built with Angular 20, Tailwind v4, and PWA support.

## Tech Stack

* Angular 20 (standalone, control flow @if/@for)
* Tailwind CSS v4 (CSS-first `@theme`)
* Signals for state management (Auth, Settings, Bookmarks, Comics)
* PWA (Service Worker, `ngsw`)
* LocalStorage for mocks (auth, bookmarks, admin overlay)

## Features

* Auth (login/register) with guards + HTTP interceptor (mock tokens)
* Comics list & detail (chapters, pages gallery)
* Reader with 3 modes:

  * Vertical (webtoon): stacked pages, Prev/Next → chapter ±
  * LTR / RTL: single page stage, Prev/Next & arrows → page ±
* Bookmarks per comic (chapter + page), resume from bookmarks page
* Admin dashboard (CRUD) using localStorage override
* Settings (reading mode) persisted in LocalStorage
* PWA-ready

## Setup

```bash
npm install
ng serve
```

## Tailwind v4

* `@tailwindcss/postcss` plugin via `.postcssrc.json`
* `src/styles.css`:

  ```css
  @import "tailwindcss";
  @theme { /* custom CSS variables */ }
  ```

## Scripts

```bash
npm run start        # dev
npm run build        # production build
npm run lint         # ESLint
npm run test         # unit tests (Karma/Jasmine)
```

## PWA

```bash
ng build --configuration production
npx http-server -p 4200 dist/duckhub/
```

## Test accounts

* admin / admin123
* ducklover / quackquack

## Commits

Conventional Commits (feat, fix, chore, refactor, test, docs, build, ci).
