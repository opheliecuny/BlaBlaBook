# Journal de bord de l'équipe

## Sprint 0

### 11/03/2026

La majorité des documents du sprint 0 ont été validés, on peaufine les détails pour pouvoir avoir une version propre en fin de semaine.

#### Infos individuelles

- **Ophélie :** Maquettes desktop terminées (TODO: ajuster quelques détails de cohérence avec les wf), début des maquettes mobile
- **Rémi :** Corrigé le diagramme des use-cases suite au retour d'Amo. Ajouté des user stories, comparé les wireframes et maquettes puis update du kanban.
- **Paul :** Finalisation "Analyses des risques" | Mise à jour de la liste des roles par dev | Révision des US | Mise à jour de la documentation pour éliminer les incohérences | Inscription à Neon
- **Christopher :**  Création des wireframes desktop et mobile de la page profil utilisateur et création du sitemap PlantUML : `docs/sprint 0/diagrammes/sitemap.puml`
(Représentation de l'arborescence frontend avec niveaux d'accès (public / authentifié))

---

### 12/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :** Finalisation des maquettes version mobile et ajout d'une page type pour les mentions légales. Harmonisation entre les wf et les maquettes avec Christopher. Validation des maquettes.
- **Rémi :** Mis à jour du kanban suite modifications de Paul prenant en compte les nouvelles user stories. Modifications finales du diagramme use-cases. Début de structure du dossier backend avec tests pour explorer l'API OpenLibrary et rédaction d'un bref résumé à son sujet.
- **Paul :** Amélioration MVP | MAJ documentation de conception MCD à MPD | Guide Git et GitHub avec recap convention de nommage branches et commit.
- **Christopher :** Initialisation du projet frontend, Mise en place de la structure du projet, Composants de base (Navbar, Footer, layout), Pages créées (6 routes MVP), ajustements UI homepage + navbar et Corrections wireframes MVP.

---

### 13/03/2026

Journée rétrospective.

---

## Sprint 1

### 16/03/2026

Démarrage du sprint 1. Chacun attaque sa dominante : initialisation BDD côté Ophélie, backend côté Rémi, pages secondaires côté Paul, et structure des pages MVP côté Christopher.

#### Infos individuelles

- **Ophélie :** Initialisation de prisma (v6 car vulnérabilités sur v7), mise en place d'un docker compose pour être sûr que tout le monde peut lancer facilement une bdd.
- **Rémi :** Implémentation des routes générales. Début des contrôleurs (book et auth) avec une base de test pour book. Exploration d'openLibrary un peu plus en profondeur.
- **Paul :** Pages /legal (politique confidentialité + RGPD) et /profile (gestion profil + sécurité + suppression compte). Configuration Prettier frontend.
- **Christopher :** Structure complète des pages MVP frontend : page de recherche `/search` (grille de résultats, états vides, pagination côté client) et page de détail `/book/:id`. Corrections accessibilité sur l'ensemble des formulaires (labels sr-only, name, required, autoComplete). Gestion des cas limites sur la recherche (requête vide, aucun résultat).

---

### 17/03/2026

Bonne dynamique d'équipe, les fonctionnalités principales avancent en parallèle sur le back et le front.

#### Infos individuelles

- **Ophélie :** Seeding bdd et centralisation des erreurs en back avec un middleware. Début de controller library (route GET fonctionnelle) !
- **Rémi :** Finalisation du auth.controller et mise en place de user.controller. Implémentation des tests associés et début de refactorisation des controllers.
- **Paul :** Mise à jour pages /register et /login (composants shadcn/ui Input/Label/Checkbox, state management, validation). Développement complet page /library : composants StatCard et EmptyState, filtres interactifs avec variants, gestion CRUD livres (ajout/suppression), stats dynamiques, optimisation Next.js Image (remotePatterns OpenLibrary). Configuration next.config.ts pour images externes.
- **Christopher :** Intégration des maquettes sur la homepage (hero, section livres du moment), la navbar (suppression barre de recherche, lien "Rechercher", logo Playfair), la page search (harmonisation largeur, polices, boutons) et la page détail livre (layout deux colonnes, tag genre, lien auteur, encadré statut de lecture). Alignement sur la charte graphique (polices Playfair/Lora/Inter, couleurs terracotta/primary).

