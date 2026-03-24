# Sprint 2 — Plan de finition BlaBlaBook

> **Date de rédaction** : 2026-03-22
> **Dernière mise à jour** : 2026-03-24
> **Phase** : Sprint 2 — Intégration, Tests, CI/CD, Déploiement
> **Statut global** : MVP fonctionnel à ~85%, tests backend ✅ COMPLÉTÉS (73 tests, 91% coverage), CI/CD ✅ CONFIGURÉ, déploiement non configuré

---

## 1. État des lieux

### 1.1 Ce qui est fait ✅

| Domaine                | Détail                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| **Backend — API REST** | Toutes les routes `/auth`, `/books`, `/library`, `/user` sont implémentées et fonctionnelles |
| **Backend — Sécurité** | Argon2, JWT + cookies httpOnly, Helmet, XSS Sanitizer, CORS, validation Zod                  |
| **Backend — BDD**      | Schéma Prisma complet (4 tables), migrations, seed                                           |
| **Frontend — Auth**    | Inscription, connexion, déconnexion, AuthContext, cookies httpOnly                           |
| **Frontend — Pages**   | `/`, `/login`, `/register`, `/search`, `/book/:id`, `/library`, `/legal`, `/privacy`, `/cgu` |
| **Frontend — API**     | `lib/api.ts`, services auth/book/library/user câblés sur l'API réelle                        |
| **Docker**             | `docker-compose.yml` avec db, adminer, api, frontend                                         |
| **Doc**                | Cahier des charges, guide Git, template PR                                                   |

### 1.2 Ce qui reste à faire 🚧

#### Fonctionnel manquant (MVP)

| Priorité  | Tâche                                                                                           | Fichier(s) concerné(s)                                 |
| --------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 🔴 Haute   | **Page profil** : câbler l'appel API `PATCH /user/profile` et `GET /user/profile`               | `frontend/src/app/profile/page.tsx` + `userService.ts` |
| 🔴 Haute   | **Notation (1–5 étoiles)** : UI manquante sur `/library` + `PATCH /library/:id` à enrichir      | `library/page.tsx`, `library.controller.ts`            |
| 🔴 Haute   | **Avis personnel** : UI manquante sur `/library`                                                | `library/page.tsx`                                     |
| 🟠 Moyenne | **Refresh token** : Logique de renouvellement absente (token stocké en BDD mais jamais utilisé) | `auth.controller.ts`, `auth.router.ts`                 |
| 🟡 Basse   | **Confirmation de suppression livre** : Dialog de confirmation manquant                         | `library/page.tsx`                                     |
| 🟡 Basse   | **Feedback visuel** : Remplacer `alert()` par des toast notifications                           | Toutes les pages avec formulaires                      |

#### Complété cette semaine ✅

**23/03/2026 :**

- ✅ **Suppression de compte** : Route backend `DELETE /user` implémentée
- ✅ **Récupération profil** : Route backend `GET /user/profile` ajoutée
- ✅ **Configuration Prisma** : `binaryTargets = ["native"]` ajouté
- ✅ **Frontend** : Résolution conflit types `UpdateProfileResponse`

**24/03/2026 :**

- ✅ **Tests backend COMPLÉTÉS** : 73 tests (33 unitaires + 40 intégration) - 100% succès
- ✅ **Couverture optimale** : 91% statements, 87% branches, 100% functions, 93% lines
- ✅ **Configuration Vitest** : fileParallelism: false, seuils adaptés, path aliases
- ✅ **Architecture tests** : helpers (testServer, dbHelpers), isolation BDD
- ✅ **asyncWrapper unifié** : tous controllers (auth, library, user)
- ✅ **Gestion erreurs standardisée** : Zod → VALIDATION_ERROR, Prisma → NOT_FOUND
- ✅ **CI/CD GitHub Actions** : 5 jobs (lint-backend, test-backend, build-backend, lint-frontend, build-frontend)
- ✅ **PostgreSQL service** : Container PostgreSQL 17 pour tests d'intégration dans CI
- ✅ **Codecov integration** : Upload automatique des rapports de couverture (optionnel)
- ✅ **Documentation** : Mise à jour complète des guides CI/CD et tests Vitest

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

### 3.2 Workflow CI (`.github/workflows/ci.yml`)

> **Important** : Les tests d'intégration backend nécessitent une base PostgreSQL.
> GitHub Actions fournit des services Docker pour ça.

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # ─── Lint ────────────────────────────────────────────────────────────────
  lint-backend:
    name: Lint Backend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: blablabook/backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: blablabook/backend/package-lock.json
      - run: npm ci
      - run: npm run lint

  lint-frontend:
    name: Lint Frontend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: blablabook/frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: blablabook/frontend/package-lock.json
      - run: npm ci
      - run: npm run lint

  # ─── Tests Backend ───────────────────────────────────────────────────────
  test-backend:
    name: Tests Backend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: blablabook/backend

    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: blablabook_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://test:test@localhost:5432/blablabook_test
      JWT_SECRET: ci-secret-key-for-tests
      PORT: 3000

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: blablabook/backend/package-lock.json
      - run: npm ci
      - name: Appliquer les migrations Prisma
        run: npm run db:migrate:deploy
      - name: Générer le client Prisma
        run: npm run db:generate
      - name: Lancer les tests
        run: npm test
      - name: Rapport de couverture
        run: npm run test:coverage

  # ─── Build Frontend ──────────────────────────────────────────────────────
  build-frontend:
    name: Build Frontend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: blablabook/frontend
    env:
      NEXT_PUBLIC_API_URL: http://localhost:3000
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: blablabook/frontend/package-lock.json
      - run: npm ci
      - run: npm run build
