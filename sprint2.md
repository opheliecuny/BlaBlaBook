# Sprint 2 — Plan de finition BlaBlaBook

> **Date de rédaction** : 2026-03-22
> **Dernière mise à jour** : 2026-03-29
> **Phase** : Sprint 2 — Intégration, Tests, CI/CD, Déploiement
> **Statut global** : MVP ✅ DÉPLOYÉ EN PRODUCTION, tests backend ✅ (73 tests, 91% coverage), CI/CD ✅ CONFIGURÉ, déploiement ✅ NEON + RENDER (backend + frontend)

---

## 1. État des lieux

### 1.1 Ce qui est fait ✅

| Domaine                   | Détail                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Backend — API REST**    | Toutes les routes `/auth`, `/books`, `/library`, `/user` implémentées et fonctionnelles                          |
| **Backend — Sécurité**    | Argon2, JWT + cookies httpOnly, Helmet, XSS Sanitizer, CORS, validation Zod, rate limiting (global/auth/search)  |
| **Backend — BDD**         | Schéma Prisma complet (4 tables), migrations, seed                                                               |
| **Backend — Tests**       | 73 tests Vitest (33 unitaires + 40 intégration), 91% coverage, CI-ready                                          |
| **Backend — Monitoring**  | Endpoint `GET /health` (test Neon + uptime), exempt du rate limiting, Render Health Check configuré              |
| **CI/CD**                 | GitHub Actions : 5 jobs CI (`ci.yml`) + deploy hooks Render (`deploy.yml`)                                       |
| **Frontend — Auth**       | Inscription, connexion, déconnexion, AuthContext, cookies httpOnly, distinction erreur réseau vs 401             |
| **Frontend — Pages**      | `/`, `/login`, `/register`, `/search`, `/book/:id`, `/library`, `/profile`, `/legal`, `/privacy`, `/cgu`, `/404` |
| **Frontend — API**        | `lib/api.ts`, services auth/book/library/user câblés sur l'API réelle                                            |
| **Frontend — Responsive** | Toutes les pages responsive (mobile + desktop)                                                                   |
| **Frontend — UX**         | Alert dialog suppression livre, feedback erreur "+ Biblio", indicateur force mdp, pagination server-side         |
| **Frontend — A11y**       | Audit accessibilité et sémantique complet sur toutes les pages                                                   |
| **Déploiement**           | Neon (PostgreSQL 17, EU) + Render backend + Render frontend — application en production                          |
| **Monitoring**            | UptimeRobot (2 monitors : API `/health` + Frontend `/`) — keep-alive free tier                                   |
| **Docker**                | `docker-compose.yml` avec db, adminer, api, frontend                                                             |
| **Doc**                   | Cahier des charges, guide Git, guide déploiement complet (Render + Neon + UptimeRobot)                           |

### 1.2 Ce qui reste à faire 🚧

#### Fonctionnel manquant (hors MVP déployé)

| Priorité  | Tâche                                                                                           | Fichier(s) concerné(s)                      |
| --------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 🟠 Moyenne | **Notation (1–5 étoiles)** : UI manquante sur `/library` + `PATCH /library/:id` à enrichir      | `library/page.tsx`, `library.controller.ts` |
| 🟠 Moyenne | **Avis personnel** : UI manquante sur `/library`                                                | `library/page.tsx`                          |
| 🟠 Moyenne | **Refresh token** : Logique de renouvellement absente (token stocké en BDD mais jamais utilisé) | `auth.controller.ts`, `auth.router.ts`      |
| 🟡 Basse   | **Toast notifications** : Remplacer alertes par composant toast shadcn/ui                       | Toutes les pages avec formulaires           |

#### Complété cette semaine ✅

**23/03/2026 :**