---

### 18/03/2026

Journée de branchement sur les vraies APIs et d'ajustements suite aux mises à jour du backend.

#### Infos individuelles

- **Ophélie :** le controller library est complété et toutes les routes liées sont fonctionnelles (tests effectués), ne reste plus qu'à préciser un peu les erreurs spécifiques à prisma et zod mais ça n'empêche pas de les utiliser.
- **Rémi :** Mise à jour du backend : `GET /books` retourne désormais `author` (string unique), `id` et `coverThumbnail`. `GET /books/search` et `GET /books/:id` retournent `category` (string) au lieu d'un tableau. Correction auth.controller.
- **Paul :** Finalisation pages frontend avec composants shadcn/ui : amélioration page /profile (remplacement inputs HTML natifs par composants shadcn/ui Input/Label/Button pour harmonisation design system), transformation bouton "Ajouter un livre" en lien vers /search dans /library.

- **Christopher :** Branchement des 3 pages publiques sur l'API réelle : `/search` sur `GET /books/search`, `/book/:id` sur `GET /books/:id`, homepage sur `GET /books` (section livres aléatoires). Affichage des vraies couvertures avec fallback `default-cover.png`. Adaptation aux réponses API mises à jour par Rémi (champ `category`, auteur string). Migration de Google Fonts vers Bunny Fonts (respect RGPD). Protection de la route `/library` avec redirection vers `/login`.

---

### 19/03/2026

*Avancée significative sur l'intégration frontend-backend : auth JWT finalisée, library CRUD mergé, AuthContext créé par Paul, reviews PR #76 et #77.*

#### Infos individuelles

- **Ophélie :** Gestion des erreurs asycnhrones (validation, bdd,...) en back avec mise en place d'un wrapper async, recherches méthodes de tests automatisés.
- **Rémi :**Refactorisation de book.controller afin d'optimiser le temps de chargement des fetch et de compléter les informations manquantes nécessaires à Christopher pour cabler ça au front. Mis à jour le docker-compose et création d'un script bash puis d'un README pour optimisation du process général.
- **Paul :**
- **Christopher :** Rebase feature/api-search-integration sur main, analyse état du projet, identification blocage isbn + conflit auth cookie/localStorage, reviews PR #76 et #77. Branchement page `/library` sur l'API réelle : GET /library, PATCH /library/:id et DELETE /library/:id avec rollback optimiste, connexion AuthContext (PR #79).

---

### 20/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :** Bidouillage d'éléments pour la présentation de l'après-midi.
- **Rémi :**- **Rémi :**Refactorisation de book.controller et auth.controller afin qu'ils utilisent asyncWrapper (*donc plus besoin de try/catch*). Modification des tests et du auth.controller pour que tout fonctionne uniquement avec les cookies (*plus de localStorage*). Amélioration du auth.middleware : plus de renvoie du message de l'erreur à l'utilisateur (*plus sécurisé de cette façon*).
- **Paul :**
- **Christopher :** Merge de main dans feature/library-api-integration (conflits résolus), PR #79 mergée. Implémentation du bouton "+ Biblio" : composant `AddToLibraryButton` (page `/search`, ajout TO_READ par défaut) et composant `AddToLibraryPanel` (page `/book/:id`, sélection du statut, redirection `/login` si non connecté). Fix suite retour Rémi : isbn passé directement en prop depuis les résultats de recherche. Branchement Navbar sur l'AuthContext (affichage conditionnel + déconnexion). Composant `BookCover` avec fallback `onError` vers `default-cover.png` sur les 3 pages (homepage, search, book detail). Diagnostic setup équipe (`API_URL` manquante dans `.env.local`). Diagnostic couvertures page détail : `cover_i` absent des `fields` de `getBookById` (signalé à Rémi) — Rémi a ajouté `coverThumbnail` dans la réponse, frontend mis à jour pour l'utiliser directement. PR #83 ouverte. Reviews PR #78 et #80 approuvées.