```

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

## 4. Déploiement

### 4.1 Architecture cible recommandée (gratuit/low-cost)

| Composant           | Service recommandé                                             | Raison                                                           |
| ------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Base de données** | [Neon](https://neon.tech) ou [Supabase](https://supabase.com)  | PostgreSQL managé, free tier généreux                            |
| **Backend**         | [Railway](https://railway.app) ou [Render](https://render.com) | Déploiement depuis GitHub, variables d'env, Node.js natif        |
| **Frontend**        | [Vercel](https://vercel.com)                                   | Plateforme native Next.js, déploiement automatique depuis GitHub |

### 4.2 Variables d'environnement à configurer en production

**Backend (Railway/Render)**

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<URL_Neon_ou_Supabase>
JWT_SECRET=<clé_aléatoire_forte_256_bits>
ALLOWED_ORIGINS=https://<ton-domaine-vercel>.vercel.app
```

**Frontend (Vercel)**

```env
NEXT_PUBLIC_API_URL=https://<ton-domaine-backend>.railway.app
```

### 4.3 Corrections nécessaires avant déploiement

#### Problème CORS : le frontend Docker utilise `http://localhost`

Dans `docker-compose.yml` ligne 54 :

```yaml
# Actuel (incorrect pour la prod)
- NEXT_PUBLIC_API_URL=http://localhost:${PORT}
```

En production, `localhost` du frontend Docker ne peut pas atteindre le backend.
→ Utiliser l'URL publique du backend en prod.

#### Cookies `sameSite: "none"` nécessitent HTTPS

Dans `backend/src/utils/token.ts`, les cookies sont configurés avec `secure: true` et `sameSite: "none"`.
→ Valable uniquement si le backend et le frontend sont sur des domaines différents **et** en HTTPS.
→ En production, s'assurer que les deux services sont derrière HTTPS.

#### Migration Prisma au démarrage

Ajouter au script de démarrage production du backend :

```json
{
  "scripts": {
    "start:prod": "npm run db:migrate:deploy && node dist/index.js"
  }
}
```

### 4.4 Workflow de déploiement automatique (`.github/workflows/deploy.yml`)

> Ce workflow se déclenche uniquement après un merge dans `main` **et** si la CI est verte.

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    name: Deploy Backend
    runs-on: ubuntu-latest
    needs: []  # Ajouter : needs: [test-backend] si fusionné avec ci.yml
    steps:
      - uses: actions/checkout@v4
      # Railway : utiliser le CLI ou le webhook de déploiement
      - name: Deploy to Railway
        run: curl -X POST ${{ secrets.RAILWAY_DEPLOY_WEBHOOK }}

  deploy-frontend:
    name: Deploy Frontend (Vercel)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # Vercel déploie automatiquement depuis GitHub — aucune action manuelle requise
      # Alternativement, utiliser le CLI Vercel :
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: blablabook/frontend
          vercel-args: '--prod'
```

**Secrets GitHub à configurer** (Settings → Secrets and variables → Actions) :

- `RAILWAY_DEPLOY_WEBHOOK` — URL de déploiement Railway
- `VERCEL_TOKEN` — Token API Vercel
- `VERCEL_ORG_ID` — ID de l'organisation Vercel
- `VERCEL_PROJECT_ID` — ID du projet Vercel

---

## 5. Backlog priorisé — Tâches par ordre d'importance

### 🔴 Priorité 1 — Compléter le MVP (1–2 jours)

- [ ] **Profile page** : Implémenter l'appel `userService.updateProfile()` et `getUserProfile()` dans `app/profile/page.tsx`
- [x] **Route DELETE /user** : ✅ Ajouter la route de suppression de compte dans le backend (fait 23/03)
- [x] **Route GET /user/profile** : ✅ Ajouter la route de récupération du profil (fait 23/03)
- [ ] **Notes et avis** : Ajouter l'UI étoiles + zone de texte dans `/library`, enrichir `PATCH /library/:id`

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
- [x] ✅ Atteindre 91% coverage (dépasse largement l'objectif 70%)

### ✅ Priorité 3 — GitHub Actions CI — ✅ COMPLÉTÉ (24/03/2026)

- [x] ✅ Créer `.github/workflows/ci.yml` (5 jobs: lint-backend, test-backend, build-backend, lint-frontend, build-frontend)
- [x] ⚠️ Configurer la protection de branche `main` sur GitHub — **NON APPLICABLE** (fonctionnalité désactivée par l’organisation école, nécessite permissions admin)
- [x] ⏸️ Vérifier que les checks CI s’affichent sur les PRs (à tester lors de la prochaine PR)

### 🟡 Priorité 4 — Déploiement (1 jour)

- [ ] Créer la base de données sur Neon ou Supabase
- [ ] Déployer le backend sur Railway ou Render
- [ ] Déployer le frontend sur Vercel
- [ ] Configurer les variables d'environnement production
- [ ] Appliquer les migrations (`db:migrate:deploy`)
- [ ] Tester le flux complet en prod (register → login → add book → logout)
- [ ] Créer `.github/workflows/deploy.yml`
- [ ] Ajouter les secrets GitHub

### 🟢 Priorité 5 — Améliorations qualité (nice-to-have)

- [ ] **Refresh token** : Ajouter `POST /auth/refresh` pour renouveler le token sans re-login
- [ ] **Rate limiting** : Ajouter `express-rate-limit` sur `/auth/login` et `/auth/register`
- [ ] **Toast notifications** : Remplacer les `alert()` par un composant toast (shadcn/ui Toaster)
- [ ] **Logger** : Ajouter Winston ou Pino pour les logs structurés en prod
- [ ] **Cache OpenLibrary** : Mettre en cache les réponses de l'API externe (node-cache ou Redis)
- [ ] **Tests frontend** : Vitest + Testing Library sur les composants critiques (AuthContext, formulaires)

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
