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

*Fix tests frontend bookService suite pagination PR #121. Reviews PRs Paul (#127/#128/#129).*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**Corrigé mon problème docker qui n'en était pas un (*en supprimant .next et mes node_modules qui logiquement devaient être corrompus*). Repassé le code au peigne fin pour vérifier la cohérence du visuel général (c-à-d couleurs, padding, margin, :hover, :active, etc) et essayé d'harmonisé le tout autant que possible.
- **Paul :**
- **Christopher :** Sync `main` + suppression branche `test/backend-frontend-vitest`. Fix 3 tests `bookService.test.ts` cassés suite PR #121 (pagination : retour `BookSearchResponse`, URL `&page=1`) — 39/39 ✅ — PR #130. Review PRs Paul : #127 ✅ OK, #128 bug `api.ts` fallback port signalé, #129 périmètre trop large signalé.

---

### 27/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 30/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 31/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 01/04/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

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
