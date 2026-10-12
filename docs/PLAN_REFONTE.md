# Plan de refonte totale — CV en ligne MikeOnLine

> Périmètre : `mikeonline-cv` (Angular, Firebase Hosting) + `mikeonline-api` (NestJS/Fastify, MongoDB Atlas, Heroku).
> Date de l'état des lieux : 2026-10-12. Mesures prises sur un clone propre, Node 22.22 / npm 10.9.

---

## 0. Résumé exécutif

**Verdict.** Les deux projets ont reçu en mars 2026 une montée de version « mécanique » (Angular 13 → 21, Nest 7 → 11) qui compile, mais sans refonte des patterns ni du design. Résultat : une base **hybride** (Angular 21 en NgModules, thèmes PrimeNG d'il y a 5 versions, NgRx 19 sur Angular 21, CI CircleCI pointant encore vers Bitbucket, Cypress non exécutable, 30 tests unitaires rouges) et une API avec des **failles de sécurité réelles** (mot de passe stocké en clair à la mise à jour, refresh token illimité, aucune limitation de débit).

**Stratégie recommandée : refonte progressive par strates, pas de réécriture « big bang ».**
Le domaine métier (7 ressources CRUD + auth) est petit et bien délimité. On garde la stack (Angular + NestJS + MongoDB), on remplace couche par couche en gardant un site déployable à chaque phase.

**Sept décisions structurantes** (détaillées en §3) :

| # | Décision | Recommandation |
|---|---|---|
| D1 | Organisation du code | **Monorepo** `apps/web`, `apps/api`, `packages/contracts` (types partagés) |
| D2 | Frontend | Angular 22, **standalone + signals + zoneless**, builder esbuild, pages routées |
| D3 | État | **Suppression de NgRx** classique → `@ngrx/signals` (SignalStore) ou services à signaux |
| D4 | UI | Site public : **composants maison + design tokens CSS** (zéro lib UI). Admin : **PrimeNG 22** seul (lazy). Suppression d'Angular Material, des 42 thèmes legacy, des 3 FontAwesome |
| D5 | Backend | NestJS 12 + **`mongodb-dynamic-api` v6** (CRUD, auth dual-token, autorisation, validation, Swagger, health, tests e2e générés) : les 7 contrôleurs copiés et l'auth maison disparaissent. `@nestjs/config`, Docker Node 22 |
| D6 | Qualité | Vitest (gardé) + **Playwright** (remplace Cypress), GitHub Actions (remplace CircleCI), Lighthouse CI |
| D7 | SEO/PDF | **Prerender** des routes publiques (SSG compatible Firebase Hosting), vue `/print` + CSS print pour le PDF (pdfmake lazy en option) |

**Effort estimé** : 50 à 65 jours-homme répartis en 7 phases (§5). Les phases 0 et 1 (stabilisation + sécurité) sont **urgentes** et indépendantes du reste.

---

## 1. État des lieux mesuré

### 1.1 Frontend `mikeonline-cv` (ocv-front v1.12.2)

| Indicateur | Valeur | Commentaire |
|---|---|---|
| `npm ci` sur clone propre | **échoue** | Conflit de peers : `@ngrx/*@19` exige Angular 19. Le lockfile a été généré avec `--legacy-peer-deps` |
| Tests unitaires (Vitest 4) | **30 échecs / 218** (5 fichiers) | `skills.component.spec` (20), `pwa.service.spec` (7), `projects`, `admin-layout`, `utils` |
| Lint (`ng lint`) | OK | mais `no-explicit-any` désactivé, 0 règle template |
| Build prod | OK en 44 s, builder **webpack legacy** | bundle initial **1,12 Mo** (budget 500 ko dépassé de 615 ko), dist 16 Mo dont **9 Mo de thèmes CSS inutilisés** |
| Vulnérabilités (deps prod) | 6 high / 4 moderate | `@angular/common` (DoS formatDate, cache leak), `@angular/compiler` (XSS), `pdfmake` (SSRF) |
| Vulnérabilités (toutes) | 146 dont 14 critical | essentiellement `firebase-tools@11` (vm2) et la chaîne Cypress/mocha |
| Composants / specs | 50 / 85 | 65 specs ne contiennent qu'un `should create` |
| Standalone / signals / `inject()` | **0 / 0 / 0** | 59 `standalone: false`, 159 `@Input()`, 54 injections par constructeur |
| `any` / `@ts-ignore` / `console.*` | 276 / 43 / 53 | dans le code non-test |
| `!important` CSS | 157 | + 33 `style=""` inline, 32 `[ngStyle]` |
| E2E Cypress 13 | **non exécutable** | config `cypress.json` legacy, dossier `integration/`, import de `cypress-jest-adapter` absent du package.json |
| SEO | `robots.txt` = `Disallow: /` | et ni robots ni sitemap ne sont dans les assets du build. Pas d'OpenGraph, pas de prerender |
| Dernière release | 1.12.2 (déc. 2022) | CHANGELOG pointe vers Bitbucket |

**Dette d'architecture notable**

- Navigation publique par **hash + `mat-tab-group`**, pas par routes. Le code cible encore les classes Material pré-MDC (`.mat-tab-label`, `.mat-ink-bar`, 12 occurrences) : icônes d'onglets, mise à jour du hash et styles d'onglets sont probablement cassés depuis Material 15.
- **PrimeNG 21 sans `providePrimeNG()`** ni preset `@primeuix/themes` : les composants ne sont pas stylés comme prévu ; le `ThemingService` (42 thèmes) permute des CSS d'une autre génération de DOM.
- **Deux thèmes Material** chargés simultanément (indigo-pink via angular.json, deeppurple-amber via `styles.scss` avec syntaxe `~` webpack).
- **Trois FontAwesome** (CSS 5.5 CDN + kit JS + `angular-fontawesome` jamais utilisé), Material Icons CDN, Roboto chargé deux fois.
- NgRx : 36 fichiers / 1 281 lignes pour un store **en lecture seule** (5 slices entité copiées-collées), lu par snapshot `take(1)` dans un `DataService` ; l'admin écrit directement en HTTP sans passer par le store.
- `EncryptionService` (tweetnacl) : clé codée en dur + nonce nul → c'est de l'obfuscation du `localStorage`, pas du chiffrement.
- Service worker enregistré deux fois ; 11 balises `<script>` Firebase compat jamais utilisées (`useEmulator=true` en prod).
- `environment.staging.ts` référencé par `angular.json` mais **inexistant** → `build-staging` casse.
- Scripts npm Windows-only (`rmdir /s /q`), `.firebase/*.cache` commités, listeners `resize/scroll` jamais retirés (8 composants), `cdRef.detectChanges()` dans `ngAfterViewChecked`.
- Dépendances mortes : `jquery`, `hammerjs`, `wordcloud` (npm ; une copie globale `assets/js/wordcloud2.js` est utilisée à la place), `jspdf`, `jasmine*`, `mocha*`, `ng2-mock-component` (deps **et** devDeps), `@angular/animations` (déprécié), `platformBrowserDynamic`.

### 1.2 Backend `mikeonline-api` (ocv-backend v0.1.6)

| Indicateur | Valeur | Commentaire |
|---|---|---|
| `npm ci` sur clone propre | **échoue** | `package-lock.json` désynchronisé (`chokidar`, `readdirp`) |
| Build / tests | OK — 51 tests / 35 suites verts | mais 34 tests sont des `should be defined` ; aucun test de `V1Service`, `AuthenticationService`, `UsersService` |
| Lint (`--max-warnings=0`) | **5 erreurs, 87 warnings** | |
| Vulnérabilités (deps prod) | 12 high / 7 moderate | `path-to-regexp` (ReDoS), `uuid` via `uuidv4` (jamais importé) |
| TypeScript | **`strict` désactivé**, target es2017 | ~40 `any` dont `@Response() res: any` × 32 |
| Dockerfile | `node:16.3.0-alpine3.13`, mono-stage, root, `npm install` complet | contradiction avec `engines: node >=20.11.1` |
| CI | CircleCI `cimg/node:16.13.1`, orbs 2021 | tags `staging`/`release` poussés par scripts mais sans workflow correspondant |
| README | boilerplate Nest intact | aucune doc des variables d'env, pas de `.env.example` |

**Failles de sécurité confirmées (à corriger en priorité absolue)**

| Sévérité | Constat | Fichier |
|---|---|---|
| Critique | `updateUser` écrit `password` (et `accessToken`) via `$set` **sans bcrypt** → mot de passe en clair et compte inutilisable | `src/modules/users/services/users.service.ts` |
| Critique | `RefreshTokenStrategy` : `ignoreExpiration: true`, **même secret** que l'access token, aucun contrôle en base → tout JWT jamais émis (expiré, déconnecté) régénère des tokens 1 h **indéfiniment** | `src/modules/authorization/services/refresh-token-strategy/` |
| Haute | Aucun rate-limiting, pas de helmet → `/auth/login` brute-forçable | `src/main.ts` |
| Haute | `ValidationPipe` sans `whitelist`/`forbidNonWhitelisted` ; DTOs incomplets (skills, projects, interests) ; `@Query()` brut passé à `model.find()` sur cv-infos/interests/tags/users | contrôleurs v1, `users.controller.ts` |
| Haute | `SWAGGER_ENABLED=true` ouvre CORS à **toutes** les origines ; Swagger toujours monté, protégé par une comparaison non constant-time | `src/main.ts`, `core.service.ts` |
| Moyenne | Rôles codés en dur par verbe HTTP, 401 au lieu de 403 ; logout n'invalide rien côté JWT | `src/core/guards/roles/roles.guard.ts` |
| Moyenne | `.dockerignore` n'exclut ni `.env` ni `.git` → un `.env` local part dans l'image | `.dockerignore` |
| Info | Données personnelles réelles (téléphone, email, date de naissance) dans `__mocks__/json-files/cv-infos.json`, et dans `mikeonline-cv/__mocks__/v1/json-files/` | |

**Dette d'architecture notable**

- 7 contrôleurs **identiques à 95 %** (102 lignes chacun), même logique `PUT /many` avec convention magique `id.includes('duplicated')`.
- Un `V1Service` unique qui switch sur un enum vers `Model<any>` ; pas de pagination, filtres ignorés sur 4 ressources (documentés dans Swagger mais sans effet).
- Toutes les dates stockées en **string**, relations tags par `tagIdList` sans intégrité, schémas `Object`/`Array` non typés.
- Mise à jour d'un id inconnu → `Error` dans l'adapter → **500** au lieu de 404. `deleteMany` avec un seul `idList` compare `deletedCount` à la **longueur de la chaîne**.
- `@Response() res` + `HttpResponseService.sendResponse` partout : contourne le pipeline Nest (interceptors, sérialisation, `@ApiResponse` typés).
- Hack global `EventEmitter.setMaxListeners(0)` + `process.exit(1)` sur warning.
- `moment-timezone` pour une seule fonction, `TIMEZONE` lu puis ignoré ; `nanoid@3`, `uuidv4`, `rimraf` en dépendance runtime, `heroku-client`, `tslint-class-validator-rule`, `supertest` installés et inutilisés.

### 1.3 Infra et exploitation

- Front : Firebase Hosting (prod `cv-mikeonline`, staging `cv-mikeonline-staging`), déploiement par `firebase deploy --token` (déprécié).
- API : Heroku via `heroku/deploy-via-git` sur tag `vX.Y.Z`. URL prod `https://mikeonline-api-af15d187742e.herokuapp.com`.
- Base : MongoDB Atlas (SRV), une connexion nommée `BDD_BASE`.
- **Non vérifié depuis cet environnement** (réseau sortant restreint) : disponibilité réelle du site, de l'API Heroku et de la base. À confirmer avant la phase 0.

---

## 2. Objectifs de la refonte

1. **Sécurité** : zéro vulnérabilité high/critical en dépendances de prod, auth conforme (refresh token dédié, rotation, hash systématique, rate-limit).
2. **Reproductibilité** : `npm ci` + `npm test` + `npm run build` verts sur clone propre, Node 22 LTS partout (local, CI, Docker).
3. **Modernité technique** : Angular 22 standalone/signals/zoneless, NestJS 12 strict, un seul système de design, un seul jeu d'icônes.
4. **Performance** : bundle initial public < 300 ko (vs 1,12 Mo), Lighthouse ≥ 95 sur les 4 axes, LCP < 1,5 s en 4G.
5. **Design** : identité visuelle refaite (tokens, typo, dark mode), navigation par vraies routes, responsive mobile-first, accessibilité WCAG 2.2 AA.
6. **SEO** : pages publiques prerendues, robots/sitemap/OpenGraph corrects, données structurées `Person`/`JobPosting`-like (schema.org).
7. **Maintenabilité** : code dupliqué éliminé (contrôleurs, slices, pages admin), contrats API partagés front/back, tests qui testent (reducers, services, auth, e2e critiques).
8. **Réutilisation** : l'API s'appuie sur vos propres bibliothèques (`mongodb-dynamic-api`, `mongodb-pipeline-builder`) : le CV devient aussi une vitrine fonctionnelle de ces projets.

---

## 3. Décisions d'architecture (cibles)

### D1 — Monorepo avec contrats partagés

**Cible** : un dépôt `mikeonline` géré par **pnpm workspaces** (Nx optionnel si l'outillage de cache/affected devient utile).

```
apps/web          Angular 22 (site public + admin)
apps/api          NestJS 12
packages/contracts  Entités + DTO partagés (classes `class-validator`, le mécanisme natif de mongodb-dynamic-api ; types TS côté Angular, validation réutilisable dans les formulaires)
packages/config    eslint, tsconfig, prettier partagés
```

> Les entités `mongodb-dynamic-api` portent les décorateurs `@Prop` (Mongoose) **et** `class-validator`. Pour qu'Angular n'embarque pas Mongoose, `packages/contracts` expose deux entrées : `contracts/api` (entités complètes) et `contracts/web` (interfaces et DTO de validation uniquement, générés ou maintenus à côté). Les champs protégés (`password`, hash du refresh token) sont marqués `@ProtectedField` et n'apparaissent jamais dans les réponses.

**Pourquoi** : solo dev, deux repos qui dupliquent déjà les interfaces (`UserV1`, `Skill`, `Experience`…), une CI, un seul `npm ci`, releases synchronisées.
**Alternative** si le monorepo est refusé : garder deux repos + publier `@mikeonline/contracts` sur GitHub Packages. Coût : versionnage et publication à chaque changement de contrat.

### D2 — Frontend Angular 22, standalone, signals, zoneless

- Builder `@angular/build:application` (esbuild/Vite), suppression de `polyfills.ts`, `platformBrowser` + `bootstrapApplication`, `provideZonelessChangeDetection()`.
- 100 % standalone, `inject()`, `input()`/`output()`/`model()`, `viewChild()`, `@if/@for` déjà en place.
- `OnPush` partout (implicite en zoneless), zéro `detectChanges()` manuel, zéro accès `window`/`document` hors d'un service `Platform`/`BreakpointObserver` (CDK ou `matchMedia` encapsulé).
- **Navigation par routes** : `/`, `/competences`, `/experiences`, `/formations`, `/projets`, `/centres-d-interet`, `/contact`, `/print`, `/admin/**` (lazy). Scroll restoration et ancres gérés par le Router.
- Animations : suppression de `@angular/animations` (déprécié) → CSS transitions + `@starting-style` + View Transitions API pour les changements de route.
- i18n : garder `@ngx-translate/core@18` (API standalone `provideTranslateService`) **ou** passer au `$localize` natif si la langue reste unique. Recommandation : ngx-translate 18, fichiers `fr.json` (+ `en.json` optionnel en phase 4), **tout texte UI sorti des templates**.
- Dates : `dayjs` conservé ou remplacé par `Intl.DateTimeFormat`/`Temporal` ; décision en phase 3 selon les besoins (relative time en FR).

### D3 — État : SignalStore à la place de NgRx classique

Le store actuel est en lecture seule et lu par snapshot. Cible :

- `@ngrx/signals` **ou** services `@Injectable({providedIn:'root'})` exposant `signal`/`computed` + `resource()`/`httpResource()` d'Angular pour le fetch.
- Un store par ressource généré depuis un **factory générique** `createResourceStore<T>(path)` : `entities`, `status`, `error`, `load()`, `upsert()`, `remove()`. Partagé par le public **et** l'admin (fin du double chemin HTTP).
- Suppression de `StoreDevtools`, des 9 effects, du `DataService` snapshot, des `Subject` statiques (`ContactOpenCloseService`, `ErrorMessageService`, `TableWrapperService.onMessage`).

### D4 — UI : design system maison (public) + PrimeNG 22 (admin)

**Site public** : aucune lib de composants. Design tokens CSS (`--color-*`, `--space-*`, `--radius-*`, `--font-*`), `prefers-color-scheme` + bascule manuelle, `prefers-reduced-motion`, layout CSS Grid/container queries. Composants nécessaires : nav, hero, carte, timeline, chip/tag, accordéon (`<details>` natif stylé), dialog (`<dialog>` natif), toast léger, bouton. Tous accessibles au clavier.

**Admin** (`/admin`, lazy) : **PrimeNG 22** avec `providePrimeNG({ theme: { preset: Aura } })` + `primeicons@8`, pour `p-table` (tri, filtre, édition inline, réordonnancement), `p-dialog`, `p-confirmDialog`, `p-pickList`, `p-select`, `p-multiSelect`, `p-toast`. Formulaires passés en **Signal Forms** (Angular 22) ou Reactive Forms typés, construits depuis les DTO `class-validator` de `packages/contracts` (mêmes règles que l'API, erreurs 400 champ par champ remontées telles quelles).

**Supprimés** : Angular Material + CDK (sauf `BreakpointObserver`/`a11y` si utile, sinon rien), les 42 thèmes legacy (`assets/themes`, 9 Mo), `ThemingService`, les trois FontAwesome, Material Icons CDN, `hammerjs`, `jquery`, `wordcloud` npm.

**Icônes** : un seul set SVG tree-shakable (`@ng-icons/lucide` ou sprite SVG maison). PrimeIcons uniquement dans l'admin.

**Polices** : Inter variable **auto-hébergée** (`font-display: swap`, subset latin), plus de Google Fonts.

### D5 — Backend NestJS 12 sur `mongodb-dynamic-api` v6

**Principe** : l'API actuelle réimplémente à la main ce que `mongodb-dynamic-api` (MDA, v6.2.2, NestJS 12, Mongoose 8) fournit déjà. On ne réécrit donc pas un « module générique » maison : on **déclare** les entités et on laisse MDA générer contrôleurs, services, auth, validation, Swagger et tests. Le code applicatif se réduit aux entités, aux prédicats d'autorisation, à quelques callbacks et aux routes custom.

**Ce que MDA remplace, élément par élément**

| Code actuel | Remplacé par |
|---|---|
| 7 contrôleurs copiés + `V1Service` à `switch` + 7 adapters | `DynamicApiModule.forFeature({ entity, controllerOptions: { path, version: '1' }, routes })` × 7 ; routes `GetMany`, `GetOne`, `CreateOne/Many`, `UpdateOne/Many`, `ReplaceOne`, `DeleteOne/Many`, `DuplicateOne/Many`, `Aggregate` |
| Convention `id.includes('duplicated')` dans `PUT /many` | routes `DuplicateOne`/`DuplicateMany` natives |
| `id` nanoid + `_id`, dates string, pas de timestamps | `BaseEntity` (`id`, `createdAt`, `updatedAt`, `_id`/`__v` masqués), `@Prop({ type: Date })` |
| Auth maison (local + jwt + refresh sans expiration, même secret) | `useAuth` : access 15 min + **refresh dédié** (`refreshSecret` distinct **obligatoire** en v6, hash bcrypt en base, rotation, `reuseWindowMs`, `multiSession`, révocation, `/auth/logout` et `/auth/logout-all`), `loginField: 'name'`, `additionalFields: ['role']` |
| `RolesGuard` par verbe HTTP, 401 au lieu de 403 | `isPublic: true` sur `GetMany`/`GetOne` des 7 ressources ; `abilityPredicate: (entity, user) => user.role === 'admin'` sur toutes les écritures ; `authAbilityPredicate` pour fermer `/auth/register` |
| `updateUser` sans hash | `/auth/account` (`PATCH`) et `/auth/change-password` gérés par MDA ; `password` en `@ProtectedField` |
| `ValidationPipe` sans whitelist, DTO incomplets | `enableDynamicAPIValidation` : `whitelist + forbidNonWhitelisted` par défaut en v6, décorateurs `class-validator` **sur l'entité**, `@IsUnique` / `@EntityExists` (`tagIds` → `Tag`) |
| `tagIdList` sans intégrité, lookup manuel | `@Prop({ type: [Types.ObjectId], ref: 'Tag' })` + `populate: 'tags'` sur `GetMany`/`GetOne` ; `cascade` ou `beforeDeleteCallback` sur `DeleteOne` de `Tag` pour nettoyer les références |
| `GET /v1/skills/:id` (éléments liés) via `mongodb-pipeline-builder` | route `Aggregate` avec `toPipeline` (MDA embarque déjà `mongodb-pipeline-builder`) **ou** `customRoutes` dans `forFeature` ; pagination `$facet` incluse |
| Pas de rate-limit, pas de health | `rateLimit` par route auth (`login: { limit: 5, ttl: 60000 }`, `refreshToken`, `resetPassword`) + `ThrottlerModule` ; `DynamicApiHealthModule.register()` → `GET /health` |
| Swagger manuel + basic-auth bricolé | Swagger généré par MDA, décorateurs de visibilité ; activé hors prod uniquement |
| `main.ts` Fastify + hack `EventEmitter` | `main.ts` minimal : `enableDynamicAPIValidation`, `enableDynamicAPISwagger` (hors prod), `enableShutdownHooks`, CORS liste blanche |
| 35 specs `should be defined` | `createDynamicApiTestingApp` (`mongodb-dynamic-api/testing`) + `supertest` + `mongodb-memory-server` : un e2e par ressource et par parcours auth |
| Génération manuelle des 7 modules | schematic `nest g -c mongodb-dynamic-api resource <name>` |

**Points d'attention spécifiques à MDA**

- **Plateforme HTTP** : MDA embarque `@nestjs/platform-express` et sa doc ne mentionne pas Fastify. L'API actuelle tourne sur Fastify. Recommandation : **basculer sur Express** (trafic faible, zéro plugin Fastify indispensable, suppression des hacks `@fastify/basic-auth` et `onRequest`). À confirmer avec l'auteur de la lib (vous) si un support Fastify est prévu, sinon la bascule se fait en phase 2 (Q10).
- **Garde globale** : dès que `useAuth` est configuré, `DynamicApiJwtAuthGuard` protège **tout**, y compris les contrôleurs écrits à la main → `@Public()` explicite sur chaque route publique (les 7 `GetMany`/`GetOne`, `/health`).
- **Validation partagée** : MDA valide avec `class-validator` sur l'entité ; le front réutilise ces DTO (D1). Zod n'est donc **pas** introduit côté API pour éviter deux systèmes de validation.
- **Secrets** : `JWT_SECRET` et `JWT_REFRESH_SECRET` distincts, obligatoires au boot (`forRoot()` lève sinon). Rotation des deux à la mise en prod.
- **WebSockets / Presence / Cache Redis** : non utilisés au départ (`webSocket: false`, pas de `DynamicApiPresenceModule`). Le cache HTTP global de MDA peut servir aux `GetMany` publics (invalidation automatique à l'écriture) : à activer en phase 2 si le prerender ne couvre pas déjà le besoin.
- **Dépendances transitives** : MDA tire `socket.io`, `ioredis`, `cache-manager`, `ts-morph`, `@angular-devkit/schematics`. Image Docker à mesurer ; `npm audit --omit=dev` doit rester propre.
- **Pinning** : suivre les majeures de MDA (v6 a durci les défauts : secrets requis, bodies stricts, broadcasts authentifiés). Codemod `migrate-v5` disponible si on partait d'un code v4/v5, non pertinent ici (projet neuf).

**Hors MDA, toujours à faire**

- `tsconfig` : `strict: true`, target `es2022`, suppression des `any`.
- **Config** : `@nestjs/config` + validation du schéma d'env (`class-validator` ou `envalid`) : `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGINS`, `SWAGGER_ENABLED`, `NODE_ENV`. `.env.example` versionné. Fin du `Env.get`.
- **Observabilité** : logs structurés (`nestjs-pino`), niveau `MONGODB_DYNAMIC_API_LOGGER` réglable, `enableShutdownHooks()`.
- **Modèle et migration** : script idempotent qui convertit les documents existants (dates string → `Date`, `tagIdList` nanoid → `ObjectId` de `tags`, `id` nanoid conservé en champ legacy le temps de la bascule du front), exécuté sur un dump avant la prod.
- **Dépendances** : suppression de `moment-timezone`, `nanoid`, `uuidv4`, `rimraf` (runtime), `heroku-client`, `tslint-*`, `passport*` et `@nestjs/passport|jwt|swagger|mongoose` en direct (fournis par MDA), `@fastify/*`.
- **Docker** : multi-stage `node:22-alpine`, `npm ci --omit=dev`, utilisateur non-root, `HEALTHCHECK` sur `/health`, `.dockerignore` complet (`.env`, `.git`, `coverage`, `dist`).

### D6 — Qualité, CI/CD

- **GitHub Actions** (le code est sur GitHub ; CircleCI/Bitbucket/Jira sont des reliquats) : `ci.yml` (install, lint, typecheck, unit, build, audit prod), `e2e.yml` (Playwright sur build prerendu + API en conteneur avec `mongodb-memory-server` ou service Mongo), `deploy-web.yml` (Firebase Hosting via `FirebaseExtended/action-hosting-deploy` avec compte de service, previews de PR), `deploy-api.yml` (image Docker → Heroku Container Registry, ou plateforme choisie en Q2 §7).
- **Tests** : Vitest 5 + `@analogjs/vitest-angular` (front), Jest 30 ou Vitest (back — recommandation : **Vitest partout** pour un seul runner dans le monorepo), **Playwright** (préinstallé dans l'environnement cloud) pour 6 à 8 parcours critiques, couverture minimale 70 % lignes sur `apps/*/src` hors specs.
- **Qualité statique** : ESLint 9/10 flat config partagé, `no-explicit-any: error`, `@angular-eslint/template` (a11y rules), Prettier, `typescript-eslint` strict, SonarCloud conservé si souhaité.
- **Perf** : Lighthouse CI avec budgets (`budget.json`), `source-map-explorer` en revue.
- **Releases** : `release-please` (remplace `standard-version` déprécié) avec Conventional Commits, CHANGELOG régénéré avec URLs GitHub.

### D7 — SEO, PDF, PWA

- **Prerender (SSG)** des routes publiques via `@angular/ssr` en mode `prerender` : HTML complet servi par Firebase Hosting, hydratation côté client puis rafraîchissement des données. Compatible avec l'hébergement statique actuel (pas de Cloud Functions). Si les données changent souvent, un webhook « publier » dans l'admin déclenche un rebuild GitHub Actions.
- **Métadonnées** : `robots.txt` autorisant l'indexation, sitemap généré au build, OpenGraph/Twitter cards, canonical, JSON-LD `Person` + `ProfilePage`, `theme-color` cohérent manifest/HTML.
- **PDF** : route `/print` avec feuille `@media print` (mise en page A4, sauts de page contrôlés) → bouton « Télécharger le CV » = `window.print()` ou génération navigateur. Option : `pdfmake@0.3.11` chargé **à la demande** (`import()`) si un fichier binaire reste indispensable. Suppression du type file de 623 lignes écrit à la main.
- **PWA** : `provideServiceWorker()` unique, `ngsw-config` revu (plus de Google Fonts), manifest avec `id`, `screenshots`, icônes maskable séparées des `any`. Suppression des 11 scripts Firebase compat.

---

## 4. Design et UX cibles

### 4.1 Direction visuelle

- **Identité** : conserver le bleu profond `#024873` comme couleur d'accent historique, mais le décliner en échelle (50 → 950) ; neutres chauds, un accent secondaire (ambre ou teal) pour les états/CTA. Palette validée AA en clair **et** sombre.
- **Typographie** : Inter variable (titres 600/700, corps 400/500), échelle modulaire `clamp()` fluide, interlignage 1,5.
- **Rythme** : grille 8 px, conteneur 72 rem max, cartes à coins 12 px, ombres faibles, bordures 1 px plutôt qu'ombres lourdes.
- **Mouvement** : transitions 150–250 ms, View Transitions entre pages, désactivé si `prefers-reduced-motion`.

### 4.2 Structure des pages publiques

| Route | Contenu | Remplace |
|---|---|---|
| `/` | Hero (nom, titre, technos clés, CTA « Télécharger le CV » et « Me contacter »), résumé, **radar de compétences piloté par les données** (plus de 3 skills codées en dur), 3 dernières expériences, projets mis en avant | onglet Accueil + header plein écran + splash |
| `/competences` | **Grille filtrable de compétences** (recherche, filtres par tag/catégorie, tri par expertise/années), fiche latérale au clic (années, niveau, intérêt, éléments liés). Le nuage de mots devient une **option visuelle** rendue en SVG accessible, pas le mode principal | word cloud canvas + 3 `p-knob` |
| `/experiences`, `/formations` | **Timeline verticale** responsive, cartes dépliables (`<details>`), chips de tags cliquables → `/competences?tag=` | listes `app-item` |
| `/projets` | Grille de cartes (image optimisée `<picture>`/AVIF, technos), **dialog** de détail au clic | flip cards + fond plein écran |
| `/centres-d-interet` | Cartes simples | accordéon horizontal lettre-par-lettre |
| `/contact` + bloc en pied de page | Coordonnées (toujours assemblées côté client), liens Malt/GitHub/LinkedIn, partage natif (`navigator.share`) | panneau latéral fixe + overlay mobile |
| `/print` | CV A4 imprimable | pdfmake |

- **Navigation** : barre sticky avec liens réels (`routerLink`, `aria-current`), menu mobile en `<dialog>`; indicateur de section active ; bouton thème clair/sombre ; bouton « CV PDF ».
- **Pied de page** : copyright dynamique (année courante), lien discret `/admin`.
- **Accessibilité** : landmarks `header/nav/main/footer`, boutons réels pour toute action, focus visible, contrastes AA, `aria-labelledby` pointant sur des ids (plus de texte libre), tests axe dans Playwright.
- **Performance** : images en AVIF/WebP avec `NgOptimizedImage`, lazy loading, fonts auto-hébergées, zéro requête tierce au chargement.

### 4.3 Admin

- Layout PrimeNG : sidebar + `p-table` par ressource, formulaire en `p-drawer`/`p-dialog`, pick-list de tags, réordonnancement par drag-and-drop, prévisualisation « voir sur le site ».
- Toasts, confirmation de suppression, indicateurs de sauvegarde, gestion d'erreurs API typées (409 doublon, 400 validation champ par champ).
- Un seul composant `ResourceTable<T>` configuré par ressource (fin des 7 pages + table-wrapper de 954 lignes).

---

## 5. Roadmap par phases

Chaque phase laisse un site déployable. Estimations en jours-homme (j) pour un développeur senior seul, hors imprévus.

### Phase 0 — Stabilisation et sécurité d'urgence (5–7 j) — **à faire d'abord**

Front
- Regénérer le lockfile proprement : aligner `@ngrx/*` sur Angular 21 (ou retirer l'incompatibilité) pour que `npm ci` passe sans `--legacy-peer-deps`.
- Corriger les 30 tests rouges (location mock, `getThemeList`, sélecteur `#root7`, spies projects).
- Retirer les dépendances mortes (`jquery`, `hammerjs`, `wordcloud`, `jspdf`, `jasmine*`, `mocha*`, `ng2-mock-component` dupliqué, `@fortawesome/*`), `npm audit fix` sur Angular 21.2.x et pdfmake 0.3.11.
- `robots.txt` → autoriser l'indexation ; ajouter `robots.txt` et `sitemap.xml` aux assets ; retirer les scripts Firebase compat ; supprimer `.firebase/*.cache` du dépôt ; créer `environment.staging.ts` ou retirer la configuration.
- Scripts npm multiplateformes (`rimraf`/`shx`).

API (correctifs **temporaires** sur le code actuel, jetés en phase 2 lors du passage à `mongodb-dynamic-api` ; ils ferment les failles exploitables sans attendre)
- Regénérer le lockfile ; corriger les 5 erreurs de lint.
- **Hacher le mot de passe dans `updateUser`** et interdire `accessToken` dans `UserToUpdate`.
- **Refresh token** : secret distinct, expiration, vérification contre la valeur hachée en base, rotation.
- `@fastify/rate-limit` sur `/auth/*`, `@fastify/helmet`, CORS décorrélé de `SWAGGER_ENABLED`.
- `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` ; DTO de requête pour les `@Query()`.
- `.dockerignore` complet, `.env.example`, Dockerfile `node:22-alpine`.
- Retirer les données personnelles réelles des fixtures (front et back) au profit de données fictives.

Livrable : release `web 1.13.0` / `api 0.2.0`, CI verte, `npm audit --omit=dev` sans high/critical.

### Phase 1 — Fondations : monorepo, CI, contrats (4–6 j)

- Création du monorepo pnpm (`apps/web`, `apps/api`, `packages/contracts`, `packages/config`), import des historiques git (`git subtree`/`filter-repo`).
- `packages/contracts` : entités `mongodb-dynamic-api` (`BaseEntity` + `@Prop` + `class-validator`) des 7 ressources et de `User`, DTO de création/mise à jour, entrées séparées `api`/`web` (voir D1).
- GitHub Actions `ci.yml` (matrice web/api), caches pnpm, `audit`, artefacts de build.
- `release-please`, Conventional Commits, CHANGELOG migré vers GitHub.
- Dépréciation de CircleCI (fichier supprimé).

Livrable : un seul `pnpm install && pnpm test && pnpm build` vert ; PR preview Firebase.

### Phase 2 — Refonte backend sur `mongodb-dynamic-api` (7–9 j)

L'approche « générer plutôt qu'écrire » fait gagner 3 à 4 jours par rapport à un module générique maison. Le projet `apps/api` est **recréé à neuf** (NestJS 12, Express) plutôt que migré fichier par fichier : il ne restera presque rien du code actuel.

1. Squelette : `nest new`, `DynamicApiModule.forRoot(MONGODB_URI, { useAuth, ... })`, `@nestjs/config` + validation d'env, `DynamicApiHealthModule`, `nestjs-pino`, CORS, `main.ts` minimal (0,5 j).
2. **Entités** des 7 ressources + `User` dans `packages/contracts` (`BaseEntity`, `@Prop` typés, `class-validator`, `@ProtectedField`, `ref: 'Tag'`), scaffold via `nest g -c mongodb-dynamic-api resource` (1,5 j).
3. **`forFeature` × 7** : `version: '1'`, `isPublic` sur les lectures, `abilityPredicate` admin sur les écritures, `populate: 'tags'`, `cascade`/`beforeDeleteCallback` sur `Tag`, `disableCache` ou cache activé selon D7 ; route `Aggregate`/`customRoutes` pour « éléments liés à une compétence » (1,5 j).
4. **Auth** : `useAuth` complet (login par `name`, `additionalFields: ['role']`, refresh dédié avec rotation, `rateLimit` + `ThrottlerModule`, `/auth/register` fermé par `authAbilityPredicate`, cookie mode selon Q6), rotation des secrets (1 j).
5. **Script de migration** Atlas (dates, `tagIdList` → `ObjectId`, champ `id` legacy), test sur dump, rollback documenté (1,5 j).
6. **Tests e2e** avec `createDynamicApiTestingApp` + `supertest` : un fichier par ressource (lecture publique, écriture refusée sans token, CRUD admin, duplication, 404/400/409) + parcours auth (login, refresh, rotation, logout, replay refusé) ; tests unitaires des prédicats et callbacks (1 j).
7. Docker multi-stage, déploiement conteneur, mesure de la taille d'image, `npm audit` (0,5 j).

Livrable : `api 1.0.0`, Swagger généré par MDA (hors prod), contrats partagés consommés par le front, ancienne API maintenue en lecture seule jusqu'à la bascule du front (phase 3).

### Phase 3 — Refonte technique frontend (12–15 j)

1. Angular 22, builder `application`, `bootstrapApplication`, zoneless, suppression `polyfills.ts`/`@angular/animations`/`platformBrowserDynamic` (1,5 j).
2. Migration **standalone** (schematic) + `inject()` + `input()/output()` (schematics officiels) + `OnPush`/signals ; suppression des `detectChanges()` et des accès DOM directs (3 j).
3. **Routes** réelles pour les pages publiques, `/admin` lazy, `/print` ; suppression de `mat-tab-group`, du hash routing et du loader dynamique mobile (2 j).
4. **Suppression de NgRx** → SignalStore/`resource()` générique par ressource, partagé public/admin ; suppression `DataService`, effects, Subject statiques (3 j).
5. Couche HTTP unique typée par `packages/contracts`, interceptors fonctionnels (`withInterceptors`), refresh token avec file d'attente et protection anti-boucle, stockage du token en mémoire + refresh cookie `httpOnly` si l'API le permet (sinon `sessionStorage`), suppression de `EncryptionService` (1,5 j).
6. Nettoyage : Material, CDK, 42 thèmes, FontAwesome ×3, Google Fonts, `ThemingService`, `LoggerModule`, `utils.service` éclaté en fonctions pures (1 j).
7. Tests unitaires réécrits sur les stores, interceptors, guards, pipes (Vitest 5) (1 j).

Livrable : site fonctionnellement équivalent, bundle initial < 400 ko, 0 `any` nouveaux, `npm audit` propre.

### Phase 4 — Design system et nouvelles pages publiques (12–15 j)

1. Tokens CSS, thèmes clair/sombre, typographie Inter auto-hébergée, reset moderne, utilitaires limités (1,5 j).
2. Composants de base accessibles : nav, bouton, carte, chip, `<details>` accordéon, `<dialog>`, toast, timeline, skeleton (2,5 j).
3. Pages : accueil + radar data-driven (2 j), compétences grille filtrable + fiche (2,5 j), expériences/formations timeline (1,5 j), projets grille + dialog (1,5 j), intérêts + contact (1 j).
4. `/print` + CSS print, bouton PDF (1 j).
5. **Prerender** `@angular/ssr`, métadonnées SEO, JSON-LD, sitemap généré, PWA revue (1,5 j).
6. Audit a11y (axe, clavier, lecteur d'écran) et Lighthouse ≥ 95, correctifs (1 j).

Livrable : `web 2.0.0-beta` sur staging, revue visuelle, puis prod.

### Phase 5 — Admin v2 (6–8 j)

- PrimeNG 22 + preset Aura, layout admin, `ResourceTable<T>` générique (3 j).
- Formulaires construits depuis les DTO `class-validator` partagés (Signal Forms ou Reactive typés), pick-list tags, réordonnancement, duplication via `DuplicateOne`, upload d'images projets (si souhaité : Firebase Storage ou champ URL) (2,5 j).
- Gestion de session (expiration, refresh silencieux, déconnexion), toasts d'erreurs typées (1 j).

### Phase 6 — Qualité, observabilité, documentation (4–5 j)

- Playwright : 8 parcours (accueil, filtre compétences, timeline, projet dialog, print, login admin, CRUD skill, déconnexion) + axe (2 j).
- Lighthouse CI avec budgets, `size-limit` sur le bundle, Dependabot/Renovate groupé mensuel (1 j).
- README par app (démarrage, variables, déploiement), ADR courts pour D1–D7, runbook (rotation secrets, restauration Atlas) (1 j).
- Nettoyage final : SonarCloud reconfiguré sur le monorepo ou supprimé (0,5 j).

**Total : 50 à 65 j.** Les phases 2 et 3 sont parallélisables si deux personnes ; sinon ordre 0 → 1 → 2 → 3 → 4 → 5 → 6.

---

## 6. Matrice de migration des dépendances

### Frontend

| Paquet | Actuel | Cible | Action |
|---|---|---|---|
| `@angular/*` | 21.2.1 | 22.x (dernier stable au démarrage) | `ng update`, builder `application` |
| `@angular/material`, `@angular/cdk` | 21.2.1 | — | **Supprimer** (D4) |
| `@angular/animations` | 21.2.1 | — | Supprimer (déprécié) → CSS |
| `@angular/platform-browser-dynamic` | 21.2.1 | — | Supprimer → `platformBrowser` |
| `zone.js` | 0.15 | — | Supprimer (zoneless) |
| `@ngrx/store|effects|entity|store-devtools` | 19.2.1 | — | Supprimer → `@ngrx/signals@22` ou signals natifs |
| `@ngx-translate/core` / `http-loader` | 15 / 8 | 18 / 18 | Mettre à jour, API standalone |
| `primeng` / `primeicons` | 21.1.3 / 6.0.1 | 22.x / 8.x | Admin seulement, `providePrimeNG` + `@primeuix/themes` |
| `@fortawesome/*` | 4.0 / 6.4 | — | Supprimer → `@ng-icons/lucide` ou sprite SVG |
| `chart.js` | 4.3 | 4.5 | Garder (radar), import tree-shaké |
| `wordcloud` + `assets/js/wordcloud2.js` | 1.2 | — | Supprimer → grille SVG ; option d3-cloud lazy |
| `hammerjs`, `jquery`, `jspdf`, `ng2-mock-component`, `jasmine-core`, `@types/jasmine`, `mocha*`, `mochawesome*`, `cypress-*-reporter`, `junit-report-merger`, `ts-node` | — | — | **Supprimer** |
| `pdfmake` | 0.3.5 (SSRF) | 0.3.11 lazy, ou — | Phase 0 : mise à jour ; phase 4 : `/print` |
| `tweetnacl` | 1.0.3 | — | Supprimer (obfuscation inutile) |
| `dayjs` | 1.11 | 1.11 ou `Intl`/`Temporal` | Décision phase 3 |
| `cypress` | 13 (cassé) | — | **Remplacer par `@playwright/test`** |
| `firebase-tools` | 11 (vm2 critical) | hors package (action GitHub) | Supprimer des devDeps |
| `standard-version` | 9 (déprécié) | `release-please` | Remplacer |
| `vitest`, `@analogjs/*`, `vite` | 4 / 2.3 / 7 | 5 / 2.8 / 8 | Mettre à jour |
| `eslint`, `@angular-eslint/*`, `typescript-eslint` | 9 / 21 / 8.56 | 10 / 22 / 8.7x | Mettre à jour, config partagée |
| `typescript` | 5.9 | version max supportée par Angular 22 | Suivre `ng update` |
| `@types/node` | 20 | 22 | Aligner sur Node LTS |

### Backend

| Paquet | Actuel | Cible | Action |
|---|---|---|---|
| **`mongodb-dynamic-api`** | — | **6.2.x** | **Ajouter** : fournit CRUD, auth, validation, Swagger, health, cache, testing |
| `@nestjs/common|core` | 11.1.16 | 12.x | Aligner sur la version exigée par MDA |
| `@nestjs/platform-fastify`, `@fastify/basic-auth|cors|static` | 11 / 6 / 11 / 9 | — | **Supprimer** → `@nestjs/platform-express` (embarqué par MDA), `cors` natif Nest, `helmet` (Q10) |
| `@nestjs/mongoose|jwt|passport|swagger`, `mongoose`, `passport*`, `class-validator`, `class-transformer`, `bcrypt`, `mongodb-pipeline-builder`, `dotenv` | divers | fournis par MDA | **Retirer des dépendances directes** (MDA les embarque : mongoose 8.9+, class-validator 0.14, pipeline-builder 4) ; ne garder en direct que ce qui est importé dans le code applicatif |
| `moment-timezone` | 0.6 | — | Supprimer → `Intl`/`Date` (timestamps gérés par `BaseEntity`) |
| `nanoid` | 3 | — | Supprimer (`id` fourni par `BaseEntity`) |
| `uuidv4`, `rimraf` (runtime), `heroku-client`, `tslint-class-validator-rule`, `@types/heroku-client` | — | — | **Supprimer** |
| ajouts | — | `@nestjs/config`, `@nestjs/throttler` (requis par `rateLimit` de MDA), `nestjs-pino`, `mongodb-memory-server` (dev, pour `mongodb-dynamic-api/testing`), `supertest` (déjà présent) | Phase 2 |
| `jest` / `ts-jest` | 30 / 29 | Vitest 5 (monorepo) ou jest 30 + `@swc/jest` | Décision phase 1 ; vérifier la compatibilité de `createDynamicApiTestingApp` avec le runner choisi |
| `@compodoc/compodoc` | 1.2 | — | Supprimer (Swagger MDA suffit) |

---

## 7. Décisions à valider (questions ouvertes)

| # | Question | Options | Recommandation |
|---|---|---|---|
| Q1 | Monorepo ? | (a) monorepo pnpm, (b) deux repos + package de contrats publié | **(a)** |
| Q2 | Hébergement API | (a) rester Heroku (Docker), (b) Render/Fly.io/Railway, (c) Google Cloud Run (même écosystème que Firebase) | **(a)** en phase 2 pour limiter le risque, (c) à évaluer ensuite pour le coût |
| Q3 | Langue | FR seul, ou FR + EN | FR seul au départ, structure prête pour EN (contenu API multilingue = champ `{fr,en}` à prévoir dans les schémas si oui) |
| Q4 | Nuage de mots | garder comme mode principal / option visuelle / supprimer | **Option visuelle** (SVG accessible), grille filtrable par défaut |
| Q5 | PDF | `/print` navigateur / pdfmake lazy / génération serveur (Playwright sur l'API) | **`/print`** ; pdfmake lazy en secours |
| Q6 | Refresh token côté client | cookie `httpOnly` (nécessite même domaine ou CORS credentials) / `sessionStorage` | cookie si l'API passe sous un sous-domaine `api.` du site ; sinon `sessionStorage` |
| Q7 | Admin : upload d'images projets | URL externe / Firebase Storage / GridFS | Firebase Storage (déjà dans l'écosystème) ou URL simple |
| Q8 | Garder SonarCloud ? | oui / non | Optionnel ; Lighthouse CI + couverture Vitest suffisent pour un projet perso |
| Q9 | Données réelles dans les fixtures | anonymiser | **Oui**, dès la phase 0 |
| Q10 | Plateforme HTTP de l'API avec `mongodb-dynamic-api` | (a) Express (défaut de MDA), (b) Fastify si MDA le supporte | **(a)** sauf si vous confirmez un support Fastify testé dans MDA |
| Q11 | Cache HTTP MDA sur les lectures publiques | activer (mémoire) / désactiver / Redis | Activer en mémoire (une seule instance Heroku) ; Redis inutile à cette échelle |
| Q12 | Identifiants exposés au front | garder `id` nanoid legacy / passer à l'`id` de `BaseEntity` | Passer à `BaseEntity.id`, conserver l'ancien en `legacyId` pendant une release pour les liens externes éventuels |

---

## 8. Risques et parades

| Risque | Impact | Parade |
|---|---|---|
| Migration des données Atlas (dates string → Date, tags) | Perte/corruption | Script idempotent testé sur un dump, sauvegarde Atlas avant, double lecture tolérante pendant une release |
| Zoneless : composants tiers non compatibles | Rendu figé | Admin PrimeNG 22 est compatible signals ; public sans lib ; tests de rendu Playwright |
| Prerender avec données API au build | Build cassé si API down | Fallback : prerender depuis un snapshot JSON commité, ou CSR si fetch échoue |
| Disponibilité Heroku / coût | Site sans données | Vérifier avant phase 0 ; conteneuriser pour pouvoir changer d'hébergeur en phase 2 |
| Effort sous-estimé sur la refonte visuelle | Dérive | Maquettes rapides (Figma ou HTML statique) validées avant la phase 4 ; livrer page par page |
| Monorepo : perte d'historique git | Traçabilité | `git subtree add` conserve l'historique ; tags migrés |
| Secrets : `JWT_SECRET_KEY` partagé access/refresh | Compromission | Rotation des deux secrets à la mise en prod de l'auth v2 ; déconnexion forcée de l'admin |
| Dépendance forte à `mongodb-dynamic-api` (lib maison) | Un bug ou un besoin non couvert bloque l'API | Vous en êtes l'auteur : les correctifs se font dans la lib et profitent aux deux projets ; `customRoutes` et `extraProviders` couvrent les cas hors CRUD ; `@Public()`/`abilityPredicate` testés en e2e |
| Majeure MDA v7 annoncée (`multiSession: true` par défaut) | Changement de comportement du refresh | Fixer `multiSession` explicitement dans la config dès la v6 |
| Express au lieu de Fastify | Perte de débit théorique | Non significatif pour un CV ; prerender côté front absorbe l'essentiel du trafic public |

---

## 9. Définition de « terminé » (KPIs)

- `pnpm install` (ou `npm ci`) **sans flag**, `lint`, `typecheck`, `test`, `build`, `e2e` verts en CI sur Node 22.
- `npm audit --omit=dev` : 0 high/critical sur les deux apps.
- Front : bundle initial public **< 300 ko** gzip, Lighthouse mobile ≥ 95 (perf, a11y, bonnes pratiques, SEO), 0 requête tierce au premier rendu, dark mode, WCAG AA vérifié par axe (0 violation sérieuse).
- Back : `strict: true`, 0 `any` explicite, couverture ≥ 70 % sur le code applicatif (entités, prédicats, callbacks, routes custom), e2e `createDynamicApiTestingApp` sur 100 % des routes exposées, `/health` OK, image Docker < 250 Mo (MDA embarque socket.io/ioredis), utilisateur non-root.
- Sécurité : refresh token dédié avec rotation, mots de passe toujours hachés, rate-limit actif, CORS strict, Swagger protégé/désactivé en prod.
- Doc : README à jour par app, `.env.example`, ADR pour D1–D7, CHANGELOG généré.

---

## 10. Prochaines étapes immédiates

1. Valider les décisions D1–D7 et répondre aux questions Q1–Q12 (§7), en particulier Q10 (Express vs Fastify avec MDA).
2. Vérifier l'état réel de la prod (site Firebase, API Heroku, Atlas) et faire une **sauvegarde Atlas**.
3. Démarrer la phase 0 sur les branches de travail actuelles : correctifs de sécurité API d'abord, puis lockfiles et tests front.
4. Préparer les maquettes des 6 pages publiques (une journée) pour dérisquer la phase 4.

---

### Annexe A — Commandes de la baseline

```bash
# Frontend (clone propre)
npm ci                                  # ERESOLVE @ngrx/effects@19 vs @angular/core@21
CYPRESS_INSTALL_BINARY=0 npm install --legacy-peer-deps
npx vitest run --config vitest.config.mts   # 30 failed / 218
npx ng lint                              # OK
npx ng build --configuration production  # 1.12 MB initial, budget dépassé
npm audit --omit=dev                     # 6 high, 4 moderate

# Backend (clone propre)
npm ci                                  # lockfile désynchronisé
npm install && npx nest build            # OK
npx eslint "src/**/*.ts" --max-warnings=0   # 5 erreurs, 87 warnings
npx jest                                 # 51 passed / 35 suites
npm audit --omit=dev                     # 12 high, 7 moderate
```

### Annexe B — Fichiers de référence cités

Front : `src/main.ts`, `src/app/app.module.ts`, `src/app/modules/application/components/fragments/main/main.component.ts`, `src/app/core/ngrx/*`, `src/app/core/services/encryption/encryption.service.ts`, `src/app/core/services/theming/theming.service.ts`, `src/app/core/services/pdf-creator/*`, `src/app/modules/admin/components/fragments/table-wrapper/table-wrapper.component.ts`, `src/index.html`, `src/robots.txt`, `angular.json`, `.circleci/config.yml`, `cypress.json`.

Back : `src/main.ts`, `src/config/environment.ts`, `src/modules/v1/v1.service.ts`, `src/modules/v1/*/controllers/*.controller.ts`, `src/modules/users/services/users.service.ts`, `src/modules/authorization/services/refresh-token-strategy/refresh-token-strategy.service.ts`, `src/core/guards/roles/roles.guard.ts`, `Dockerfile`, `.dockerignore`, `.circleci/config.yml`.