- ✅ **Suppression de compte** : Route backend `DELETE /user` implémentée (#91)
- ✅ **Récupération profil** : Route backend `GET /user/profile` ajoutée (#92)
- ✅ **Tests backend** : premiers tests unitaires auth middleware + token (#90, #93, #95)
- ✅ **CI GitHub Actions** : mise en place lint + build (#86), corrections TypeScript (#87, #88, #89)

**24/03/2026 :**

- ✅ **Tests backend COMPLÉTÉS** : 73 tests (33 unitaires + 40 intégration) — 100% succès (#103)
- ✅ **Couverture optimale** : 91% statements, 87% branches, 100% functions, 93% lines
- ✅ **asyncWrapper unifié** : tous controllers (auth, library, user)
- ✅ **Gestion erreurs standardisée** : Zod → VALIDATION_ERROR, Prisma → NOT_FOUND
- ✅ **CI/CD GitHub Actions** : 5 jobs (lint-backend, test-backend, build-backend, lint-frontend, build-frontend)
- ✅ **Page profil câblée** : `GET /user/profile` + `PATCH /user/profile` connectés au frontend (#97)
- ✅ **Responsive** : header/footer, book:id, search, library, CGU (#99, #106, #108)

**25/03/2026 :**

- ✅ **Déploiement Neon** : base PostgreSQL 17 créée et migrée (région EU)
- ✅ **Déploiement backend Render** : API Express déployée sans Docker (tsx), migrations auto au démarrage
- ✅ **Tests frontend** : Vitest + jsdom, 38 tests (Christopher, #118)
- ✅ **Pagination server-side** : recherche optimisée avec cache 60s, cap 50 pages (#121)
- ✅ **Page 404** : page personnalisée ajoutée (#125)
- ✅ **Responsive final** : homepage, header safe area mobile (#123, #124)

**26/03/2026 :**

- ✅ **Déploiement frontend Render** : migration Vercel → Render (Vercel nécessite plan payant pour orgs privées)
- ✅ **Fix API_URL** : variable `API_URL` ajoutée pour Server Components (cause de l'absence d'appels OpenLibrary)
- ✅ **Workflow deploy.yml** : déploiement continu avec deploy hooks Render backend + frontend (#143)
- ✅ **Audit accessibilité** : sémantique et a11y sur toutes les pages (Ophélie)
- ✅ **Harmonisation erreurs backend** : `AppError` dans tous les controllers + tests mis à jour
- ✅ **Cohérence visuelle** : couleurs, padding, hover, active harmonisés (#133)
- ✅ **Fixes tests** : `bookService.test.ts` pagination (#130)

**27/03/2026 :**

- ✅ **Rate limiting** : `express-rate-limit` global (100 req/15min) + auth (10 req/15min) + search (30 req/min) (#140)
- ✅ **Sécurité cookies** : fix logout (`secure`/`sameSite`/`path`), username register, vérification `currentPassword` (#136, #137, #139)
- ✅ **UX** : feedback visuel "+ Biblio", distinction erreur réseau vs 401, indicateur force mdp, genres tronqués (#138, #141)
- ✅ **Guide déploiement refondu** : 12 sections mises à jour (architecture, CORS, variables, CI/CD, troubleshooting) (#144)

**28/03/2026 :**

- ✅ **Endpoint `/health`** : test connexion Neon via `prisma.$queryRaw`, exempt du rate limiting (#153, #154)
- ✅ **Render Health Check** : path `/health` configuré — redémarrage automatique si service down
- ✅ **UptimeRobot** : 2 monitors (API `/health` + Frontend `/`) — keep-alive free tier

#### Fonctionnel non-MVP (à exclure du sprint actuel)

- Filtres de recherche avancés (genre, date, note)
- Interactions sociales (avis publics, suivi)
- Recommandations personnalisées

---

## 2. Tests avec Vitest

### 2.1 Pourquoi Vitest ?

Le backend utilise actuellement `tsx --test` (Node.js test runner natif). Vitest offre :

- Une API compatible Jest (facile à apprendre)
- Un support natif ESM et TypeScript sans configuration lourde
- Une intégration naturelle avec le stack Node/Express existant
- Un mode watch rapide en développement

### 2.2 Installation — Backend

```bash
cd blablabook/backend
npm install -D vitest @vitest/coverage-v8 supertest @types/supertest
```

Modifier `package.json` :

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:unit": "vitest run --testPathPattern=unit",
    "test:spec": "vitest run --testPathPattern=spec",
    "test:coverage": "vitest run --coverage"
  }
}
```

Ajouter `vitest.config.ts` à la racine du backend :

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.{unit,spec}.test.ts', 'src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/@types/**', 'src/models/**'],
    },
  },
});
```

### 2.3 Tests à écrire — Backend

#### Tests unitaires — ✅ FAIT (33 tests)

**✅ `tests/unit/utils/token.test.ts`** — 8 tests
- ✅ generateAuthenticationTokens() génère accessToken JWT valide
- ✅ generateAuthenticationTokens() génère refreshToken base64 unique
- ✅ saveRefreshTokenInDatabase() crée en BDD
- ✅ setAccessTokenCookie() définit cookie httpOnly
- ✅ setRefreshTokenCookie() définit cookie httpOnly avec path restreint
- ✅ replaceRefreshTokenInDatabase() supprime anciens + crée nouveau

**✅ `tests/unit/middlewares/auth.middleware.test.ts`** — 5 tests
- ✅ Retourne 401 si aucun cookie accessToken
- ✅ Retourne 401 si token invalide
- ✅ Retourne 401 si token expiré
- ✅ Appelle next() et injecte req.user si token valide
- ✅ Gère correctement payload avec champs supplémentaires

**✅ `tests/unit/errors/errors.test.ts`** — 20 tests
- ✅ Classes d'erreurs (AppError, NotFoundError, BadRequestError, etc.) — 9 tests
- ✅ transformError (Zod, Prisma P2002/P2025, erreurs inconnues) — 7 tests
- ✅ asyncWrapper capture erreurs async et appelle next() — 4 tests

#### Tests d'intégration — ✅ COMPLÉTÉS (40 tests)

**Prérequis** : ✅ `.env.test` créé, base `blablabook_test` configurée, migrations appliquées

**✅ `tests/integration/api/auth.test.ts`** — 12 tests
- ✅ POST /auth/register (6 tests) : success, email existant, validations password, confirm, email
- ✅ POST /auth/login (4 tests) : success, user inexistant, mauvais password, email manquant
- ✅ POST /auth/logout (2 tests) : success + suppression tokens BDD, 401 si non auth

- ✅ POST /auth/register (6 tests) : success, email existant, validations password, confirm, email
- ✅ POST /auth/login (4 tests) : success, user inexistant, mauvais password, email manquant
- ✅ POST /auth/logout (2 tests) : success + suppression tokens BDD, 401 si non auth

**✅ `tests/integration/api/library.test.ts`** — 16 tests

- ✅ GET /library (3 tests) : liste vide, livres utilisateur, 401 sans token
- ✅ POST /library (7 tests) : ajout success, statut défaut TO_READ, validations (titre, isbn), doublon 409, 401
- ✅ PATCH /library/:id (4 tests) : update statut, validation statut invalide, 404 livre inexistant, 401
- ✅ DELETE /library/:id (3 tests) : suppression, 404 inexistant, 401

**✅ `tests/integration/api/user.test.ts`** — 12 tests

- ✅ GET /user/profile (2 tests) : récupération profil, 401 sans token
- ✅ PATCH /user/profile (7 tests) : update username/email/password (hashé), email déjà utilisé, validations password, 401
- ✅ DELETE /user (3 tests) : suppression compte + refresh tokens, cascade library_items, 401

#### Organisation des fichiers de test — ✅ COMPLÉTÉE

```plaintext
backend/
└── tests/
    ├── setup.ts                        # ✅ Configuration globale (.env.test)
    ├── helpers/                        # ✅ CRÉÉ
    │   ├── testServer.ts               # ✅ Serveur Express de test + export app
    │   └── dbHelpers.ts                # ✅ cleanDatabase, createTestUser
    ├── unit/                           # ✅ CRÉÉ - 33 tests
    │   ├── utils/
    │   │   └── token.test.ts           # ✅ 8 tests
    │   ├── middlewares/
    │   │   └── auth.middleware.test.ts # ✅ 5 tests
    │   └── errors/
    │       └── errors.test.ts          # ✅ 20 tests
    ├── integration/                    # ✅ CRÉÉ - 40 tests
    │   └── api/
    │       ├── auth.test.ts            # ✅ 12 tests
    │       ├── library.test.ts         # ✅ 16 tests
    │       └── user.test.ts            # ✅ 12 tests
    ├── auth.http                       # Tests manuels (existants)
    ├── book.http
    ├── library.http
    └── user.http
```

**📊 Couverture finale : 73 tests (33 unitaires + 40 intégration) — 91% statements, 87% branches**

### 2.4 Installation — Frontend (optionnel pour le sprint)

```bash
cd blablabook/frontend
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event jsdom
```

Les tests frontend sont de moindre priorité pour ce sprint. Privilégier les tests backend.

---

## 3. GitHub Actions — CI/CD

### 3.1 Structure à créer

```plaintext
.github/
└── workflows/
    ├── ci.yml         # Lint + Tests (sur chaque PR vers main)
    └── deploy.yml     # Déploiement (sur merge dans main) — voir section 4
```

### 3.2 Workflow CI (`.github/workflows/ci.yml`) — ✅ IMPLÉMENTÉ

> **Important** : Les tests d'intégration backend nécessitent une base PostgreSQL.
> GitHub Actions fournit un service PostgreSQL 17 dans un conteneur Docker.

Le workflow CI est organisé en **5 jobs indépendants** :

1. **lint-backend** — Vérification ESLint du backend
2. **test-backend** — 73 tests Vitest avec PostgreSQL service + couverture
3. **build-backend** — Compilation TypeScript (dépend de lint + test)
4. **lint-frontend** — Vérification ESLint du frontend
5. **build-frontend** — Build Next.js (dépend de lint)

**Caractéristiques clés :**
- ✅ Node.js 22
- ✅ Cache npm pour accélérer les builds
- ✅ Service PostgreSQL 17 avec health checks
- ✅ Prisma migrations + generation automatiques
- ✅ Upload optionnel des rapports de couverture vers Codecov
- ✅ Variables d'environnement de test (JWT_SECRET, DATABASE_URL)

Voir [`.github/workflows/ci.yml`](.github/workflows/ci.yml) pour l'implémentation complète.

### 3.3 Protections de branche à activer sur GitHub

Aller dans **Settings → Branches → Add rule** pour `main` :

| Paramètre                           | Valeur                                                            |
| ----------------------------------- | ----------------------------------------------------------------- |
| Require pull request before merging | ✅                                                                 |
| Required approvals                  | 1                                                                 |
| Require status checks to pass       | ✅                                                                 |
| Status checks requis                | `lint-backend`, `lint-frontend`, `test-backend`, `build-frontend` |
| Require branches to be up to date   | ✅                                                                 |
| Do not allow bypassing              | ✅                                                                 |

---

## 4. Déploiement ✅ EN PRODUCTION

### 4.1 Architecture déployée

| Composant           | Service                                | URL                                          |
| ------------------- | -------------------------------------- | -------------------------------------------- |
| **Base de données** | [Neon](https://neon.tech)              | PostgreSQL 17, région EU Central (Frankfurt) |
| **Backend**         | [Render](https://render.com)           | `https://blablabook-api.onrender.com`        |
| **Frontend**        | [Render](https://render.com)           | `https://blablabook-front.onrender.com`      |
| **Monitoring**      | [UptimeRobot](https://uptimerobot.com) | 2 monitors — keep-alive free tier            |

> **Note** : Vercel initialement prévu pour le frontend, abandonné car nécessite plan payant pour les dépôts d'organisation privés.

### 4.2 Variables d'environnement en production

**Backend (Render)**

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<URL_Neon>
JWT_SECRET=<clé_aléatoire_forte_256_bits>
ALLOWED_ORIGINS=https://blablabook-front.onrender.com
```

**Frontend (Render)**

```env
NEXT_PUBLIC_API_URL=https://blablabook-api.onrender.com   # Client Components (navigateur)
API_URL=https://blablabook-api.onrender.com               # Server Components (SSR)
NODE_ENV=production
```

> **Important** : deux variables URL sont nécessaires — `NEXT_PUBLIC_API_URL` est baked dans le bundle navigateur, `API_URL` est disponible uniquement côté serveur (Server Components comme `/search/page.tsx`).

### 4.3 Configuration Render

**Backend** :

- Root Directory : `blablabook/backend`
- Build Command : `npm install && npx prisma generate`
- Start Command : `npx prisma migrate deploy && npx tsx index.ts`
- Health Check Path : `/health`

**Frontend** :

- Root Directory : `blablabook/frontend`
- Build Command : `npm install && npm run build`
- Start Command : `npm run start`

### 4.4 Workflow de déploiement automatique (`.github/workflows/deploy.yml`) ✅

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy-backend:
    name: Deploy Backend (Render)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trigger Render Deploy Hook (Backend)
        run: curl -X POST ${{ secrets.RENDER_BACKEND_DEPLOY_HOOK }}

  deploy-frontend:
    name: Deploy Frontend (Render)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trigger Render Deploy Hook (Frontend)
        run: curl -X POST ${{ secrets.RENDER_FRONTEND_DEPLOY_HOOK }}
```

**Secrets GitHub configurés** (Settings → Secrets and variables → Actions) :

- `RENDER_BACKEND_DEPLOY_HOOK` — Deploy hook Render backend
- `RENDER_FRONTEND_DEPLOY_HOOK` — Deploy hook Render frontend

---

## 5. Backlog priorisé — Tâches par ordre d’importance

### ✅ Priorité 1 — Compléter le MVP — ✅ COMPLÉTÉ

- [x] ✅ **Profile page** : `GET /user/profile` + `PATCH /user/profile` câblés (Ophélie, 24/03 — #97)
- [x] ✅ **Route DELETE /user** : route de suppression de compte (Paul, 23/03 — #91)
- [x] ✅ **Route GET /user/profile** : route de récupération du profil (Paul, 23/03 — #92)
- [x] ✅ **Confirmation suppression livre** : alert dialog shadcn/ui (Ophélie, 26/03)
- [x] ✅ **Feedback visuel "+ Biblio"** : message d’erreur si ajout échoue (Christopher, 27/03 — #138)
- [ ] **Notes et avis** : UI étoiles + zone de texte dans `/library` — reporté sprint 3

### ✅ Priorité 2 — Tests backend avec Vitest — ✅ COMPLÉTÉ (24/03/2026)

- [x] ✅ Installer Vitest + supertest + @vitest/coverage-v8 + @vitest/ui
- [x] ✅ Créer `vitest.config.ts` (fileParallelism: false, seuils adaptés, path aliases)
- [x] ✅ Créer `.env.test` et configurer base de données de test (testdb)
- [x] ✅ Créer `tests/setup.ts` (injection .env.test)
- [x] ✅ Créer `tests/helpers/testServer.ts` et `dbHelpers.ts`
- [x] ✅ Écrire `tests/integration/api/auth.test.ts` — 12 tests
- [x] ✅ Écrire `tests/integration/api/library.test.ts` — 16 tests
- [x] ✅ Écrire `tests/integration/api/user.test.ts` — 12 tests
- [x] ✅ Écrire `tests/unit/utils/token.test.ts` — 8 tests
- [x] ✅ Écrire `tests/unit/middlewares/auth.middleware.test.ts` — 5 tests
- [x] ✅ Écrire `tests/unit/errors/errors.test.ts` — 20 tests
- [x] ✅ Configurer tsconfig.json (path aliases @, @tests)
- [x] ✅ Unifier asyncWrapper sur tous les controllers
- [x] ✅ Atteindre 91% coverage (dépasse largement l’objectif 70%)

### ✅ Priorité 3 — GitHub Actions CI — ✅ COMPLÉTÉ (24/03/2026)

- [x] ✅ Créer `.github/workflows/ci.yml` (5 jobs: lint-backend, test-backend, build-backend, lint-frontend, build-frontend)
- [x] ⚠️ Protection de branche `main` — **NON APPLICABLE** (désactivée par l’organisation école)
- [x] ✅ Checks CI visibles sur les PRs

### ✅ Priorité 4 — Déploiement — ✅ COMPLÉTÉ (25–26/03/2026)

- [x] ✅ Créer la base de données sur Neon (PostgreSQL 17, EU Central)
- [x] ✅ Déployer le backend sur Render (tsx, sans Docker)
- [x] ✅ Déployer le frontend sur Render (Vercel abandonné — plan payant requis pour orgs privées)
- [x] ✅ Configurer les variables d’environnement production (backend + frontend)
- [x] ✅ Appliquer les migrations (`prisma migrate deploy` au démarrage)
- [x] ✅ Tester le flux complet en prod (register → login → search → add book → logout)
- [x] ✅ Créer `.github/workflows/deploy.yml` (deploy hooks Render backend + frontend)
- [x] ✅ Ajouter les secrets GitHub (`RENDER_BACKEND_DEPLOY_HOOK`, `RENDER_FRONTEND_DEPLOY_HOOK`)
- [x] ✅ Configurer Render Health Check path `/health`
- [x] ✅ Configurer UptimeRobot — 2 monitors (keep-alive free tier)

### 🟢 Priorité 5 — Améliorations qualité (nice-to-have)

- [ ] **Refresh token** : Ajouter `POST /auth/refresh` pour renouveler le token sans re-login
- [x] ✅ **Rate limiting** : `express-rate-limit` global + auth + search (Christopher, 27/03 — #140)
- [ ] **Toast notifications** : Remplacer les alertes par composant toast (shadcn/ui Toaster)
- [ ] **Logger** : Ajouter Winston ou Pino pour les logs structurés en prod
- [ ] **Cache OpenLibrary** : Mettre en cache les réponses de l’API externe (node-cache ou Redis)
- [x] ✅ **Tests frontend** : Vitest + jsdom, 38 tests (Christopher, 25/03 — #118)
- [x] ✅ **Endpoint `/health`** : monitoring Render + UptimeRobot + test connexion Neon (Paul, 27-28/03)

---

## 6. Référence rapide — Commandes utiles

```bash
# Backend — Tests
cd blablabook/backend
npm test                    # Tous les tests
npm run test:unit           # Tests unitaires uniquement
npm run test:spec           # Tests d'intégration uniquement
npm run test:coverage       # Rapport de couverture

# Backend — Base de données de test (local)
DATABASE_URL="postgresql://test:test@localhost:5433/blablabook_test" npm run db:migrate:deploy

# Docker — Démarrage complet local
cd blablabook
docker compose up -d        # Démarrer tous les services
docker compose logs -f api  # Suivre les logs du backend
docker compose down -v      # Arrêter et supprimer les volumes

# CI — Tester localement avant push
cd blablabook/backend && npm run lint && npm test
cd blablabook/frontend && npm run lint && npm run build
```

---

## 7. Personnes responsables (suggestion)

| Tâche                                   | Assigné(e)                     |
| --------------------------------------- | ------------------------------ |
| MVP — Profile page + suppression compte | Ophélie (Lead Frontend) + Rémi |
| MVP — Notes & avis UI                   | Ophélie + Rémi                 |
| Tests backend Vitest                    | Paul + Christopher             |
| GitHub Actions CI                       | Paul + Christopher             |
| Déploiement prod                        | Paul + Christopher             |

---

*Document généré le 2026-03-22 — à mettre à jour au fil de l'avancement du sprint.*