---

### 23/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :** Passage en front, prise en main du code. Premier travail de dynamisation sur la page de profil (affichage des données personnelles) et connexion à l'API dont nouvelles routes (GET et DELETE) pour rendre les fonctionnalités fonctionnelles, ajout de services user en accord avec les nouvelles routes API Express.
- **Rémi :** Perdu un temps fou à essayer de modifier le code front pour ne plus utiliser le localStorage et passer uniquement aux cookies. Commenc" un début de responsive sur la page book:id.
- **Paul :** Installation complète de Vitest pour le backend. Création de 45 tests (33 unitaires + 12 intégration) avec 100% de succès. Configuration base de données de test (testdb) et helpers de test. Ajout routes GET /user/profile et DELETE /user. Résolution problèmes Prisma (Query Engine, credentials, migrations). Correction conflit types frontend (UpdateProfileResponse).

- **Christopher :**

---

### 24/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :** Correction de la PR #97 pour passer les tests du CI mis en place. Gestion du responsive sur les composants Nav et Footer qui bloquaient les pages. Correction du contenu dans les pages Politique de confidentialité et Mentions Légales ainsi que du responsive. Début d'affinement du responsive sur la page d'accueil (Hero et CTA), reste à faire la section sélection du moment.
- **Rémi :** Mis en place le responsive pour plusieurs pages (book:id, search, library, cgu) avec des petites modifications pour optimisation de l'UX et du visuel général.
- **Paul :** Finalisation complète des tests backend : ajout de 28 tests manquants (library.test.ts + user.test.ts), résolution problèmes d'isolation (fileParallelism: false), unification asyncWrapper sur tous les controllers, atteinte de 91% de couverture (73 tests au total). Configuration GitHub Actions CI/CD : 5 jobs séparés (lint-backend, test-backend avec PostgreSQL 17, build-backend, lint-frontend, build-frontend), Node.js 22, intégration Codecov. Mise à jour documentation complète : sprint2.md (statuts Priorités 2 et 3), guide CI/CD adapté au projet.
- **Christopher :**

---

### 25/03/2026

*Déploiement production réussi ! Application BlaBlaBook en ligne sur Neon + Render + Vercel. Reviews des PRs ouvertes, décision d'architecture pour le déploiement.*

#### Infos individuelles

- **Ophélie :** Finalisation du responsive sur la page d'accueil et gestion des encoches en version mobile sur l'en-tête des pages. Ajout d'une page 404 générale personnalisée et début de review de la sémantique et de l'accessibilité des pages (halfway done).
- **Rémi :**Fini la dernière page en responsive (register) et ajout d'un page loading.tsx à la src afin d'améliorer l'UX. Ensuite passé beaucoup de temps sur un problème que je pensais être du à Docker avant de voir le lendemain matin que c'était du à des node_modules ou au .next qui étaient corrompus (*tout supprimer et tout relancer a fini par résoudre ça*)
- **Paul :** **DÉPLOIEMENT PRODUCTION DÉBUTÉE** 🚀 Base de données Neon créée et migrée (PostgreSQL 17, région EU). Backend déployé sur Render (approche sans Dockerfile adoptée : `tsx` au lieu de `tsc` pour meilleure gestion modules ESM). Corrections techniques critiques : ajout `binaryTargets ["native", "linux-arm64-openssl-3.0.x"]` dans schema.prisma, correction tsconfig.json (`include: ["*.ts"]` pour fichiers racine), ajout `message: "Login successful"` dans auth.controller.ts (conformité tests). Configuration Render : Build Command `npm install && npx prisma generate`, Start Command `npx prisma migrate deploy && npx tsx index.ts`. Documentation déploiement mise à jour.
- **Christopher :** Review et approbation PR #94 et #107. Tests backend : fix assertions login cassées (PR #94), ajout tests GET /auth/me, singleton app, centralisation prisma.$disconnect en globalTeardown — 75/75 ✅. Tests frontend : setup Vitest + jsdom, 38 tests — 38/38 ✅. Ajout job CI `test-frontend` dans PR #118 (suite merge #107). Optimisation recherche (issue #105) : pagination server-side, cache 60s, cap 50 pages, fix NaN — PR #121. Fix `.env` racine (`FRONTEND_PORT`, `DATABASE_URL` docker, `ALLOWED_ORIGINS`) + lancement complet via `init.sh`. Mise à jour README avec structure projet.

