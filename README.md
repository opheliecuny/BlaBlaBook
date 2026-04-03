# 📚 BlaBlaBook

> **Votre bibliothèque personnelle, réinventée.**
> Recherchez des millions de livres, organisez vos lectures et suivez votre progression — le tout dans une interface élégante, bilingue et accessible.

🌐 **Production** — [blablabook-front.onrender.com](https://blablabook-front.onrender.com)

---

## Présentation

BlaBlaBook est une application web fullstack de gestion de bibliothèque personnelle. Elle permet aux utilisateurs de rechercher des livres via l'API Open Library (avec fallback Google Books), de les ajouter à leur bibliothèque, de suivre leur statut de lecture et de gérer leur profil.

L'application est disponible en **français et en anglais**, supporte le **mode nuit**, et est optimisée pour le **mobile et le desktop**.

---

## Fonctionnalités

### Livres

- 🔍 Recherche full-text avec **autocomplétion** (debounce 300ms, navigation clavier)
- 📖 Fiche détaillée par livre (couverture, auteur, description dépliable, livres similaires)
- 🎲 Suggestions aléatoires sur la page d'accueil (rafraîchissables)
- 🎯 **Recommandations personnalisées** selon les genres lus (si connecté, ≥ 3 livres)
- 🔗 Partage de fiche livre par lien

### Bibliothèque personnelle

- ➕ Ajout de livres depuis la recherche ou la fiche détaillée
- 🏷️ Statuts de lecture : `À lire`, `En cours`, `Lu`
- 🗑️ Suppression avec confirmation (AlertDialog)
- 📊 Statistiques dynamiques (nombre de livres par statut)
- 🔎 Statut bibliothèque visible directement depuis la page de recherche

### Authentification

- 📝 Inscription avec validation + indicateur de force du mot de passe
- 🔐 Connexion avec JWT (accessToken 1h) + refresh token 7j (cookies httpOnly)
- 🚪 Déconnexion sécurisée (suppression cookies + BDD)
- 👤 Modification du profil (email, nom d'utilisateur, mot de passe)
- ❌ Suppression de compte (avec cascade des données)

### Expérience utilisateur

- 🌍 Interface disponible en **français** et **anglais** (sélecteur dans la navbar)
- 🌙 **Mode nuit** (dark mode) avec bascule persistante
- 🔔 Notifications toast (actions bibliothèque, bienvenue au premier login)
- ♿ Audit accessibilité complet (aria-labels, rôles sémantiques, navigation clavier)
- 📱 Design responsive (mobile + desktop)
- 🤖 SEO : sitemap, robots.txt, balises OpenGraph

---

## Stack technique

### Frontend

| Technologie    | Version         | Rôle                       |
| -------------- | --------------- | -------------------------- |
| Next.js        | 16 (App Router) | Framework React SSR/SSG    |
| React          | 19.2.3          | UI Library                 |
| Tailwind CSS   | v4              | Styling utility-first      |
| shadcn/ui      | —               | Composants accessibles     |
| next-intl      | ^4.8.3          | Internationalisation FR/EN |
| next-themes    | ^0.4.6          | Dark mode                  |
| lucide-react   | —               | Icônes                     |
| Sonner         | —               | Toasts notifications       |
| Vitest + jsdom | —               | Tests unitaires            |

### Backend

| Technologie          | Version | Rôle                          |
| -------------------- | ------- | ----------------------------- |
| Express              | 5.2.1   | API REST                      |
| Node.js + TypeScript | —       | Runtime                       |
| Prisma               | 6.19.2  | ORM typé                      |
| PostgreSQL           | 17      | Base de données               |
| Redis (Upstash)      | —       | Cache + rate limit store      |
| argon2               | —       | Hash des mots de passe        |
| jsonwebtoken         | —       | Authentification JWT          |
| Zod                  | —       | Validation des données        |
| Helmet               | —       | Sécurité headers HTTP         |
| Vitest + supertest   | —       | Tests unitaires + intégration |

### Infrastructure

| Service         | Provider       | Usage                    |
| --------------- | -------------- | ------------------------ |
| Frontend        | Render         | Hébergement Next.js      |
| Backend         | Render         | Hébergement Express      |
| Base de données | Neon           | PostgreSQL 17 serverless |
| Cache           | Upstash        | Redis serverless         |
| Monitoring      | UptimeRobot    | Keep-alive + alertes     |
| CI/CD           | GitHub Actions | Lint, tests, déploiement |

---

## Architecture

```plaintext
blablabook/
├── frontend/                    # Next.js 16 — App Router
│   ├── messages/
│   │   ├── fr/                  # Traductions françaises
│   │   └── en/                  # Traductions anglaises
│   ├── i18n/
│   │   └── request.ts           # Chargement messages (next-intl SSR)
│   └── src/
│       ├── middleware.ts         # Routing locale (next-intl)
│       ├── app/
│       │   ├── layout.tsx        # Root layout : ThemeProvider + polices
│       │   ├── api/[...path]/    # Proxy Route Handler → backend
│       │   └── [locale]/
│       │       ├── layout.tsx    # NextIntlClientProvider + AuthProvider
│       │       ├── page.tsx      # Accueil (recommandations + refresh)
│       │       ├── login/        # Connexion
│       │       ├── register/     # Inscription
│       │       ├── library/      # Bibliothèque (CRUD + filtres)
│       │       ├── search/       # Recherche (autocomplete)
│       │       ├── book/[id]/    # Fiche livre
│       │       └── profile/      # Profil utilisateur
│       ├── components/           # Composants réutilisables
│       ├── contexts/
│       │   ├── AuthContext.tsx   # user, isAuthenticated, isLoading
│       │   └── LibraryStatusContext.tsx  # Statut livres cross-pages
│       ├── hooks/
│       │   └── useAddToLibrary.ts
│       ├── services/             # Appels API (auth, books, library, user)
│       ├── lib/
│       │   └── api.ts            # Client fetch centralisé (via proxy /api)
│       └── types/
│           └── library.ts
│
└── backend/                     # Express 5 — API REST
    ├── src/
    │   ├── controllers/         # Logique des routes
    │   ├── routes/              # Définition des routes
    │   ├── middlewares/         # Auth JWT, validation, rate limit, XSS
    │   ├── errors/              # Classes AppError + transformError
    │   └── utils/
    │       ├── prismaClient.ts  # Singleton Prisma
    │       ├── token.ts         # JWT génération/vérification
    │       ├── redisClient.ts   # Cache (cacheGet / cacheSet)
    │       └── recommendation.ts  # Algorithme recommandations
    ├── prisma/
    │   └── schema.prisma        # 4 modèles : user, book, library_item, refresh_token
    └── tests/
        ├── unit/                # Tests unitaires (middlewares, utils, errors)
        └── integration/api/     # Tests end-to-end (supertest)
```

### Flux de données

```plaintext
Navigateur
  └─→ Next.js frontend (app/[locale]/...)
        └─→ /api/[...path] (Route Handler proxy)
              └─→ Express backend (blablabook-api.onrender.com)
                    ├─→ PostgreSQL (Neon) via Prisma
                    ├─→ Redis (Upstash) — cache + rate limiting
                    └─→ Open Library API / Google Books API
```

---

## API Backend

### Authentification — `/auth`

| Méthode | Route            | Description                             | Auth requise |
| ------- | ---------------- | --------------------------------------- | ------------ |
| `POST`  | `/auth/register` | Inscription (email, password, username) | ❌            |
| `POST`  | `/auth/login`    | Connexion → cookies httpOnly JWT        | ❌            |
| `POST`  | `/auth/logout`   | Déconnexion + suppression cookies       | ✅            |
| `POST`  | `/auth/refresh`  | Renouveler l'accessToken (rotation)     | ❌            |
| `GET`   | `/auth/me`       | Utilisateur connecté                    | ✅            |

### Livres — `/books`

| Méthode | Route                   | Description                        | Cache       |
| ------- | ----------------------- | ---------------------------------- | ----------- |
| `GET`   | `/books`                | 4 livres aléatoires ou recommandés | 10 min      |
| `GET`   | `/books/search?q=...`   | Recherche paginée                  | 1 h         |
| `GET`   | `/books/suggest?q=...`  | 5 suggestions autocomplete         | court terme |
| `GET`   | `/books/:openLibraryId` | Détails d'un livre                 | 24 h        |

### Bibliothèque — `/library` (authentifié)

| Méthode  | Route          | Description                             |
| -------- | -------------- | --------------------------------------- |
| `GET`    | `/library`     | Bibliothèque de l'utilisateur (paginée) |
| `POST`   | `/library`     | Ajouter un livre                        |
| `PATCH`  | `/library/:id` | Modifier statut, note (1-5), avis       |
| `DELETE` | `/library/:id` | Supprimer un livre                      |

### Utilisateur — `/user` (authentifié)

| Méthode  | Route           | Description                               |
| -------- | --------------- | ----------------------------------------- |
| `GET`    | `/user/profile` | Récupérer le profil                       |
| `PATCH`  | `/user/profile` | Modifier email, username ou password      |
| `DELETE` | `/user`         | Supprimer le compte et toutes les données |

### Monitoring

| Méthode | Route     | Description                    |
| ------- | --------- | ------------------------------ |
| `GET`   | `/health` | Status API + test connexion DB |

---

## Installation locale

### Prérequis

- **Node.js** 22+
- **Docker** + Docker Compose (recommandé)
- **npm** 10+

### Option 1 — Docker (recommandé)

Lance l'ensemble de la stack (PostgreSQL, Adminer, backend, frontend) en une seule commande.

**1. Cloner le dépôt**

```bash
git clone <url-du-repo>
cd BlaBlaBook/blablabook
```

**2. Configurer les variables d'environnement**

```bash
cp .env.example .env
```

Remplir le fichier `.env` :

```env
# Base de données
POSTGRES_USER=blablabook
POSTGRES_PASSWORD=your_password
POSTGRES_DB=blablabook
POSTGRES_PORT=5433

# Backend
PORT=3000
ALLOWED_ORIGINS="http://localhost:3001"
DATABASE_URL=postgresql://blablabook:your_password@db:5432/blablabook?schema=public

# Frontend
FRONTEND_PORT=3001
```

> ⚠️ En Docker, `DATABASE_URL` doit pointer vers le service `db` (pas `localhost`).
> `API_URL` et `NEXT_PUBLIC_API_URL` sont injectées automatiquement par docker-compose.

**3. Démarrer**

```bash
docker compose up -d
```

| Service       | URL locale              |
| ------------- | ----------------------- |
| Frontend      | <http://localhost:3001> |
| Backend       | <http://localhost:3000> |
| Adminer (BDD) | <http://localhost:8000> |

**4. Appliquer les migrations**

```bash
docker compose exec api npx prisma migrate deploy
docker compose exec api npm run db:seed   # optionnel
```

---

### Option 2 — Sans Docker

**1. Base de données**

Démarrer une instance PostgreSQL locale (port 5433 recommandé pour éviter les conflits) ou utiliser une connexion Neon/Supabase.

**2. Backend**

```bash
cd blablabook/backend
cp .env.example .env   # remplir les valeurs
npm install
npm run db:generate
npm run db:migrate:dev
npm run dev
```

Variables `.env` backend :

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5433/blablabook?schema=public
JWT_SECRET=your-secret-key-min-32-chars
ALLOWED_ORIGINS=http://localhost:3001
# Optionnel — Redis (Upstash)
UPSTASH_REDIS_URL=rediss://...
```

**3. Frontend**

```bash
cd blablabook/frontend
cp .env.local.example .env.local   # ou créer manuellement
npm install
npm run dev
```

Variables `.env.local` frontend :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
API_URL=http://localhost:3000
```

> En local sans Docker, `NEXT_PUBLIC_API_URL` et `API_URL` sont toutes les deux nécessaires :
> `NEXT_PUBLIC_API_URL` est utilisée côté navigateur (Client Components),
> `API_URL` est utilisée côté serveur (Server Components, Route Handler proxy).

---

## Commandes utiles

### Frontend

```bash
cd blablabook/frontend
npm run dev          # Démarrer en développement (http://localhost:3001)
npm run build        # Compiler pour la production
npm run start        # Démarrer en mode production
npm run lint         # Linter ESLint
```

### Backend

```bash
cd blablabook/backend
npm run dev          # Démarrer avec hot-reload (tsx)
npm run build        # Compiler TypeScript → dist/
npm run start        # Démarrer le serveur compilé (prod)
npm run lint         # Linter ESLint
npm run lint:fix     # Linter avec auto-fix
```

### Base de données

```bash
cd blablabook/backend
npm run db:generate        # Générer le client Prisma
npm run db:migrate:dev     # Créer une migration (dev)
npm run db:migrate:deploy  # Appliquer les migrations (prod)
npm run db:studio          # Ouvrir Prisma Studio (interface BDD)
npm run db:seed            # Seed la base de données
npm run db:reset           # Reset complet + seed
```

### Tests

```bash
cd blablabook/backend
npm test               # Tous les tests
npm run test:unit      # Tests unitaires uniquement
npm run test:spec      # Tests d'intégration uniquement

cd blablabook/frontend
npm test               # Tests frontend (Vitest + jsdom)
```

---

## Tests

### Backend — ~80% de couverture

| Type        | Nombre | Portée                                                    |
| ----------- | ------ | --------------------------------------------------------- |
| Unitaires   | 33+    | Middlewares, utils (token, redis, recommendation), errors |
| Intégration | 40+    | Tous les endpoints API (auth, books, library, user)       |

**Configuration requise pour les tests d'intégration** : créer un fichier `.env.test` dans `blablabook/backend/` avec une base de données dédiée.

```env
DATABASE_URL=postgresql://user:password@localhost:5433/blablabook_test
JWT_SECRET=test-secret-key
```

### Frontend

Tests Vitest + jsdom couvrant les services (`authService`, `libraryService`) et le client fetch (`api.ts`).

---

## Déploiement

### Infrastructure de production

| Composant       | Service                  | URL                                     |
| --------------- | ------------------------ | --------------------------------------- |
| Frontend        | Render                   | <https://blablabook-front.onrender.com> |
| Backend         | Render                   | <https://blablabook-api.onrender.com>   |
| Base de données | Neon (PostgreSQL 17, EU) | —                                       |
| Cache           | Upstash Redis            | —                                       |
| Monitoring      | UptimeRobot (ping /5min) | —                                       |

### Variables d'environnement en production

**Backend (Render)**

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<URL_Neon>
JWT_SECRET=<clé_256_bits>
ALLOWED_ORIGINS=https://blablabook-front.onrender.com
UPSTASH_REDIS_URL=<URL_Upstash_TLS>
```

**Frontend (Render)**

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://blablabook-api.onrender.com
API_URL=https://blablabook-api.onrender.com
```

### Configuration Render

**Backend**

- Root Directory : `blablabook/backend`
- Build Command : `npm install && npx prisma generate`
- Start Command : `npx prisma migrate deploy && npx tsx index.ts`
- Health Check Path : `/health`

**Frontend**

- Root Directory : `blablabook/frontend`
- Build Command : `npm install && npm run build`
- Start Command : `npm run start`

### CI/CD — GitHub Actions

Le pipeline est organisé en deux workflows :

**`ci.yml`** — déclenché sur chaque PR vers `main`

| Job              | Description                                                     |
| ---------------- | --------------------------------------------------------------- |
| `lint-backend`   | ESLint backend                                                  |
| `test-backend`   | 73+ tests Vitest avec PostgreSQL 17 (service Docker) + coverage |
| `build-backend`  | Compilation TypeScript                                          |
| `lint-frontend`  | ESLint frontend                                                 |
| `build-frontend` | Build Next.js                                                   |

**`deploy.yml`** — déclenché sur push dans `main`

Déclenche les deploy hooks Render via les secrets GitHub :

- `RENDER_BACKEND_DEPLOY_HOOK`
- `RENDER_FRONTEND_DEPLOY_HOOK`

---

## Sécurité

| Mesure             | Implémentation                                                                    |
| ------------------ | --------------------------------------------------------------------------------- |
| Hash mots de passe | **argon2** (jamais bcrypt)                                                        |
| Authentification   | JWT — accessToken 1h + refreshToken 7j en BDD (rotation)                          |
| Cookies            | httpOnly, `secure` (prod), `sameSite: "lax"` (via proxy Next.js)                  |
| Headers HTTP       | **Helmet** (CSP, HSTS, X-Frame-Options…)                                          |
| XSS                | `express-xss-sanitizer` sur tous les inputs                                       |
| Injections SQL     | **Prisma ORM** (requêtes paramétrées typées)                                      |
| Validation         | **Zod** sur tous les endpoints                                                    |
| Rate limiting      | Global 100 req/15min · Auth 10 req/15min · Search 30 req/min                      |
| CORS               | Origines whitelist depuis `ALLOWED_ORIGINS`                                       |
| Proxy frontend     | Route Handler Next.js (`/api/[...path]`) — résout les problèmes Safari cross-site |

---

## Roadmap

### Réalisé ✅

- MVP complet (recherche, bibliothèque, authentification)
- Internationalisation FR/EN (next-intl)
- Dark mode (next-themes)
- Cache Redis (Open Library — TTL par endpoint)
- Recommandations personnalisées (algorithme basé sur l'historique de lecture)
- Autocomplétion recherche (debounce + AbortController)
- SEO (robots.txt, sitemap, OpenGraph)
- Tests backend (80%+ coverage) + tests frontend
- CI/CD GitHub Actions + déploiement Render

### En cours / à venir

- [ ] Composant notation 5 étoiles (`StarRating`) dans la bibliothèque
- [ ] Zone de texte avis personnel sur les livres lus
- [ ] Loading skeletons sur `/library` et `/search`
- [ ] Métadonnées SEO dynamiques sur `/book/[id]`

---

## Équipe

| Membre      | Rôle                                                           |
| ----------- | -------------------------------------------------------------- |
| Christopher | Lead Dev Frontend — architecture UI, pages search et book      |
| Ophélie     | Lead Dev Backend — API REST, accessibilité, UX                 |
| Paul        | Scrum Master — DevOps, CI/CD, monitoring, pages auth et profil |
| Rémi        | Product Owner — backlog, user stories, intégration backend     |

---

## Base de données

Schéma Prisma — 4 modèles :

| Modèle          | Champs principaux                                               |
| --------------- | --------------------------------------------------------------- |
| `user`          | id (UUID), email, password (argon2), username, createdAt        |
| `book`          | id (UUID), isbn, openLibraryId, title, author, genre, thumbnail |
| `library_item`  | id (UUID), userId, bookId, status, rating (1-5), review         |
| `refresh_token` | id, token, userId, issuedAt, expiresAt                          |

**Enum `ReadingStatus`** : `TO_READ` · `READING` · `READ`

---

## Licence

Projet réalisé dans le cadre d'une formation. Non destiné à une utilisation commerciale.
