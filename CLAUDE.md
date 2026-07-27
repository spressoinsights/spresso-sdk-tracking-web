# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (bundles with source maps, serves at http://localhost:3003/spresso.sdk.tracking.web.js)
npm run dev

# Development in production mode (no source maps, simulates prod build)
npm run dev:prod-mode

# Production build (outputs to dist/)
npm run build

# Build docs in watch mode (open ./docs/index.html in browser)
npm run docs

# Reset dist and cache
npm run reset
```

There is no test suite configured (`npm test` exits with an error). The `dev` and `dev:prod-mode` commands spin up a [Mountebank](https://www.mbtest.org/) mock server on port 2525 (via `npm run dev:mb`) and set up a mock endpoint at `http://localhost:1337/track` (via `npm run dev:setup`). This replaces the real Spresso API during local development.

## Architecture

This is a browser analytics SDK that bundles to a single UMD JS file (`dist/spresso.sdk.tracking.web.js`) which exposes `window.SpressoSdk` as a global.

### Event flow

1. Callers invoke a `track*` method on the `SpressoSdk` singleton (e.g. `trackViewPDP`, `trackTapAddToCart`).
2. Each method calls `queueEvent({ eventName, eventData })`.
3. `queueEvent` delegates to `EventFactory[eventName].createEvent(...)` to build a typed event object with root props (uid, timestamp) and meta props (deviceId, userId, page, userAgent, version).
4. The event is pushed onto `eventsQueue`. A 3-second debounce timer (`executeLater`) batches events; the queue flushes immediately on `TAP_ADD_TO_CART` or on page unload (`beforeunload`).
5. `execute()` calls `utils/api/track()` which POSTs `{ datas: [...] }` to either the Spresso API or localhost in dev mode.

### Module layout

- `src/index.ts` — `SpressoSdk` class and public API, exported as UMD default
- `src/event-factory/index.ts` — `EventFactory` map: event name → `createEvent` function; all event/data interfaces
- `src/utils/api/index.ts` — `track()` fetch wrapper; endpoint selection (prod/staging/dev)
- `src/utils/properties/index.ts` — `initDeviceId`, `getMetaProps`, `getRootProps`; `deviceId` is persisted in the `spressoDeviceId` cookie (2-year TTL)
- `src/utils/cookie/index.ts` — cookie read/write/remove helpers
- `src/utils/browser/index.ts` — browser guards (`isBrowser`), `IntersectionObserver` wrapper for glimpse events, SPA page-view listener, URL helpers
- `src/utils/debug/index.ts` — `consoleLog` (no-ops in production)

### Path aliases (tsconfig + webpack)

`utils/*` resolves to `src/utils/*/index` and `event-factory` resolves to `src/event-factory/index`. These are configured in both `tsconfig.json` and via `TsconfigPathsPlugin` in `webpack.config.js`.

### Build

Webpack bundles `src/index.ts` as a UMD library. Babel handles browser compatibility (two envs: `development` and `production`). `__SDK_VERSION__` is injected at build time from `package.json`.

## Deploy

- **Staging**: merge to `staging` branch → CI uploads to GCP bucket under the commit hash folder.
- **Production**: update `package.json` version → merge `staging` → `main` → create a release tag matching the version → CI uploads to GCP bucket under the version folder and republishes docs.