---

### 26/03/2026

#### Infos individuelles

- **Ophélie :** audit d'accessibilité et de sémantique terminé sur toutes les pages en front. Ajout d'un alert dialog lors de la suppression d'un livre au lieu d'un simple confirm pour améliorer l'UX et l'accessibilité. Harmonisation des erreurs en back (utilisation des classes puis de l'errorHandler dans tous les cas) => modification des tests sur le middleware d'authentification pour coller aux modifications.
- **Rémi :** Corrigé mon problème docker qui n'en était pas un (*en supprimant .next et mes node_modules qui logiquement devaient être corrompus*). Repassé le code au peigne fin pour vérifier la cohérence du visuel général (c-à-d couleurs, padding, margin, :hover, :active, etc) et essayé d'harmonisé le tout autant que possible.
- **Paul :** Déploiement frontend sur Render (Vercel abandonné : plan payant obligatoire pour dépôts d'organisation privés). Résolution des erreurs de build successives : dépendances Tailwind CSS manquantes, suppression du mode `output: "standalone"` incompatible avec la config Render, démarrage via `npm run start`. Identification de la cause racine de l'absence d'appel OpenLibrary en production : variable `API_URL` manquante pour les Server Components (différente de `NEXT_PUBLIC_API_URL`). Ajout des deux variables sur Render frontend. Création du workflow GitHub Actions de déploiement continu (`deploy.yml`) avec deploy hooks Render pour backend et frontend. Documentation complète du mode opératoire de déploiement (guide adapté Render front + back).
- **Christopher :** Sync `main` + suppression branche `test/backend-frontend-vitest`. Fix 3 tests `bookService.test.ts` cassés suite PR #121 (pagination : retour `BookSearchResponse`, URL `&page=1`) — 39/39 ✅ — PR #130. Review PRs Paul : #127 ✅ OK, #128 bug `api.ts` fallback port signalé, #129 périmètre trop large signalé. Audit complet du codebase (bugs, manques fonctionnels, sécurité, UX). Série de fixes : cookies logout mal effacés — `secure`/`sameSite`/`path` manquants (PR #136) ; username absent de la réponse register + dead code localStorage 401 (PR #137) ; erreur silencieuse sur boutons "+ Biblio" — feedback visuel ajouté (PR #138) ; `currentPassword` ignoré au changement de mdp — vérification argon2 côté backend (PR #139). Tests backend ajoutés : `book.test.ts` (12 tests GET /books, /search, /:id avec mock fetch) + assertions logout cookies + 2 nouveaux cas user (currentPassword absent/incorrect).

---

### 27/03/2026

#### Infos individuelles

- **Ophélie :** Amélioration générale de l'UX avec notamment un message d'erreur plutôt que des placeholders sur la page d'accueil lorsque le fetch vers l'API ne fonctionne pas. Sur la page de recherche les genres sont coupés si trop longs avec possibilité de l'afficher en entier au survol. Indications précises avec un indicateur de force sur l'entrée du mot de passe lors de l'inscription et possibilité de cacher ou afficher le contenu des input de type password.
- **Rémi :** Refactorisation de l'ensemble du code pour utiliser le moins possible de valeurs hardcodées et pouvoir synchroniser autant que possible notre site. Préparé l'exposé de la semaine en me basant sur le carnet de bord de l'équipe.
- **Paul :** Refonte complète du guide de déploiement (12 sections mises à jour) : migration architecture Vercel → Render, documentation des deux variables d'environnement frontend (`NEXT_PUBLIC_API_URL` + `API_URL`), CI/CD simplifié avec deux deploy hooks Render, troubleshooting enrichi. Ajout endpoint `GET /health` dans le backend (test connexion Neon via `prisma.$queryRaw`, réponse `status/db/timestamp/uptime`) pour Render Health Check. Configuration du Health Check Path `/health` sur Render et création des 2 monitors UptimeRobot (backend + frontend) pour éviter le cold start du free tier.
- **Christopher :** Implémentation du rate limiting global (`express-rate-limit`) et corrections sécurité cookies (PR #140). Fix : effacement cookies au logout (#136), username manquant au register (#137), feedback visuel ajout bibliothèque (#138), vérification `currentPassword` avant mise à jour profil (#139), distinction erreur réseau vs 401 dans `AuthContext` (#141). Correction assertion 404 dans `book.test.ts` (#145).

---

### 30/03/2026

*Sprint 3 — Jour 1 : i18n setup, dark mode, fix auth Safari, cache Redis*

#### Infos individuelles

- **Ophélie :** Utilisation des variables globals.css pour mettre en place un mode sombre sur l'application avec utilisation de la librairie next-themes permettant de gérer les utilisations de thème clair/sombre de manière simplifiée. Ajout d'un switch (shadcn) pour permettre à l'utilisateur de passer d'un thème à l'autre facilement depuis le header.
- **Rémi :** Recherches sur les bonnes pratiques de l'internationalisation (i18n) et la localisation. Configuration de l'architecture `next-intl` pour le projet. Début du contenu traduit pour les pages home, nav, footer et book/:id (PR #159).
- **Paul :** Fix authentification Safari (PR `fix/auth-cookie-safari`) : proxy Next.js via `rewrites()` dans `next.config.ts` (`/api/:path*` → backend, même domaine → cookies acceptés par Safari), passage de `sameSite: "none"` à `"lax"` sur tous les cookies (`token.ts` + `auth.controller.ts`), ajout `app.set("trust proxy", 1)` derrière le proxy Render. Correction 5 tests `library.test.ts` (schéma Zod POST `/library` : `openLibraryId` optionnel + `refine` isbn‖openLibraryId). Correction 1 test `api.test.ts` (mock double fetch `/auth/refresh` sur 401). Mise à jour guide de déploiement : section troubleshooting Safari, bloc `next.config.ts` avec proxy, sécurité cookies `lax`. Mise à jour `sprint3.md` : Redis (Upstash, cache, rate limiting) et dark mode (`next-themes`). Ajout `REDIS_URL` Upstash dans Render - cache Redis validé en prod.
- **Christopher :** Rebase `fix/cleanup-expired-refresh-tokens` sur `main` + mise à jour PR #151. Cache Redis implémenté (PR #155) : `redisClient.ts` dégradation gracieuse, cache `search` TTL 1h / `getBookById` TTL 24h / `getRandomBooks` TTL 10min, `RedisStore` pour rate limiting persistant. Compte Upstash créé — cache validé en prod : 2.4s → 1.08s (×2). Tests unitaires Redis 8/8 ✅ (41/41 total). PR #156 : `onDelete: Cascade` sur `refresh_token`, `.max(2000)` description, `AuthResponse` aligné sur la vraie réponse backend. Dark mode implémenté (PR #160) : `next-themes`, `ThemeProvider` dans `layout.tsx`, composant `ThemeToggle`, intégration Navbar. 3 PRs mergées : #151 #155 #156.

---

### 31/03/2026

*Sprint 3 Jour 2 : fix backend dev (Redis/Prisma), review PR #161, adaptation pagination bibliothèque, recherche /library*

#### Infos individuelles

- **Ophélie :** Correction de contraste du mode sombre (variable --primary de la classe dark) qui se fondait trop par rapport au fond de l'application. Correction du fond du bouton "se connecter" sur la page d'accueil en mode dark responsive pour harmoniser le visuel. optimisation du chargement de l'image du hero sur la page d'accueil (propiété sizes était manquante, impérative selon la doc render) et ajout d'une peropriété priority sur celle-ci.
- **Rémi :**Terminé le contenu en/fr de toutes les pages et implémenté les composants également (du effectuer une petite modification du fichier de configuration pour cela). Ajout d'une fonctionnalité de toggle pour gérer le choix de la langue d'affichage. 
- **Paul :**
- **Christopher :** Fix démarrage backend dev (RedisStore crash, Prisma binaire, Turbopack lockfile). Review PR #161 : bug cookie refreshToken via proxy. Page `/library` : réponse paginée + recherche + pagination 16/page + harmonisation layout. Fix couvertures (upsert + BookCover `<img>` natif). `LibraryStatusContext` + `SearchBookActions` (badge "Déjà ajouté" + suppression sur `/search`). Fix dark mode + conflits ports Docker/CORS. Homepage : `HeroCTAs` conditionnel, bouton `+ Biblio`. **Algorithme de recommandation personnalisée** : profil utilisateur pondéré (genre/auteur/époque × statut × rating), scoring multi-critères 0-100, requête sérendipité anti bulle de filtre, cache Redis 30min/user, fallback aléatoire si <3 livres. **Préparation standup 01/04** : 16 propositions UX rédigées et partagées à l'équipe. PR #162.

---

### 01/04/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 27/03/2026

*Journée de travail backend intensive — audit, fixes sécurité/qualité, nouvelles fonctionnalités.*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :** Audit complet du codebase — backlog de 30+ corrections identifiées. Corrections PRs : #138 (feedback erreur "+ Biblio"), #139 (currentPassword vérifié argon2), #140 (rate limiting + cookies NODE_ENV), #145 (assertion book.test.ts). Fix ESLint `varsIgnorePattern: '^_'`. Fix homepage Docker (`--force-recreate`). Implémentation `POST /auth/refresh` (rotation token, `onDelete: Cascade`, fix path cookie) — PR #149. Branchement AuthContext + ApiClient sur refresh silencieux. Fix upsert library sur `openLibraryId`. Rebase PR #149 sur main (conflits résolus). Fix Prisma `binaryTargets` musl pour Docker Alpine. Exposition `rating`/`review` sur `GET /library` et `PATCH /library/:id` — PR #150. Purge refresh tokens expirés au login (fire & forget) + randomisation genre homepage + cap page 100 + User-Agent unifié + 400 sur id manquant — PR #151. Pagination et tri sur `GET /library` (`?page`, `?limit`, `?sort`, `?order`). **95/95 tests ✅**

---

### 02/04/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 23/03/2026

*Nouvelle répartition des tâches : GitHub Actions + tests backend + déploiement (Paul + Christopher) ; Profile page + Notes & avis (Ophélie + Rémi).*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :** Mise en place GitHub Actions CI (PR #86). Corrections TypeScript backend (PR #87) : imports cassés suite PR #84, type `req.user` aligné. Fix CI suite diagnostic (PR #89) : `DATABASE_URL` factice pour `prisma generate`, lint backend (semicolons, unused vars, ESLint config) — CI verte ✅ Backend + Frontend. Bug signalé à Rémi (login ne retourne plus les données user) et Paul (conflit export types — corrigé PR #88).

---

### 03/04/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---
