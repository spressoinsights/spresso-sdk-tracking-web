# Spresso Web Event SDK

## Installation

See the [docs](https://spressoinsights.github.io/spresso-sdk-tracking-web/) for more info.

## Development

`npm run dev` bundles and serves the SDK on: `http://localhost:3002/spresso.sdk.tracking.web.js`.

`npm run dev:prod-mode` does the same but as if `NODE_ENV === 'production'`, i.e., no sourcemap and logging in browser console.

### Developer workflow

-   Create branch from `main` into `feature/SPRS-XXXX`.
-   Test locally on webapp by changing the script `src` in `components/misc/spresso-web-sdk` to:

```
http://localhost:3002/spresso.sdk.tracking.web.js
```

### Updating docs

-   `npm run docs` will build the docs locally in watch mode.
-   Open `./docs/index.html` in your browser.

## Build and deploy

### Staging

-   PR feature branch to `staging`.
-   Push/merge to `staging` branch to build/upload script to staging [Spresso GCP bucket](https://console.cloud.google.com/storage/browser/spresso-saas-staging-spresso-sdk-tracking-web;tab=objects?forceOnBucketsSortingFiltering=false&project=spresso-saas-staging&prefix=&forceOnObjectsSortingFiltering=false), nested under the folder named the last commit hash pushed to `staging`.

### Production

-   Update the version in `package.json`.
-   PR `staging` branch to `main`.
-   Push/merge to `main` branch will NOT build/upload script.
-   Create a new release tag (must equal the `package.json` version) on `main` to build/upload script to production [Spresso GCP bucket](<https://console.cloud.google.com/storage/browser/spresso-saas-prod-spresso-sdk-tracking-web?project=spresso-saas-prod&pageState=(%22StorageObjectListTable%22:(%22f%22:%22%255B%255D%22))&prefix=&forceOnObjectsSortingFiltering=false>), nested under the folder named the release version.
-   A new release tag will also re-publish the docs.

## Author

Spresso, developer@spresso.com

## License

Spresso Web Event SDK is available under the MIT license. See the LICENSE file for more info.
