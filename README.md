# mikeonline-cv

Frontend of the [MikeOnLine online CV](https://cv-mikeonline.web.app): Angular 21, NgRx, PrimeNG / Angular Material, PWA, hosted on Firebase Hosting. Data comes from [`mikeonline-api`](https://github.com/MikeDev75015/mikeonline-api).

> An overhaul is in progress, see [`docs/PLAN_REFONTE.md`](./docs/PLAN_REFONTE.md) (phase 0 delivered in 1.13.0).

## Requirements

- Node.js >= 22, npm >= 10
- The API running locally on `http://localhost:5000` (see `src/environments/environment.ts`), or set `interceptBackendRequest: true` to serve the JSON fixtures of `__mocks__/v1/json-files` instead

## Scripts

```bash
npm ci                 # install (lockfile is authoritative)
npm start              # dev server on http://localhost:4200
npm run build-prod     # production build to dist/production
npm run build-staging  # staging build to dist/staging
npm test               # unit tests (Vitest + jsdom)
npm run test:watch
npm run test-coverage
npm run lint           # ESLint (TypeScript + templates)
npm run deploy:prod    # build-prod + firebase deploy (needs firebase login)
```

## Structure

- `src/app/core`: NgRx store (actions, effects, reducers, selectors), HTTP services and interceptors, shared models
- `src/app/modules/application`: public site (home, skills, experiences, formations, portfolio, interests)
- `src/app/modules/admin`: back-office (sign-in, CRUD tables) behind the API authentication
- `src/app/shared`: form wrappers, pipes, utilities
- `__mocks__`: JSON fixtures (anonymised) and service mocks used by the tests and the optional fake backend

## Authentication (admin)

`POST /auth/login` returns an access token and a refresh token, both kept in `localStorage`. The access token is added to API requests by `HttpRequestInterceptor`; on a `401 INVALID_TOKEN`, `HttpErrorInterceptor` rotates the pair through `PUT /auth/refresh-token` (refresh token as Bearer) and retries once. A failed refresh clears the session and redirects to `/admin/sign-in`.

## CI / deployment

GitHub Actions (`.github/workflows/ci.yml`) runs lint, tests, production build and a production dependency audit on every push. Firebase deployments are still driven by the legacy CircleCI configuration (`develop` → staging, `vX.Y.Z` tags → production) and will be migrated in phase 1 of the plan.
