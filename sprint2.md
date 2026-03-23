# Sprint 2 — Plan de finition BlaBlaBook

> **Date de rédaction** : 2026-03-22
> **Phase** : Sprint 2 — Intégration, Tests, CI/CD, Déploiement
> **Statut global** : MVP fonctionnel à ~80%, tests à 0%, CI/CD absent, déploiement non configuré

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
| 🔴 Haute   | **Page profil** : câbler l'appel API `PATCH /user/profile` (actuellement TODO commenté)         | `frontend/src/app/profile/page.tsx` + `userService.ts` |
| 🔴 Haute   | **Notation (1–5 étoiles)** : UI manquante sur `/library` + `PATCH /library/:id` à enrichir      | `library/page.tsx`, `library.controller.ts`            |
| 🔴 Haute   | **Avis personnel** : UI manquante sur `/library`                                                | `library/page.tsx`                                     |
| 🟠 Moyenne | **Suppression de compte** : Route backend `DELETE /user` absente, UI présente                   | `user.controller.ts`, `user.router.ts`                 |
| 🟠 Moyenne | **Refresh token** : Logique de renouvellement absente (token stocké en BDD mais jamais utilisé) | `auth.controller.ts`, `auth.router.ts`                 |
| 🟡 Basse   | **Confirmation de suppression livre** : Dialog de confirmation manquant                         | `library/page.tsx`                                     |
| 🟡 Basse   | **Feedback visuel** : Remplacer `alert()` par des toast notifications                           | Toutes les pages avec formulaires                      |

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

#### Tests unitaires (`*.unit.test.ts`)

Tester la logique pure, sans base de données.

**`tests/utils/token.unit.test.ts`** — Génération et vérification des tokens JWT

```ts
// Ce qu'il faut couvrir :
// - generateAccessToken() retourne un JWT valide
// - verifyAccessToken() retourne le payload attendu
// - verifyAccessToken() lève une erreur si token invalide/expiré
// - generateRefreshToken() retourne une chaîne base64
```

**`tests/middlewares/auth.middleware.unit.test.ts`** — Middleware JWT

```ts
// Ce qu'il faut couvrir :
// - Retourne 401 si aucun cookie accessToken
// - Retourne 401 si token invalide
// - Appelle next() et injecte req.user si token valide
```

**`tests/errors/errors.unit.test.ts`** — Classes d'erreurs

```ts
// Ce qu'il faut couvrir :
// - AppError, NotFoundError, BadRequestError, UnauthorizedError... ont le bon statusCode
// - asyncWrapper capture les erreurs async et les passe à next()
```

#### Tests d'intégration (`*.spec.test.ts`)

Tester les routes HTTP complètes avec une base de données de test.

**Prérequis** : Créer un fichier `.env.test` avec une DATABASE_URL pointant vers une BDD de test (ou utiliser une base en mémoire SQLite — mais Prisma + PostgreSQL, donc préférer une BDD PostgreSQL de test).

**`tests/auth.spec.test.ts`**

```ts
// POST /auth/register
// - ✅ 201 avec email/password/username valides
// - ❌ 400 si email invalide
// - ❌ 400 si password trop faible (< 8 chars, sans majuscule)
// - ❌ 409 si email déjà utilisé

// POST /auth/login
// - ✅ 200 avec cookie accessToken + refreshToken
// - ❌ 401 si mauvais mot de passe
// - ❌ 404 si email inconnu

// POST /auth/logout
// - ✅ 200 et suppression des cookies
```

**`tests/library.spec.test.ts`**

```ts
// GET /library — auth requise
// - ✅ 200 avec liste vide pour nouvel utilisateur
// - ❌ 401 sans token

// POST /library
// - ✅ 201 avec données livre valides
// - ❌ 400 si titre manquant
// - ❌ 409 si livre déjà dans la bibliothèque

// PATCH /library/:id
// - ✅ 200 avec statut valid (TO_READ, READING, READ)
// - ❌ 400 si statut invalide
// - ❌ 403 si l'item n'appartient pas à l'utilisateur

// DELETE /library/:id
// - ✅ 204 si item supprimé
// - ❌ 404 si item inconnu
```

**`tests/user.spec.test.ts`**

```ts
// PATCH /user/profile
// - ✅ 200 avec username modifié
// - ❌ 409 si nouvel email déjà pris
// - ❌ 401 sans token
```

#### Organisation des fichiers de test

```plaintext
backend/
└── tests/
    ├── helpers/
    │   ├── createTestUser.ts     # Utilitaire : créer un user en BDD de test
    │   └── getAuthCookie.ts      # Utilitaire : login et récupérer le cookie
    ├── auth.http                 # Tests manuels (existants)
    ├── book.http
    ├── library.http
    ├── user.http
    ├── auth.spec.test.ts         # À créer
    ├── library.spec.test.ts      # À créer
    ├── user.spec.test.ts         # À créer
    └── utils/
        └── token.unit.test.ts    # À créer
```

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

- [ ] **Profile page** : Implémenter l'appel `userService.updateProfile()` dans `app/profile/page.tsx`
- [ ] **Route DELETE /user** : Ajouter la route de suppression de compte dans le backend
- [ ] **Notes et avis** : Ajouter l'UI étoiles + zone de texte dans `/library`, enrichir `PATCH /library/:id`

### 🟠 Priorité 2 — Tests backend avec Vitest (2–3 jours)

- [ ] Installer Vitest + supertest dans le backend
- [ ] Créer `vitest.config.ts`
- [ ] Créer `tests/helpers/createTestUser.ts` et `getAuthCookie.ts`
- [ ] Écrire `tests/auth.spec.test.ts` (register, login, logout)
- [ ] Écrire `tests/library.spec.test.ts` (CRUD bibliothèque)
- [ ] Écrire `tests/user.spec.test.ts` (update profile)
- [ ] Écrire `tests/utils/token.unit.test.ts`
- [ ] Écrire `tests/middlewares/auth.middleware.unit.test.ts`
- [ ] Atteindre ~70% de couverture sur `src/`

### 🟠 Priorité 3 — GitHub Actions CI (0,5 jour)

- [ ] Créer `.github/workflows/ci.yml` (lint + tests + build)
- [ ] Configurer la protection de branche `main` sur GitHub
- [ ] Vérifier que les checks CI s'affichent sur les PRs

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
