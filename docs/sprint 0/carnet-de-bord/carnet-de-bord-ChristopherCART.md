# Carnet de bord — Sprint 0
**Projet :** BlaBlaBook
**Apprenant :** Christopher CART
**Formation :** CDA (Concepteur Développeur d'Applications)
**Sprint :** 0 — Conception & Documentation

---

## Objectifs du Sprint 0

Produire l'ensemble des livrables de conception avant le démarrage du développement :
- Wireframes des 6 pages de l'application (desktop + mobile)
- Diagrammes de séquence, d'activité et d'architecture
- Justification des choix techniques

---

## Suivi des séances

### Séance 1 — Cadrage du projet

**Travail réalisé :**
- Définition du périmètre fonctionnel de l'application BlaBlaBook
- Identification des User Stories prioritaires pour le MVP :
  - US-01 : Inscription
  - US-02 : Connexion
  - US-03 : Recherche de livres (Open Library API)
  - US-04 : Consultation du détail d'un livre
  - US-05 : Ajout d'un livre à la bibliothèque
  - US-06 : Suppression d'un livre
  - US-07 : Affichage de la bibliothèque (vue grille)
  - US-08 : Filtrage par statut (À lire / En cours / Lu)
  - US-09 : Authentification requise pour la bibliothèque
- Choix des 6 routes MVP : `/`, `/login`, `/register`, `/search`, `/book/:id`, `/library`
- Définition de la stack technique :
  - Frontend : Next.js + Tailwind CSS + shadcn/ui → Vercel
  - Backend : Node.js + Express → Render
  - BDD : PostgreSQL + Prisma ORM → Supabase
  - Auth : JWT + argon2 + Zod
  - Sécurité : Helmet, express-rate-limit
  - API externe : Open Library API

**Décisions prises :**
- Architecture client/serveur séparée (frontend et backend découplés)
- Authentification par JWT stocké côté client
- Utilisation de Prisma comme ORM pour la gestion de la BDD

---

### Séance 2 — Wireframes Desktop

**Travail réalisé :**
- Création des wireframes pour les 6 pages en version desktop
- Style wireframe uniforme : fond gris, hachures pour les images, bordures en tirets pour les placeholders, sections en majuscules
- Pages produites :
  - `01-home.png` — Page d'accueil (héro, livres du moment, CTA recherche)
  - `02-login.png` — Page de connexion (US-02) avec gestion des erreurs et annotations JWT
  - `03-register.png` — Page d'inscription (US-01) avec indicateur de force du mot de passe
  - `04-search.png` — Page de recherche (US-03) avec états chargement / résultats / aucun résultat
  - `05-book-detail.png` — Page détail livre (US-04) avec ajout bibliothèque et statut de lecture
  - `06-library.png` — Page bibliothèque (US-05 à US-09) avec filtres, stats, grille, modale de suppression

---

### Séance 3 — Diagrammes

**Travail réalisé :**

**Diagramme de séquence — Connexion (US-02)**
- Représentation du flux complet : Utilisateur → Frontend → Backend → BDD
- Scénarios couverts : connexion réussie (JWT généré, redirection `/library`) et échec (email/mot de passe incorrect, affichage erreur)
- Livrable : `docs/sprint 0/diagrammes/sequence-fonctionnalité/sequence-login.png`

**Diagramme d'architecture détaillée**
- Vue détaillée : composants internes de chaque couche (middlewares, routes, Prisma, Supabase, Open Library API)
- Livrable : `docs/sprint 0/4.architecture-technique.png`

**Diagramme d'activité — Ajout livre à la bibliothèque (US-05)**
- Représentation du flux utilisateur : recherche → sélection → ajout → confirmation
- Gestion des cas : livre déjà présent, utilisateur non connecté
- Livrable : `docs/sprint 0/diagrammes/activite-ajout-bibliotheque.puml` (source PlantUML)

---

### Séance 4 — Wireframes Mobile

**Travail réalisé :**
- Création des wireframes pour les 6 pages en version mobile (375px)
- Adaptation du style desktop : logo bordé + hamburger, grille 2 colonnes pour les cartes, sections empilées
- Pages produites :
  - `01-home-mobile.png` — Accueil mobile
  - `02-login-mobile.png` — Connexion mobile
  - `03-register-mobile.png` — Inscription mobile
  - `04-search-mobile.png` — Recherche mobile
  - `05-book-detail-mobile.png` — Détail livre mobile
  - `06-library-mobile.png` — Bibliothèque mobile

---

### Séance 5 — Migration des diagrammes vers PlantUML

**Travail réalisé :**
- Création des fichiers sources `.puml` (PlantUML)
- Mise en place de la config VS Code partagée via `.vscode/settings.json` (rendu via serveur PlantUML, sans Java)
- Fichiers produits :
  - `docs/sprint 0/diagrammes/sequence-login.puml`
  - `docs/sprint 0/diagrammes/activite-ajout-bibliotheque.puml`
  - `docs/sprint 0/diagrammes/architecture-application-detaillee.puml`
  - `docs/sprint 0/diagrammes/sitemap.puml`

**Décisions prises :**
- Les `.puml` sont versionnés dans git pour la collaboration en équipe
- Rendu via `PlantUMLServer` (pas de Java requis pour les coéquipiers)

---

### Séance 6 — Wireframes page Profil

**Travail réalisé :**
- Ajout d'une 7e page wireframe (desktop + mobile) : page Profil utilisateur (`/profil`)
  - Contenu : photo de profil, statistiques de lecture, formulaire infos personnelles, changement de mot de passe, zone de danger (suppression compte)
  
- Livrables produits :
  - `docs/sprint 0/wireframes/desktop/07-profile.png`
  - `docs/sprint 0/wireframes/mobile/07-profile-mobile.png`
  - Tous les PNG desktop et mobile régénérés avec style unifié

---

### Séance 7 — Sitemap

**Travail réalisé :**
- Création du sitemap PlantUML : `docs/sprint 0/diagrammes/sitemap.puml`
  - Représentation de l'arborescence frontend avec niveaux d'accès (public / authentifié)

---

### Séance 8 — Initialisation du frontend (Sprint 1)

**Travail réalisé :**

**Récupération et consolidation des livrables de l'équipe**
- Intégration locale des fichiers produits par l'équipe :
  - Maquettes desktop (7 PNG) depuis `feature/maquettes-desktop` : HomePage, Login, Register, SearchPage, BookDetails, Library, Profile
  - Maquettes mobile (4 PNG) depuis `feature/maquettes-mobile` : HomePage, Login, Register, SearchPage
  - Diagramme des use-cases depuis `feature/use-cases` : `docs/sprint 0/16.use-cases.puml`
  - Documentation base de données depuis `sprint0` : MCD, MLD, MPD, script SQL, dictionnaire de données (`docs/sprint 0/database/`)
  - Fichiers complémentaires : `13.roles-des-dev.md`, `5.choix-justification-architexture.md`, `6.liste-des-technologies.md`, `team_logbook.md`

**Initialisation du projet frontend**
- Création du projet Next.js 16 avec les options suivantes :
  - TypeScript activé
  - Tailwind CSS v4
  - ESLint
  - App Router
  - Alias d'import `@/*`
- Installation et configuration de shadcn/ui (version base-ui, compatible Tailwind v4)
- Correction de la couleur primaire dans `globals.css` pour correspondre à la charte graphique des maquettes (indigo/violet)

**Mise en place de la structure du projet**
- Création de l'arborescence des dossiers :
  - `src/app/` — pages (App Router)
  - `src/components/` — composants réutilisables
  - `src/services/` — appels API
  - `src/types/` — types TypeScript
  - `src/contexts/` — contextes React (AuthContext à venir)
  - `src/hooks/` — hooks personnalisés

**Composants de base**
- `src/components/Navbar.tsx` :
  - Logo "BlaBlaBook" (lien vers `/`)
  - Barre de recherche centrale avec redirection vers `/search?q=...`
  - Navigation contextuelle : boutons Connexion + Inscription si non connecté / liens Compte + Ma bibliothèque + Déconnexion si connecté
  - État auth commenté (`isLoggedIn = false`) en attente de l'`AuthContext`
- `src/components/Footer.tsx` :
  - Logo + tagline
  - Plan du site : Accueil, Connexion, Mon compte, Ma bibliothèque
  - Mentions légales : Politique de confidentialité, CGU, Mentions légales
  - Copyright équipe
- `src/app/layout.tsx` : layout global intégrant Navbar + Footer, metadata BlaBlaBook, langue `fr`

**Pages créées (6 routes MVP)**
- `src/app/page.tsx` — Accueil :
  - Section hero avec titre, description, CTA "Se connecter"
  - Section "Livres du moment" (grille 4 colonnes, placeholders en attente de l'API)
  - Section CTA recherche avec formulaire
- `src/app/login/page.tsx` — Connexion :
  - Formulaire carte centré : champs email + mot de passe, bouton "Se connecter"
  - Lien vers `/register`
  - `TODO` : brancher sur `POST /auth/login`
- `src/app/register/page.tsx` — Inscription :
  - Formulaire : pseudo, email, mot de passe, bouton "Créer mon compte"
  - Lien vers `/login`
  - `TODO` : brancher sur `POST /auth/register`
- `src/app/search/page.tsx` — Recherche :
  - Lecture du paramètre `?q=` depuis les `searchParams`
  - Affichage du titre de recherche et du nombre de résultats
  - `TODO` : appel `GET /books/search?q=...` et rendu de la grille
- `src/app/book/[id]/page.tsx` — Détail livre :
  - Layout deux colonnes : couverture + infos (titre, auteur, genre, description)
  - Select statut de lecture (TO_READ / READING / READ)
  - `TODO` : appel `GET /books/:id` + branchement `POST /library`
- `src/app/library/page.tsx` — Bibliothèque personnelle :
  - Statistiques 3 cards : À lire, En cours, Lus
  - Filtres par statut (Tous / À lire / En cours / Lus)
  - État vide avec lien vers la recherche
  - `TODO` : appel `GET /library`, protection de route (redirection `/login`)

**Points techniques**
- `buttonVariants` de shadcn/ui base-ui ne peut pas être appelé côté serveur (Server Components) — résolu en utilisant les classes Tailwind inline sur les `<Link>`
- `create-next-app` crée son propre `.git` dans `frontend/` — corrigé en supprimant le `.git` imbriqué et en réajoutant le dossier comme fichiers normaux
- Build Next.js validé sans erreur TypeScript ni erreur de compilation

---

### Séance 9 — Application de la charte graphique

**Travail réalisé :**
- Récupération de la charte graphique `6.Frontend-charte-graphique.md` (thème "L'Élégance Littéraire" v1.0)
- Copie de la charte dans `docs/sprint 0/6.Frontend-charte-graphique.md`

**Mise à jour de `globals.css` — couleurs**

Mode clair :
- Primary : `#3730A3` (Indigo Profond) — boutons principaux, accents
- Accent : `#D4A5A5` (Vieux Rose) — CTA, survols
- Accent Alt : `#E2725B` (Terracotta Doux) — CTA secondaires
- Background : `#F9FAFB` (Gris Perle)
- Foreground : `#1F2937` (Anthracite)
- Muted foreground : `#6B7280` (Gris Ardoise)
- Border/Input : `#E5E7EB` (Gris Clair)

Mode sombre :
- Primary : `#1E3A8A` (Bleu Nuit)
- Accent : `#A78BFA` (Rose Poussiéreux)
- Background : `#0F172A` (Noir Bleuté)
- Foreground : `#F9FAFB` (Blanc Cassé)
- Muted foreground : `#9CA3AF` (Gris Bleu)

**Mise à jour de `layout.tsx` — typographie**
- Ajout de 3 polices Google Fonts via `next/font/google` :
  - `Playfair Display` (600/700) → variable `--font-playfair` → appliquée sur `h1`, `h2`, `h3`
  - `Lora` (500) → variable `--font-lora` → disponible pour sous-titres
  - `Inter` (400) → variable `--font-sans` → corps de texte et UI
- Build validé sans erreur

---

### Séance 10 — Corrections wireframes MVP (Sprint 0 → ajustements)

**Travail réalisé :**

**Page détail livre (`05-book-detail`) — desktop + mobile**
- Suppression de la section "Avis & commentaires" (fonctionnalité hors MVP)

**Page profil (`07-profile`) — desktop + mobile**
- Suppression du bouton "Changer la photo de profil" (fonctionnalité hors MVP)
- Suppression du champ "Bio" (non prévu dans le schéma BDD)
- Suppression de l'indicateur de force du mot de passe (hors MVP)

**Lancement du frontend**
- Serveur de développement Next.js démarré sur `http://localhost:3000` pour revue visuelle

---

### Séance 11 — Ajustements UI homepage + navbar (Sprint 1)

**Travail réalisé :**

**Navbar**
- Bouton "Connexion" : bordure bleue (`border-primary`) via `cn(buttonVariants(...), "border-primary")` — nécessite `cn()` pour que `twMerge` résolve le conflit avec `border-border`
- Bouton "Inscription" : ajout d'un glow bleu (`box-shadow rgba(55,48,163,0.4)`)

**Homepage — badges et section recherche**
- Badge "Votre bibliothèque personnelle" : texte et fond terracotta (`#E2725B` / `#FBF0EE`), sans bordure
- Badge "Genre" sur les cartes livres : texte terracotta, bordure grise par défaut
- Section CTA recherche : input et bouton en `rounded-full`, bouton avec fond terracotta (`#E2725B`)

**Point technique**
- `* { @apply border-border }` dans `globals.css` écrase toutes les couleurs de bordure (classes Tailwind, inline styles)
- Solution : classes custom définies dans `@layer utilities` dans `globals.css` (`.tag-terracotta`, `.tag-terracotta-filled`)
- Pour les backgrounds de boutons : utiliser `style={{ backgroundColor }}` qui contourne le problème

---

### Séance 12 — Intégration backend + corrections wireframes desktop & mobile

**Travail réalisé :**

**Récupération du backend**
- Récupération du dossier `backend/` depuis la branche `feature/setup-backend` (coéquipier)
- Création du dossier `blablabook/` regroupant `frontend/` et `backend/`
- Structure finale : `blablabook/frontend/` + `blablabook/backend/`

**Corrections wireframes desktop**
- `02-login.png` — suppression du bouton "Afficher" sur le champ mot de passe
- `03-register.png` — ajout de la case à cocher CGU / politique de confidentialité
- `06-library.png` — suppression de la section filtres par statut
- `07-profile.png` — suppression des statistiques de lecture

**Corrections wireframes mobile (mise en cohérence)**
- `02-login-mobile.png` — suppression bouton "Afficher"
- `03-register-mobile.png` — suppression bouton "Afficher" + ajout case CGU
- `06-library-mobile.png` — suppression filtres par statut
- `07-profile-mobile.png` — suppression statistiques de lecture

---

## Bilan Sprint 0

| Livrable                               | Emplacement                                                 | Statut |
| -------------------------------------- | ----------------------------------------------------------- | ------ |
| Wireframes desktop (7 PNG)             | `docs/sprint 0/wireframes/desktop/`                         | ✅      |
| Wireframes mobile (7 PNG)              | `docs/sprint 0/wireframes/mobile/`                          | ✅      |
| Diagramme de séquence login (PNG)      | `docs/sprint 0/10.APIProcessus-de-connexion.png`            | ✅      |
| Diagramme architecture détaillée (PNG) | `docs/sprint 0/4.architecture-technique.png`                | ✅      |
| Diagramme d'activité US-05 (PlantUML)  | `docs/sprint 0/diagrammes/activite-ajout-bibliotheque.puml` | ✅      |
| Sources PlantUML (4 `.puml`)           | `docs/sprint 0/diagrammes/`                                 | ✅      |
| Schéma BDD (MCD/MLD/MPD + SQL)         | `docs/sprint 0/database/`                                   | ✅      |
| Carnet de bord                         | `docs/sprint 0/carnet-de-bord/`                             | ✅      |
| Config VS Code équipe                  | `.vscode/settings.json`                                     | ✅      |

---
