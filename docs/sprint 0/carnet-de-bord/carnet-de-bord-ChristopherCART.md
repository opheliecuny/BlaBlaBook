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
  - US-03 : Recherche de livres (Google Books API)
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
  - Auth : JWT + bcrypt + Zod
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

### Séance 13 — Relecture équipe + corrections accessibilité frontend

**Travail réalisé :**

**Prise en compte du retour de relecture (coéquipière)**
- `Button asChild` sur les `<Link>` utilisés comme boutons (HomePage hero) — cohérence shadcn/ui, accessibilité
- `<label htmlFor="..." className="sr-only">` ajouté sur le champ de recherche de la HomePage (visible uniquement par les lecteurs d'écran)
- `aria-hidden="true"` sur toutes les icônes Lucide décoratives (Navbar, HomePage)
- `aria-label="Rechercher"` sur le bouton icône de la Navbar
- `name` + `required` ajoutés sur tous les inputs des formulaires login et register — nécessaire pour `FormData` et la validation native
- `autoComplete="username"` et `autoComplete="email"` ajoutés sur le register
- `style={{ backgroundColor }}` remplacé par classe Tailwind arbitraire `bg-[#E2725B]` — bonne pratique Tailwind
- Faute de frappe "Christoper" corrigée en "Christopher" dans le Footer

**Mise à jour conventions Git**
- Lecture du guide Git & GitHub de l'équipe (ajouté dans `docs/Guide Git & GitHub/`)
- Correction : les noms de branches ne prennent plus de préfixe `sprint*` — format `feature/<description-kebab-case>`
- Les messages de commit sont en **anglais** (confirmé dans le guide)
- Stratégie de merge : Squash and merge via PR GitHub

**Organisation du travail frontend**
- Répartition des pages entre coéquipiers
- Branche dédiée créée : `feature/book-detail-page` (page `/book/[id]`)

**Page recherche `/search`** — structure complète
- Formulaire de recherche pré-rempli avec le paramètre `q`
- 3 états gérés : pas de param → invitation à chercher / param vide ou sans résultats → "Aucun résultat" / résultats → grille
- Grille de résultats : couverture (ou placeholder accessible), titre, auteur, tag genre, lien "Voir le détail" → `/book/:id`
- Point technique : `q=""` est falsy comme `undefined` — distinction via `q !== undefined` (`hasQuery`) pour différencier "pas de recherche" de "recherche vide"
- Données mockées en place — branchement `GET /books/search?q=...` en attente du backend

**Page détail livre `/book/[id]`** — structure complète
- Lien "Retour aux résultats" vers `/search`
- Couverture : image si `thumbnail` disponible, sinon placeholder avec icône accessible
- Affichage : titre, auteur, genre (tag terracotta), éditeur, année, description
- Section ajout bibliothèque conditionnelle selon `isLoggedIn` : select statut + bouton "Ajouter" si connecté, lien vers `/login` sinon
- Lien "Voir d'autres livres de [auteur]" → `/search?q=auteur`
- Accessibilité : `label sr-only` sur le select statut, `alt` sur la couverture, `aria-hidden` sur les icônes
- Données mockées en place — branchement `GET /books/:openLibraryId` en attente du backend
- `isLoggedIn = false` en dur — en attente de l'AuthContext (Ophélie)

---

### Séance 14 — Sync équipe + intégration maquette page recherche (17/03/2026)

**Travail réalisé :**

**Synchronisation avec les coéquipiers**
- `git pull origin main` — récupération des PR mergées depuis la dernière session
- Résolution d'un conflit sur `Footer.tsx` : conservation de l'orthographe correcte "Christopher" (main avait la faute "Christoper")
- Livrables récupérés :
  - Prisma initialisé par Ophélie : `schema.prisma`, `prisma.config.ts`, client partagé (`prismaClient.ts`)
  - Auth controller implémenté par Rémi : `auth.controller.ts` (register + login argon2 + JWT cookies), `token.ts`
  - Script de seed par Rémi : `src/models/seeding.ts` (alice, bob + 3 livres)
  - Pages légales par Paul : `/legal`, `/cgu`, `/privacy` + page `/profile` (structure)
  - Prettier ajouté sur le frontend, ESLint sur le backend

**Points techniques backend à corriger (Rémi)**
- `prisma` non importé dans `auth.controller.ts`
- Modèle `RefreshToken` utilisé mais absent du `schema.prisma`
- `user.role` référencé dans `token.ts` mais absent du schéma

**Intégration de la maquette — page `/search`**
- Référence visuelle : `docs/Cahier-des-Charges/6-Interface-Utilisateur/maquettes/desktop/SearchPage-Desktop.png`
- Ajustements Navbar :
  - Logo "BlaBlaBook" : `font-light text-[#374151]` (plus fin, plus foncé)
  - Suppression de la barre de recherche du header — remplacée par un lien texte "Rechercher" vers `/search`
- Page recherche reconstruite selon la maquette :
  - Formulaire centré sur la largeur de la grille (80%)
  - Bouton "Rechercher" : fond terracotta `#E2725B`, sans icône
  - Couverture manquante → image `public/default-cover.png` (copiée depuis les assets maquette)
  - Grille `max-w-[80%]` avec séparateurs `divide-x divide-y`, padding `p-8` par carte
  - Texte sous image aligné sur la largeur de l'image (`w-[82%] mx-auto`)
  - Tag + boutons poussés en bas de carte via `flex-1` + `mt-auto`
  - Bouton "+ Biblio" : fond primary, "+" en `font-black` avec `WebkitTextStroke`
  - Bouton "Voir le détail" : fond `bg-muted`, sans bordure
  - Pagination : chevrons SVG (shaft + tête) en bleu primary, texte "Précédent"/"Suivant" en noir, bordure primary englobant le tout
  - `ITEMS_PER_PAGE = 8` (2 lignes × 4 colonnes)

---

### Séance 15 — Intégration maquette page accueil (17/03/2026)

**Travail réalisé :**

**Intégration de la maquette — page `/`**
- Référence visuelle : `docs/Cahier-des-Charges/6-Interface-Utilisateur/maquettes/desktop/HomePage-Desktop.png`
- Section hero :
  - Image `book-pile.jpg` copiée depuis les assets maquette → `public/book-pile.jpg`, rendue avec `Image fill object-cover` dans un conteneur `flex-1 self-stretch`
  - Badge "Votre bibliothèque personnelle" : icône `Bookmark` (outline), couleur `#E8927A`, fond `#FBF0EE`, `font-semibold`
  - Titre "BlaBlaBook" : Playfair Display 400 (`font-normal`) — police chargée avec le poids 400 ajouté dans `layout.tsx`
  - Paragraphe hero : **Lora** (`font-lora`), `leading-tight`, `text-justify`, `text-[0.9375rem]` — police serif à interlettrage serré correspondant à la maquette
  - Boutons : "Se connecter" (gris clair + bordure `#9CA3AF`, `font-semibold`) + "Créer un compte" (terracotta, blanc, `font-semibold`)
- Section "Livres du moment" :
  - Titres des cartes : **Playfair Display** (`font-playfair font-bold text-base`) — serifs conformes à la maquette
  - Bouton "Voir le détail" : `bg-[#E5E7EB] hover:bg-[#D1D5DB]`, pleine largeur de l'image
  - Suppression du cadrillage entre les cartes (contrairement à la page search qui le conserve)
- Section CTA "Vous cherchez un livre en particulier ?" : fond `#EEF2FF`, bordure `#C7D2FE`, input `bg-white`

**Harmonisation page `/search`**
- `max-w-[80%]` → `max-w-[88%]` sur toutes les sections (homogène avec la homepage)
- Titres de livres dans les cartes : `font-playfair` ajouté
- Bouton "Voir le détail" : `bg-muted` → `bg-[#E5E7EB] hover:bg-[#D1D5DB]` (cohérence inter-pages)

**Système typographique établi**
- **Inter** : défaut global (tous les éléments UI)
- **Playfair Display** : `h1`, `h2`, `h3` (global) + logos "BlaBlaBook" + titres de livres dans les cartes
- **Lora** : paragraphe descriptif homepage uniquement
- `--font-lora` exposé dans `@theme inline` de `globals.css`

**Conventions de mise en page finalisées**
- Largeur contenu : `max-w-[88%] mx-auto`
- Alignement non-grille : `px-12` (bords images des cartes)
- Cartes : `p-12`, images `w-full rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.35)]`

---

### Séance 16 — Ajustements page recherche (17/03/2026)

**Travail réalisé :**

**Affinements visuels page `/search`**
- Padding horizontal des cartes réduit : `p-12` → `px-8 py-12` — images de couverture plus larges
- Boutons "Voir le détail" + "+ Biblio" : remplissent maintenant la pleine largeur de l'image via `grow min-w-0` (lien) + `shrink-0` (bouton) dans un conteneur `flex gap-2 w-full`

---

### Séance 17 — Intégration maquette page détail livre (18/03/2026)

**Travail réalisé :**

**Outillage**
- Installation de `gh` (GitHub CLI) sur WSL2 + authentification GitHub (device flow)
- Création de la PR #64 vers `main` pour la branche `feature/book-detail-page`

**Intégration de la maquette — page `/book/[id]`**
- Référence visuelle : `docs/Cahier-des-Charges/6-Interface-Utilisateur/maquettes/desktop/BookDetails-Desktop.png`
- Restructuration en deux colonnes :
  - **Colonne gauche** : couverture + encadré "Statut de lecture" + bouton "+ Ajouter à ma bibliothèque"
  - **Colonne droite** : tag genre → titre → auteur → métadonnées → description
- Tag genre : fond terracotta `bg-[#E2725B]`, texte blanc, `rounded-md` (radius modéré)
- Auteur : `<Link>` bleu (`text-primary`) vers `/search?q=auteur`
- Métadonnées sur une ligne : `pages | Publié en année | Langue (gras) | Éditeur` + ISBN en dessous
- Section "Description" : heading `h2` + texte simple sans fond gris
- Encadré statut : `border border-border rounded-xl shadow`, police `text-xs`, select actif (non disabled) avec options en noir
- Bouton "+ Ajouter à ma bibliothèque" : `text-[0.65rem]`, `px-5 py-2`, `whitespace-nowrap` — tient sur une ligne dans la colonne gauche
- Remplacement `<img>` par `<Image>` next/image + fallback `/default-cover.png`
- Suppression des imports `Button` (shadcn) et `BookOpen` (lucide) — non compatibles Server Component

---

### Séance 18 — Bunny Fonts + protection de route /library (18/03/2026)

**Travail réalisé :**

**Migration Google Fonts → Bunny Fonts**
- Suppression de `next/font/google` (`Playfair_Display`, `Lora`, `Inter`) dans `layout.tsx`
- Ajout d'un `<link>` Bunny Fonts dans le `<head>` : `https://fonts.bunny.net/css?family=inter:400,500,600,700|lora:500|playfair-display:400,600,700`
- Mise à jour de `globals.css` : variables `--font-sans`, `--font-playfair`, `--font-lora` définies directement en valeurs CSS (plus de `var()` alimentés par Next.js)
- Les 3 polices de la charte (Inter, Playfair Display, Lora) sont disponibles sur Bunny Fonts

**Protection de route `/library`**
- Ajout de `useEffect` + `useRouter` dans `library/page.tsx`
- Redirection vers `/login` si `isLoggedIn = false`
- `return null` pour éviter le flash du contenu avant redirection
- Commentaire `TODO` pour brancher sur `useAuth()` quand AuthContext (Ophélie) sera livré

**Correction page accueil**
- Bouton "Voir le détail" des cartes "Livres du moment" : `href="#"` → `href="/search"` (temporaire, en attente de l'API)

---

### Séance 19 — Branchement API pages search et book detail (18/03/2026)

**Travail réalisé :**

**Création de la branche `feature/api-search-integration`** depuis `main`

**Fichier `.env.local`** créé dans `blablabook/frontend/` (ignoré par git) :
- Variable `API_URL=http://localhost:3001` — port à adapter selon le `.env` du backend

**Page `/search` — branchement `GET /books/search?q=...`**
- Suppression des données mockées
- Fonction `fetchBooks()` : appel au backend avec `cache: "no-store"`, retourne `[]` si erreur
- Adaptation du format de réponse : `id` au format `/works/OL123W` → extraction de `OL123W` pour le lien `/book/[id]`
- Couverture : vérification que l'URL ne contient pas `undefined` avant usage, sinon fallback `/default-cover.png`
- `genre` retiré (absent de la réponse backend — TODO backend) → remplacé par `publishedYear`

**Page `/book/[id]` — branchement `GET /books/:openLibraryId`**
- Suppression des données mockées
- Fonction `fetchBook()` : appel au backend, retourne `null` si erreur → affiche page "Livre introuvable"
- Fonction `fetchAuthorName()` : second appel direct à Open Library `/authors/:id` pour récupérer le nom de l'auteur (backend ne le retourne pas)
- `description` géré dans les deux formats Open Library : string ou `{ value: "..." }`
- `genre` = premier élément du tableau `categories[]`
- Couverture via `https://covers.openlibrary.org/b/olid/${id}-L.jpg` (déjà autorisé dans `next.config.ts`)
- Page d'erreur 404 propre avec lien retour vers `/search`

---

### Séance 20 — Branchement API page accueil (18/03/2026)

**Travail réalisé :**

**Page `/` — branchement `GET /books`**
- Fonction `fetchRandomBooks()` : appel au backend, retourne `[]` si erreur
- `author` est un tableau dans la réponse Open Library → on prend `[0]`
- Couverture : `/default-cover.png` (le backend ne retourne pas de cover ni d'id pour les livres aléatoires)
- "Voir le détail" → `/search?q=${title}` en attendant que le backend ajoute `doc.key` dans la réponse
- Fallback : 4 cartes placeholder affichées si le backend est indisponible

**Observations sur les limites du backend (à transmettre à l'équipe)**
- `GET /books` : pas d'`id` (doc.key) ni de couverture (doc.cover_i) dans la réponse → impossible de lier vers `/book/:id` depuis la homepage
- `GET /books/:id` : pas de nom d'auteur, seulement `authorId` → second appel direct à Open Library nécessaire côté frontend (contournement)
- Ces deux points mériteraient d'être corrigés dans le backend

---

### Séance 21 — Adaptations suite aux mises à jour backend de Rémi (18/03/2026)

**Travail réalisé :**

Rémi a mis à jour le backend dans la journée. Adaptation des 3 pages en conséquence :

**`GET /books` (homepage)**
- `author` : Rémi a corrigé, maintenant string directe (plus besoin du `[0]`)
- `id` ajouté dans la réponse → lien "Voir le détail" vers `/book/:id` fonctionnel
- `coverThumbnail` ajouté → affichage des vraies couvertures (plus de fallback systématique)
- Interfaces TypeScript mises à jour : `author: string | null`, `coverThumbnail: string | null`

**`GET /books/search` et `GET /books/:id` (search et book detail)**
- `categories[]` → `category` (string unique) dans la réponse : interface `BookResult` et `BookData` mises à jour
- Usage `book.categories?.[0]` → `book.category` sur la page book detail

**Mise à jour du `team_logbook.md`**
- Remplissage des entrées Christopher des 16, 17 et 18/03 (vides depuis le début du sprint 1)
- Cherry-pick du commit directement sur `main` pour visibilité immédiate de l'équipe

**2 PRs ouvertes**
- PR #66 : `feature/bunny-fonts-and-auth-guard` — Bunny Fonts + protection `/library`
- PR #67 : `feature/api-search-integration` — branchement API des 3 pages publiques

---

### Séance 22 — Analyse état du projet + reviews PRs (19/03/2026)

**Travail réalisé :**

**Pull + rebase `feature/api-search-integration` sur `main`**
- 3 conflits résolus sur `search/page.tsx`, `book/[id]/page.tsx` et `page.tsx` — commits de fix déjà intégrés dans `main` via squash merge → écartés automatiquement

**Analyse des PRs mergées (18-19/03)**
- PR #71 (Rémi) : library controller complet — GET/POST/PATCH/DELETE `/library`
- PR #72 (Rémi) : auth controller finalisé + middleware JWT (cookie httpOnly)
- Backend complet pour le MVP

**Identification des blocages**
- AuthContext inexistant → `isLoggedIn` hardcodé partout
- `POST /library` exige `isbn` obligatoire mais aucun endpoint book ne le retourne
- Middleware lit `req.cookies?.accessToken` (PR #74) → conflit avec PR #77 de Paul (localStorage)

**Communication équipe**
- Rémi : fix isbn dans `searchBooks` + `getBookById` → PR #76
- Paul : correction PR #77 (localStorage → cookie)
- Décision actée : stratégie cookie httpOnly retenue

**Reviews soumises**
- PR #76 : 2 points signalés (format `authorId` + `description` null) → infondés après vérification
- PR #77 : conflit auth signalé → Paul corrige

---

### Séance 23 — Branchement page bibliothèque sur l'API (19/03/2026)

**Travail réalisé :**

**Création branche `feature/library-api-integration`** depuis `feature/frontend-backend-integration` (Paul)

**Page `/library` — branchement complet en 3 commits atomiques**

**Commit 1 — `GET /library`**
- Suppression des données mockées (5 livres hardcodés)
- Import `getLibrary()` depuis `libraryService` (Paul)
- Mapping `LibraryItem[]` → `DisplayBook[]` : `bookId`, `title`, `author`, `thumbnail` → `cover`, `status`
- État de chargement avec spinner

**Commit 2 — `PATCH` et `DELETE`**
- `handleStatusChange` : appel réel `updateReadingStatus(bookId, { status })` avec rollback optimiste si erreur
- `handleDeleteBook` : appel réel `deleteBookFromLibrary(bookId)` avec rollback optimiste si erreur

**Commit 3 — AuthContext**
- `useAuth()` branché : `isAuthenticated`, `authLoading`, `user`
- Protection de route : redirection `/login` si non connecté, attente de la résolution de l'auth avant fetch
- "Bonjour xxx" → `user?.username`

**PR #79 ouverte** — base : `feature/frontend-backend-integration`, reviewers : Paul, Ophélie, Rémi

---

### Séance 24 — Bouton "+ Biblio" + reviews équipe (20/03/2026)

**Travail réalisé :**

**Merge de main + résolution conflits (PR #79)**
- Merge de `origin/main` dans `feature/library-api-integration` — aucun conflit (merge automatique)
- PR #79 mergée dans main par Paul

**Reviews approuvées**
- PR #78 (Rémi — fix api controllers) : approuvée
- PR #80 (Rémi — docker compose + init.sh) : approuvée

**Nouvelle branche `feature/add-to-library-button`** depuis `main`

**Composant `AddToLibraryButton`** — page `/search`
- Client component : `useAuth()` pour vérifier la connexion
- Non connecté → `router.push("/login")`
- Connecté → fetch `GET /books/:id` pour récupérer l'isbn (absent des résultats de recherche), puis `POST /library` avec statut `TO_READ` par défaut
- Fallback isbn : `ol-${bookId}` si Open Library ne retourne pas d'isbn
- États visuels : loading (`...`) et succès (`✓ Ajouté`)

**Composant `AddToLibraryPanel`** — page `/book/:id`
- Sélection du statut (À lire / En cours / Lu) avant ajout
- Non connecté → `<Link href="/login">` à la place du bouton
- Connecté → `POST /library` avec le statut choisi
- `isbn` passé directement en prop depuis le Server Component (déjà retourné par `GET /books/:id`)
- Ajout du champ `isbn` dans l'interface `BookData` locale (manquant)

**2 commits atomiques** : `feat(search)` → `feat(book)`

**Composant `BookCover`** — fallback couverture manquante
- Création d'un composant client `BookCover.tsx` centralisé pour toutes les couvertures
- `onError` : si l'image Open Library échoue (ECONNRESET, timeout), bascule sur `/default-cover.png`
- `unoptimized={true}` pour les URLs distantes : contourne les erreurs 500 du proxy Next.js image
- `src` null → `/default-cover.png` directement
- Appliqué sur les 3 pages : homepage, `/search`, `/book/:id`

**Diagnostic couvertures page détail + fix suite retour Rémi**
- Couvertures absentes sur certains livres : `getBookById` ne retournait pas `cover_i` → URL construite manuellement depuis isbn/olid, peu fiable
- Open Library renvoie un placeholder gris (pas un 404) → `onError` ne se déclenche pas → signalé à Rémi
- Rémi a ajouté `coverThumbnail` dans la réponse de `getBookById`
- Frontend mis à jour : ajout de `coverThumbnail` dans l'interface `BookData`, suppression de la construction d'URL manuelle — `coverUrl = book.coverThumbnail ?? null`

**Diagnostic setup local**
- Mise en place de l'environnement de développement complet : docker-compose (Postgres port 5433 + Adminer port 8000), backend port 3001, frontend port 3000
- `npx prisma migrate deploy` : 4 migrations appliquées
- Diagnostic équipe : "Livres du moment" absents = `API_URL` manquante dans `blablabook/frontend/.env.local`

**PR #83 ouverte** — reviewers à désigner

**Fix `AddToLibraryButton` — isbn depuis les résultats de recherche**
- Rémi a signalé que `searchBooks` (PR #78) retourne déjà l'isbn via `fields=isbn` dans la requête Open Library
- Suppression du fetch `GET /books/:id` au clic dans `AddToLibraryButton` (inutile et coûteux)
- Ajout du champ `isbn` dans l'interface `BookResult` de la page search
- Ajout de la prop `isbn` dans `AddToLibraryButton` — passée directement depuis les résultats
- Le fallback `ol-${bookId}` reste pour les œuvres sans isbn sur Open Library

**Navbar — branchement AuthContext**
- Import `useAuth()` : `isAuthenticated` remplace `isLoggedIn = false`
- `handleLogout` : appel `POST /auth/logout` via `authService`, puis `logout()` (vide localStorage), puis `router.push("/")`
- Commit atomique `feat(navbar)` ajouté à la branche `feature/add-to-library-button`

---

### Séance 25 — GitHub Actions CI + corrections TypeScript backend (23/03/2026)

**Travail réalisé :**

**Nouvelle répartition des tâches (sprint 1 — rotation)**
- Tests backend Vitest : Paul + Christopher
- GitHub Actions CI : Paul + Christopher
- Déploiement prod : Paul + Christopher
- MVP Profile page + Notes & avis UI : Ophélie + Rémi

**Mise à jour de `main` en local**
- Pull SSH bloqué (connexion lente) — contournement via HTTPS
- Fast-forward sur 3 commits : PR #83 (Christopher), PR #84 (Rémi — refactor auth cookies), doc team logbook

**GitHub Actions CI — PR #86**
- Création de `.github/workflows/ci.yml` : 2 jobs parallèles (Backend + Frontend)
  - Backend : `prisma generate` → `npm run build` (TypeScript) → `npm run lint`
  - Frontend : `npm run build` (Next.js) → `npm run lint`
  - Déclenchement sur push et PR vers `main`
- Diagnostic CI : backend échoue → `prisma generate` manquant avant le build
- Fix : ajout du step `prisma generate` → commit `fix(ci)` atomique
- CI a également détecté des erreurs TypeScript pré-existantes dans le backend

**Corrections TypeScript backend — PR #87**
- `book.controller.ts` : import `OpenLibraryResponse` corrigé (`../../@types/express` → `../@types/index`) — fichier supprimé dans PR #84 sans mise à jour des imports
- `token.ts` : import `Token` corrigé (`../../@types/express` → `../@types/index`)
- `@types/index.d.ts` : `req.user` typé `{ id: string }` au lieu du modèle Prisma complet (le middleware ne posant que l'id) ; suppression du champ `author_name` en double dans `OpenLibraryDoc`
- `npx tsc --noEmit` : 0 erreur après corrections
- 3 commits atomiques, PR #87 mergée

**Fix CI — PR #89**
- `prisma generate` échouait en CI : Prisma 7 charge `prisma.config.ts` qui appelle `env("DATABASE_URL")` — absente en CI
- Fix : `DATABASE_URL` factice passée en env sur le seul step `generate` (pas de connexion réelle nécessaire)
- Lint backend : 3 fichiers en erreur détectés par la CI
  - `seeding.ts` : points-virgules manquants → auto-fix `eslint --fix`
  - `auth.middleware.ts` : `error` non utilisé dans catch → renommé `_error`
  - `errorHandler.ts` : `next` non utilisé → renommé `_next`
  - `eslint.config.mjs` : ajout `argsIgnorePattern: '^_'` et `caughtErrorsIgnorePattern: '^_'`
- 5 commits atomiques, PR #89 ouverte — CI verte ✅ (Backend + Frontend)

**Bug signalé à l'équipe**
- PR #84 (Rémi) : `POST /auth/login` retourne `{ message }` au lieu de `{ id, email, username }` → AuthContext non hydraté après connexion → boutons "+ Biblio" et `/library` non fonctionnels
- Frontend (Paul) : conflit d'export `UpdateProfileResponse` dans `src/types/index.ts`

---

---

### Séance 26 — Reviews PRs + décision déploiement (25/03/2026)

**Travail réalisé :**

**Pull + rebase sur main**
- Connexion SSH GitHub bloquée (timeout port 22) — contournement via HTTPS
- Rebase de `fix/ci-prisma-database-url` sur `main` : commits déjà upstream droppés automatiquement

**Review PR #94 — Fix auth frontend (Rémi)**
- Suppression du localStorage → `GET /auth/me` avec `credentials: "include"` (cookie httpOnly) : approche correcte
- `loginUser` retourne désormais `{ id, email, username }` au lieu de `{ message }` → AuthContext correctement hydraté après connexion
- Seeding corrigé : mots de passe vraiment hashés avec argon2 → `alice@example.com` / `password123` fonctionnel
- Points cosmétiques mineurs : bloc `if` vide dans `authService.ts`, newlines EOF manquantes — non bloquants
- PR approuvée ✅

**Review PR #107 — Refactor CI/CD (Paul)**
- Refactoring de 2 jobs → 5 jobs séparés : `lint-backend`, `test-backend`, `build-backend`, `lint-frontend`, `build-frontend`
- Service PostgreSQL 17 avec health check pour les tests d'intégration en CI ✅
- Node.js mis à jour 20 → 22, cache npm configuré
- Upload Codecov optionnel (`fail_ci_if_error: false`)
- Point signalé : `npm test` + `npm run test:coverage` dans `test-backend` lancent les tests deux fois — à corriger en suivi
- PR approuvée ✅ (3 approvals : Ophélie, Rémi, Christopher)

**Décision d'architecture déploiement**
- BDD prod : **Neon** (PostgreSQL) — offre gratuite sans CB requise, recommandé par Amo
- Backend : **Render** (Node.js + Express)
- Frontend : **Vercel** (Next.js) — optimisé nativement, zéro config
- Architecture cross-origin maintenue (cookies `sameSite: "none"` + `secure: true` déjà en place)

**Tests backend — optimisations**
- Fix assertions login cassées par PR #94 (`response.body.message` → `{ id, email, username }`) dans `auth.test.ts` et `user.test.ts`
- Ajout tests `GET /auth/me` (happy path + 401)
- `auth.test.ts` : migration vers `app` singleton (cohérence avec library/user)
- `library.test.ts` + `user.test.ts` : suppression `beforeAll(cleanDatabase)` redondant
- `globalTeardown` centralisé dans `tests/teardown.ts` — `prisma.$disconnect()` retiré des `afterAll` individuels
- **Résultat : 75/75 tests ✅**

**Tests frontend — setup + écriture**
- Installation Vitest + @vitest/coverage-v8 + jsdom
- `vitest.config.ts` : environment node par défaut, `@` alias, seuils couverture 80%
- `lib/utils.test.ts` : 5 tests `cn()`
- `lib/api.test.ts` : 10 tests `ApiClient` — jsdom, `vi.stubGlobal("fetch")`, branche 401 (redirect + localStorage)
- `services/authService.test.ts` : 6 tests
- `services/bookService.test.ts` : 8 tests (guard query vide inclus)
- `services/libraryService.test.ts` : 4 tests
- `services/userService.test.ts` : 5 tests
- **Résultat : 38/38 tests ✅**

**À faire ultérieurement**
- CI frontend : ajouter `npm run test:coverage` dans le workflow GitHub Actions (une fois PR #107 mergée)

---

### Séance 27 — CI frontend + Docker init.sh + README (25/03/2026)

**Travail réalisé :**

**Ajout job CI `test-frontend` — PR #118**
- Suite merge de PR #107 (CI Paul), ajout d'un job `test-frontend` dans `.github/workflows/ci.yml`
- Job calqué sur `test-backend` : lint → test:coverage → Codecov upload (`flags: frontend`)
- `build-frontend` mis à jour : `needs: [lint-frontend, test-frontend]`
- Commit ajouté sur branche `test/backend-frontend-vitest` pour livrer tout ensemble

**Fix `.env` Docker pour `init.sh`**
- Variables manquantes dans `blablabook/.env` (racine Docker) : `FRONTEND_PORT`, `PORT`, `DATABASE_URL`, `ALLOWED_ORIGINS`, `JWT_SECRET`
- `DATABASE_URL` en mode Docker utilise `@db:5432` (nom service) et non `@localhost:5433`
- `ALLOWED_ORIGINS` corrigé vers `http://localhost:3000` (frontend, non backend)
- Lancement complet via `bash init.sh` : BDD migrée + seedée, API + frontend up en Docker ✅

**Mise à jour README**
- Ajout structure du projet, instructions de lancement (Docker + manuel), lien docs

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

---

### Séance 28 — Fix tests frontend + reviews PRs (26/03/2026)

**Travail réalisé :**

**Synchronisation main**
- Pull `main` après merge PR #118 — réception des changements équipe : déploiement Neon/Render/Vercel (#126), page 404 (#125), pagination recherche (#121), responsive header/homepage
- Suppression branche `test/backend-frontend-vitest` (locale + distante) — squash merge effectué, travail intégré dans `main`

**Fix tests frontend — PR #130**
- Diagnostic : 3 tests `bookService.test.ts` échouaient suite à la PR #121 (pagination server-side) qui avait modifié `searchBooks` sans mettre à jour les tests
- Causes : retour `{ results, total, page }` au lieu de `[]` pour query vide, URL `&page=1` ajoutée, signature `page = 1` non testée
- Corrections appliquées : assertions alignées sur le nouveau type `BookSearchResponse`, ajout test paramètre `page` explicite
- **Résultat : 39/39 tests ✅**
- PR #130 ouverte, reviewers ajoutés

**Review PRs Paul (#127, #128, #129)**
- #127 (init.sh) : ✅ OK à merger — détection OS, timeout curl sur endpoint réel
- #128 (.env) : ⚠️ bug dans `api.ts` — fallback `3001` → `3000` (pointe frontend au lieu du backend) — signalé à Paul
- #129 (fix vulnérabilité Next.js 16.2.1) : ⚠️ périmètre trop large (inclut les mêmes changements que #128 + bug `api.ts`) — signalé à Paul pour scinder

---

### Séance 29 — Audit codebase + série de fixes sécurité/qualité (26/03/2026)

**Travail réalisé :**

**Audit complet du codebase**
- Analyse systématique de tous les fichiers frontend et backend
- 35 problèmes identifiés : bugs critiques, manques fonctionnels, sécurité, UX, dette technique
- Liste documentée dans `CLAUDE.md` avec cases à cocher

**PR #136 — Fix cookies logout (`fix/logout-cookie-clearing`)**
- Diagnostic : `logoutUser` effaçait les cookies sans les attributs de création (`secure`, `sameSite`, `path`)
- `refreshToken` avait `path: "/api/auth/refresh"` à la création → navigateur ne reconnaissait pas le même cookie → persistait 7 jours après déconnexion
- Fix : attributs identiques à la création dans les deux `res.cookie("...", "", {})`
- Tests ajoutés : `book.test.ts` (12 tests GET /books, /search, /:id avec mock `fetch`) + assertion cookies logout dans `auth.test.ts`

**PR #137 — Fix username register + dead code 401 (`fix/auth-register-username`)**
- `POST /auth/register` ne retournait que `{ id, email }` → username toujours fallback email dans l'AuthContext
- Fix backend : ajout `username` dans la réponse de `registerUser`
- `api.ts` handler 401 appelait `localStorage.removeItem("user")` inutilement (tokens en cookies httpOnly)
- Fix frontend : suppression du code mort, test mis à jour

**PR #138 — Feedback erreur boutons "+ Biblio" (`fix/add-to-library-error-feedback`)**
- `AddToLibraryPanel` et `AddToLibraryButton` avaient un `catch` vide → erreur invisible
- `AddToLibraryPanel` : message d'erreur rouge sous le bouton, effacé à la prochaine tentative
- `AddToLibraryButton` : bouton passe rouge avec "Erreur — réessayer" (format compact)

**PR #139 — Fix currentPassword ignoré (`fix/profile-current-password`)**
- `profile/page.tsx` collectait `currentPassword` mais ne l'envoyait jamais → changement mdp sans vérification
- Backend `user.controller.ts` : ajout `currentPassword` au schema Zod (requis si `password` fourni), vérification `argon2.verify` avant hash — 401 si incorrect
- Frontend : `currentPassword` transmis dans `updateProfile`, type `UpdateProfileRequest` mis à jour
- 2 nouveaux tests : currentPassword absent → 400, currentPassword incorrect → 401

---

### Séance 33 — Fix homepage + PR hotfix book.test.ts (27/03/2026)

**Travail réalisé :**

**Fix homepage — sélection aléatoire de livres absente**
- Symptôme : section "Livres du moment" affichait les 4 placeholders au lieu des vrais livres
- Diagnostic : `process.env.API_URL` utilisé dans le Server Component `page.tsx` mais la variable était absente du container frontend
- `docker compose config` confirmait que `API_URL: http://api:3001` était bien défini — le container était simplement stale (créé avant l'ajout de la variable)
- Fix : `docker compose up -d --force-recreate frontend` → `API_URL=http://api:3001` présent, vrais livres affichés

**PR #145 — Hotfix `book.test.ts`**
- Assertion `response.body.error` → `response.body.message` (ligne 164) cassée depuis la refacto `AppError` — squash merge n'avait pas intégré ce correctif dans `main`
- Bug affectant toute l'équipe (CI rouge sur les branches qui rebasaient depuis main)
- Fix `varsIgnorePattern: '^_'` dans `eslint.config.mjs` également inclus (root cause des lint failures CI)
- PR ouverte directement contre `main`, reviewers ajoutés

---

### Séance 34 — Fix lint CI + implémentation POST /auth/refresh (27/03/2026)

**Travail réalisé :**

**Fix lint CI — `varsIgnorePattern` ESLint**
- `argsIgnorePattern: '^_'` ne couvre que les arguments de fonction, pas les variables de destructuring (`_`, `_currentPassword`)
- Fix : ajout `varsIgnorePattern: '^_'` dans `eslint.config.mjs` → appliqué sur PR #145 et PR #140
- PRs #145 et #140 CI vertes ✅

**Implémentation `POST /auth/refresh`**
- Fix path cookie : `"/api/auth/refresh"` → `"/auth/refresh"` dans `token.ts` et `auth.controller.ts` (préfixe `/api` inexistant → cookie jamais envoyé automatiquement)
- `onDelete: Cascade` sur `refresh_token → user` dans `schema.prisma` + migration `20260327095753_add_refresh_token_cascade`
- Controller `refreshUserToken` : lecture cookie → vérification BDD + expiry → rotation (suppression ancien, génération nouveau) → nouveaux cookies
- Route `POST /auth/refresh` dans `auth.router.ts` (sans `isAuthenticated`)
- 5 tests d'intégration : token valide (200), absent (401), invalide (401), expiré (401), rotation BDD vérifiée
- **Résultat : 96/96 tests ✅**
- Branche `feature/auth-refresh-token` prête en local — push différé après démo de l'après-midi

---

### Séance 35 — AuthContext + ApiClient refresh silencieux + fix upsert library (27/03/2026)

**Travail réalisé :**

**Branchement frontend sur POST /auth/refresh**
- `AuthContext.tsx` : si `GET /auth/me` retourne 401 → appel `POST /auth/refresh` → si succès, retry `/auth/me` → session maintenue. Si refresh échoue → `user = null` (session expirée, comportement normal)
- `api.ts` (`ApiClient`) : même logique sur tous les appels API — paramètre `isRetry` pour éviter la boucle infinie. Sur 401 : refresh → rejoue la requête originale. Si refresh échoue → redirect `/login`
- Avant : tout 401 pendant la navigation → redirect login immédiat → perte de session sans possibilité de récupération

**Fix `POST /library` — upsert sur `openLibraryId`**
- Problème : upsert utilisait `isbn` comme clé unique, mais un même livre pouvait être inséré deux fois (isbn réel vs fallback `ol-xxx` généré par le frontend)
- Fix : `openLibraryId` devient la clé d'upsert (toujours présent depuis Open Library), `isbn` devient optionnel dans le schema Zod avec fallback `ol-${openLibraryId}` si absent
- Tests `library.test.ts` et `user.test.ts` mis à jour : ajout `openLibraryId` dans les payloads, test "isbn manquant" → "openLibraryId manquant", nouveau test fallback isbn
- **Résultat : 97/97 tests ✅**

### Séance 36 — Rebase + fix Prisma Docker (27/03/2026)

**Travail réalisé :**

**Rebase `feature/auth-refresh-token` sur `main`**
- `main` local mis à jour après merge des PRs #145 (fix assertion book.test.ts) et #140 (rate limiting + cookies NODE_ENV)
- Rebase effectué — 5 conflits résolus manuellement : `token.ts`, `auth.controller.ts`, `auth.router.ts`, `auth.test.ts`, `token.test.ts`
- Stratégie : conserver les améliorations de #140 (cookies dynamiques `secure`/`sameSite` selon `NODE_ENV`) + notre fix (path `/auth/refresh` au lieu de `/api/auth/refresh`) + notre nouvelle route `POST /auth/refresh`
- `npm install` requis pour `express-rate-limit` (nouveau package de #140)
- **Résultat : 97/97 tests ✅**

**Fix Prisma binaryTargets — API Docker Alpine**
- Symptôme : sélection aléatoire de livres disparue, API ne répondait plus
- Cause : la migration `onDelete: Cascade` a déclenché `prisma generate` localement pour debian, mais le container Docker utilise Alpine (musl) — binaire absent → crash au démarrage
- Fix : ajout de `linux-musl-openssl-3.0.x` dans `binaryTargets` de `schema.prisma`, `prisma generate` relancé, `docker compose restart api`
- Commit : `fix(prisma): add linux-musl-openssl-3.0.x to binaryTargets for Docker Alpine`
- Documentation ajoutée dans `CLAUDE.md` pour éviter la récurrence

### Séance 37 — Ouverture PR #149 (27/03/2026)

**Travail réalisé :**
- Push de la branche `feature/auth-refresh-token` sur le dépôt distant
- PR #149 ouverte : `feat: implémenter POST /auth/refresh avec rotation de token`
- Reviewers ajoutés : Rémi, Ophélie, Paul

### Séance 30 — Nouvelles fonctionnalités backend + corrections qualité (27/03/2026)

**Travail réalisé :**

**PR #149 — `POST /auth/refresh` (rotation de token)**
- Nouveau endpoint avec rotation complète : ancien token supprimé, nouveau généré + stocké
- `onDelete: Cascade` ajouté sur `refresh_token → user` (migration Prisma)
- Fix path cookie : `/api/auth/refresh` → `/auth/refresh`
- Branchement `AuthContext.tsx` : 401 sur `/auth/me` → refresh silencieux → retry
- Branchement `ApiClient` (`api.ts`) : paramètre `isRetry` pour éviter boucle infinie, retry auto sur 401
- Fix upsert `POST /library` : `openLibraryId` comme clé stable au lieu d'`isbn`
- Fix `binaryTargets` Prisma : ajout `linux-musl-openssl-3.0.x` pour Docker Alpine
- 5 tests d'intégration `POST /auth/refresh` ✅

**PR #150 — Rating & review sur `GET /library` et `PATCH /library/:id`**
- `GET /library` : expose `rating`, `review`, `bookId`
- `PATCH /library/:id` : renommé `updateLibraryItem`, accepte `status?`, `rating?` (1-5), `review?` (max 2000)
- +5 tests (rating, review, combiné, hors limites, GET avec null)

**PR #151 — Fixes qualité backend multiples**
- Purge des refresh tokens expirés de tous les utilisateurs au login (fire & forget) + 2 tests
- `getRandomBooks` : genre aléatoire parmi 10 genres au lieu de toujours "novel"
- `searchBooks` : page cappée à 100 max
- `getBookById` : `return;` silencieux → `throw new BadRequestError()`
- User-Agent unifié sur toutes les requêtes Open Library : `BlaBlaBook/1.0 (contact@blablabook.fr)`
- Pagination + tri sur `GET /library` : `?page`, `?limit` (max 100), `?sort` (createdAt/updatedAt/title), `?order`
- Réponse `GET /library` : `{ data, total, page, limit, totalPages }` au lieu d'un tableau brut
- **95/95 tests ✅**

---

### Séance 31 — Sprint 3 Jour 1 : rebase + PR #151 en review (30/03/2026)

**Travail réalisé :**

**Intégration des nouveaux commits de l'équipe**
- `git fetch` → 4 nouveaux commits sur `main` depuis vendredi : sprint3.md (planning 4 jours), fix `/health` exempté du rate limiting (PR #154), endpoint `/health` Render + UptimeRobot (PR #153), UX improvements (PR #147 : mdp register amélioré, noms de catégories tronqués, messages d'erreur homepage)
- Lecture du planning sprint 3 : Jour 1 = notes/avis, Jour 2 = i18n, Jour 3 = i18n + Redis, Jour 4 = toasts + finitions

**Rebase et mise à jour PR #151**
- Rebase de `fix/cleanup-expired-refresh-tokens` sur `origin/main` — 5 commits réappliqués sans conflit
- Force push sécurisé (`--force-with-lease`) vers la remote
- Mise à jour de la description PR #151 avec détail de chaque changement + instructions de test
- Ajout des 3 reviewers (Rémi, Ophélie, Paul)
- PR #151 en attente de review
- **95/95 tests ✅**

---

### Séance 31 — Sprint 3 Jour 1 : rebase PR #151 + cache Redis (30/03/2026)

**Travail réalisé :**

**Intégration sprint 3 + rebase PR #151**
- `git fetch` → 4 nouveaux commits sur `main` depuis vendredi : planning sprint 3 (4 jours), fix `/health` exempté du rate limiting (PR #154), endpoint `/health` Render + UptimeRobot (PR #153), UX improvements (PR #147)
- Lecture du planning sprint 3 : Jour 1 = notes/avis (Rémi + Ophélie), Jour 2 = i18n (Paul + Rémi), Jour 3 = i18n + Redis, Jour 4 = mode nuit + toasts + finitions
- Rebase de `fix/cleanup-expired-refresh-tokens` sur `origin/main` — 5 commits réappliqués sans conflit, force push `--force-with-lease`
- Mise à jour description PR #151 + ajout reviewers (Rémi, Ophélie, Paul)

**PR #155 — Cache Redis (Open Library + rate limiting persistant)**
- Création de la branche `feature/redis-cache` depuis `main`
- Installation `ioredis` + `rate-limit-redis`
- `src/utils/redisClient.ts` : client ioredis avec dégradation gracieuse — si `REDIS_URL` absent ou Redis down, l'app continue sans cache ni erreur. Helpers `cacheGet` / `cacheSet` silencieux.
- `book.controller.ts` : cache sur les 3 endpoints Open Library :
  - `searchBooks` → clé `search:{query}:{page}`, TTL 1h
  - `getBookById` → clé `book:{id}`, TTL 24h (données stables)
  - `getRandomBooks` → clé `random:novel:{page}`, TTL 10min
- `rateLimit.middleware.ts` : migration vers `RedisStore` avec préfixes distincts (`rl:global:`, `rl:auth:`, `rl:search:`), fallback automatique sur store mémoire si Redis absent
- `.env.example` : ajout `REDIS_URL` commenté
- Création compte Upstash (free tier, région EU-West-1), base Redis `blablabook`, connexion testée ✅
- `REDIS_URL` ajoutée dans `.env` local
- 33/33 tests unitaires ✅, zéro erreur TypeScript
- PR #155 créée, reviewers ajoutés

**Découverte en cours de séance**
- `AlertDialog` et toasts Sonner déjà implémentés dans `library/page.tsx` par l'équipe — ces items du backlog peuvent être cochés

**Tests unitaires Redis + validation production**
- 8 tests unitaires pour `redisClient.ts` : 2 scénarios (sans/avec `REDIS_URL`), couverture complète de `cacheGet` et `cacheSet` — cache hit/miss, dégradation gracieuse sur erreur Redis, TTL correct
- Problème de mock résolu : `vi.fn().mockImplementation()` ne supporte pas `new` → remplacé par une classe mock + `vi.doMock` + `vi.resetModules`
- 41/41 tests unitaires ✅

**Validation cache en production**
- Paul a ajouté `REDIS_URL` dans les variables d'environnement Render, rebuild déclenché
- Test sur `GET /books/search?q=tolkien` : 1er appel 2.4s (Open Library), 2ème appel 1.08s (cache Redis) — **2x plus rapide**

**PR #156 — Corrections backend/frontend**
- `onDelete: Cascade` sur `refresh_token → user` + migration SQL (`20260330093000_refresh_token_cascade_delete`)
- `.max(2000)` sur le champ `description` dans `addBookToLibrary` (Zod)
- `AuthResponse` frontend aligné : suppression des faux champs `accessToken`/`refreshToken` (tokens dans cookies httpOnly, pas dans le body)
- Audit backlog : 4 items supplémentaires identifiés comme déjà corrigés (`req.user` typé, import Prisma intentionnel, `getProfile()` correct, cookies `secure` conditionnels)

---

### Séance 32 — Sprint 3 Jour 2 : fixes dev, pagination et harmonisation bibliothèque, améliorations homepage (31/03/2026)

**Travail réalisé :**

**Fix backend démarrage en dev**
- `RedisStore` crashait au démarrage : `enableOfflineQueue: false` dans `redisClient.ts` rejetait les commandes envoyées par le constructeur de `RedisStore` avant que la connexion TCP Upstash soit établie. Fix en deux étapes : suppression de `enableOfflineQueue: false` dans `redisClient.ts`, puis désactivation de `RedisStore` en dev dans `rateLimit.middleware.ts` (`!isProduction → undefined`). En dev, le store mémoire est suffisant.
- Fix Prisma : `generated/prisma/internal/` appartenait à `root` (généré via Docker) → `sudo chown` + `npx prisma generate` pour créer le binaire `debian-openssl-3.0.x` pour WSL2.
- Fix Turbopack : `package-lock.json` non commité à la racine du repo perturbait la détection du workspace root → supprimé.

**Review PR #161 (fix auth Safari — Paul)**
- Proxy Next.js `rewrites()` : solution correcte pour les cookies cross-site bloqués par Safari.
- Point bloquant identifié : cookie `refreshToken` posé avec `path: "/auth/refresh"` côté backend. Via le proxy, le navigateur appelle `/api/auth/refresh` → path ne correspond pas → le cookie n'est jamais envoyé pour le refresh de session. Fix recommandé : `path: process.env.NODE_ENV === "production" ? "/api/auth/refresh" : "/auth/refresh"` dans `token.ts` et `auth.controller.ts`.

**Adaptation page `/library` à la nouvelle réponse paginée**
- `GET /library` retourne désormais `{ data, total, page, totalPages }` (PR #151) au lieu d'un tableau brut.
- `libraryService.ts` : `getLibrary()` typé sur `PaginatedLibraryResponse`, passe `limit=100` pour récupérer tous les livres en une requête.
- `types/library.ts` : ajout du type `PaginatedLibraryResponse`.

**Ajout de la recherche dans la bibliothèque**
- `library/page.tsx` : barre de recherche (Input + icône Search + bouton X pour effacer) entre les stats et les filtres.
- Filtre client-side sur titre et auteur (normalisation toLowerCase).
- `EmptyState` différencié : "Aucun livre ne correspond à votre recherche" si des livres existent mais ne matchent pas, vs "Aucun livre dans cette catégorie + lien Explorer" si la liste est vide.

**Pagination et harmonisation layout page `/library`**
- Pagination client-side : 16 livres par page (même constante que la page recherche), même style de navigation (boutons Précédent/Suivant avec flèches SVG, "Page X / Y").
- Harmonisation visuelle : grid identique à `/search` (`divide-y divide-border/50`), `px-4 py-6 sm:px-8 sm:py-12` par carte, `BookCover` avec `w-full aspect-[2/3] object-cover`, titres en `font-playfair`.
- `handleFilterChange` et `handleSearchChange` remettent la page à 1 à chaque changement.

**Fix couvertures manquantes en bibliothèque**
- Analyse root cause : le backend upsert utilisait `update: {}` → un livre ajouté une première fois sans thumbnail gardait `thumbnail: null` en base pour toujours, même si re-ajouté avec une cover disponible.
- Backend fix (`library.controller.ts`) : `update: thumbnailUpdate` — si le client envoie un thumbnail lors de l'ajout, il est maintenant sauvegardé même si le livre existe déjà.
- Fallback OLID testé puis retiré : `https://covers.openlibrary.org/b/olid/${openLibraryId}-M.jpg` retournait un pixel transparent pour les work IDs (`OL...W`) sans déclencher `onError`, cachant le default cover.
- Fix final `BookCover.tsx` : utilise un `<img>` natif pour les URLs externes au lieu de `next/image` avec `unoptimized={true}`. `next/image` avait des différences de rendu SSR vs CSR qui empêchaient l'affichage sur les pages Client Components (bibliothèque). Les images locales (`/default-cover.png`) continuent d'utiliser `next/image` pour l'optimisation.
- Vérification en base : 80 livres en bibliothèque, 2 sans thumbnail — ces livres n'ont réellement pas de couverture sur Open Library (éditions obscures, pages auteur).

**Améliorations homepage**
- `HeroCTAs.tsx` (Client Component) : boutons hero conditionaux — connecté → "Ma bibliothèque" + "Rechercher un livre", déconnecté → "Se connecter" + "Créer un compte". Utilise `useAuth()` + `useTranslations`.
- `HomepageAddButton.tsx` (Client Component) : bouton `+ Biblio` sur les cartes livres de la homepage, affiché uniquement pour les utilisateurs connectés.
- `page.tsx` (homepage) : intègre `HeroCTAs` et `HomepageAddButton`. Boutons "Voir le détail" et "+ Biblio" sur la même ligne (`flex flex-col lg:flex-row`).
- i18n : ajout des clés `hero.libraryCta` et `hero.searchCta` dans les fichiers `messages/fr/home.json` et `messages/en/home.json`.

**Détection livres déjà en bibliothèque sur la page recherche**
- `LibraryStatusContext.tsx` : charge la liste des `openLibraryId` de la bibliothèque au démarrage (quand authentifié). Expose `libraryIds` (Set), `bookIdMap` (Map openLibraryId → bookUUID), `addLocal`/`removeLocal` pour les mises à jour optimistes.
- `AddToLibraryButton.tsx` : utilise le contexte, affiche "✓ Déjà ajouté" (badge vert) si le livre est déjà en bibliothèque.
- `SearchBookActions.tsx` : remplace `AddToLibraryButton` sur `/search`. Quand le livre est en bibliothèque : badge "✓ Déjà ajouté" + icône poubelle avec `AlertDialog` de confirmation. Après suppression, le bouton `+ Biblio` réapparaît.
- Synchronisation page `/library` : `handleDeleteBook` appelle `removeLocal` pour mettre à jour le contexte après suppression.

**Fix contraste dark mode — bouton supprimer bibliothèque**
- Le bouton poubelle sur les cartes de la page `/library` utilisait `bg-white` sans variante dark → icône gris clair invisible sur fond blanc. Fix : `bg-white dark:bg-gray-700` + `text-gray-600 dark:text-gray-200` pour la poubelle.

**Fix conflits ports Docker / dev local**
- Les containers Docker (`blablabook-api-1`, `blablabook-frontend-1`) occupaient les ports 3000 et 3001, empêchant les serveurs dev locaux de démarrer correctement. Le backend Docker (avec l'ancien CORS) répondait aux requêtes au lieu du process local.
- Fix CORS : `ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002` dans `.env` backend + `config.ts` modifié pour splitter par virgule (support multi-origines).
- Procédure documentée dans `CLAUDE.md` : toujours `docker stop` les containers avant de lancer les serveurs dev.

**Algorithme de recommandation personnalisée — homepage**
- `recommendation.ts` (~200 lignes) : moteur de recommandation hybride content-based weighted scoring.
  - Phase 1 — Profil utilisateur : extraction des préférences genre/auteur/époque depuis la bibliothèque, pondérées par statut de lecture (READING ×1.5, READ ×1.0, TO_READ ×0.5) et rating (multiplicateur note/5).
  - Phase 2 — Requêtes ciblées : top 2 genres + top 1 auteur + 1 genre "sérendipité" (hors préférences, anti bulle de filtre) → 4 requêtes Open Library en parallèle (~32 candidats).
  - Phase 3 — Scoring multi-critères (0-100 pts) : genre match (0-35), auteur match (0-25), époque match (0-15), nouveauté (0-10), couverture (0-5), popularité (0-5), sérendipité (0-5).
  - Phase 4 — Filtrage : exclusion livres déjà en bibliothèque + sans couverture, déduplication, tri par score, sélection top 4.
  - Phase 5 — Cache Redis : clé `reco:{userId}:{bucket30min}`, TTL 30 min.
- `optionalAuth` middleware (`auth.middleware.ts`) : comme `isAuthenticated` mais sans erreur 401 → la route `GET /books` accepte les utilisateurs connectés ET non connectés.
- `book.controller.ts` : `getRandomBooks` branche vers `getPersonalizedBooks` si utilisateur authentifié avec ≥3 livres, sinon fallback silencieux sur la sélection aléatoire.
- `book.router.ts` : `optionalAuth` ajouté sur `GET /books`.
- `page.tsx` (frontend) : le Server Component transmet le cookie `accessToken` dans le fetch vers `/books` pour que le backend identifie l'utilisateur.
- Validation : avec cookie → recommandations personnalisées (Asimov, Borges, Morrison, Baum pour un profil Fiction/Fantasy), sans cookie → aléatoire (Twain, Chesterton, Childers).

**Préparation standup 01/04 — propositions UX**
- Rédaction de 16 propositions d'améliorations UX organisées par page (homepage, recherche, bibliothèque, fiche livre, UX globale).
- Fichier `docs/Point Projet/propositions-ux-sprint3.md` partagé à l'équipe pour prise de connaissance avant la réunion.
- Points clés : remplacement auto cartes homepage, bouton rafraîchir, skeleton loading recherche, tri/filtre bibliothèque, mode liste/grille, stats enrichies, autocomplete, "Vous aimerez aussi", partage livre.

**PR #162 — feat: cache Redis, pagination bibliothèque, améliorations homepage, recommandations**
- Regroupe toutes les modifications de la séance dans une PR unique.
- Reviewers ajoutés : Rémi, Ophélie, Paul.

---

### Séance 33 — 01/04/2026

**Standup équipe**
- Préparation et présentation du point d'équipe journalier.
- Discussion des 16 propositions UX pour le sprint 3 (`docs/Point Projet/propositions-ux-sprint3.md`).
- 11 points validés par l'équipe, 5 refusés (#1, #4 déjà fait, #7, #8, #15). Points 12 et 13 assignés à Ophélie (page détail livre).
- Priorisation et estimation des temps de mise en œuvre.

**Rebase main + résolution de conflits**
- Pull avec rebase pour intégrer les commits de l'équipe (i18n Rémi, dark mode fixes, deploy fixes).
- Résolution de 2 conflits : `redisClient.ts` (config Redis prod) et `page.tsx` homepage (HeroCTAs vs liens statiques i18n).

**Point #3 — Label "Sélection personnalisée" homepage**
- Ajout des clés i18n `section.moment.subtitlePersonalized` (fr + en).
- Lecture du cookie `accessToken` côté serveur pour conditionner le texte.
- Refactoring : `fetchRandomBooks` reçoit le token en paramètre pour éviter le double appel à `cookies()`.
- Résultat : "SÉLECTION ALÉATOIRE" (déconnecté) / "SÉLECTION PERSONNALISÉE" (connecté).

**Point #6 — Sélecteur de tri visible page `/library`**
- Ajout d'un sélecteur de tri sur la même ligne que la barre de recherche : Date d'ajout (défaut), Titre A→Z, Auteur A→Z.
- Bouton d'inversion de l'ordre (asc/desc) pour tri titre et auteur.
- Tri côté client sur les données déjà chargées (pas de nouvel appel API).
- Fix type `onValueChange` (base-ui accepte `null`) + fix affichage labels français dans le `SelectValue`.

**Mise à jour CLAUDE.md**
- Ajout section i18n (Rémi) : `next-intl`, fichiers de traduction `messages/fr/` et `messages/en/`, règle de toujours mettre à jour les deux fichiers.

**PR #172 — fix: nettoyage backlog + tests sécurité**
Branche `fix/backlog-cleanup`. Corrige les 3 derniers items du backlog d'audit et ajoute les tests de sécurité.

- **AuthContext** : `authError` passe de `boolean` à `"network" | "expired" | null`. Ajout de `retryAuth()` pour re-vérifier la session sans recharger la page. `/library` utilise `retryAuth` au lieu de `window.location.reload()`.
- **Validation mdp backend** : alignement sur les règles frontend — ajout `.regex(/[0-9]/)` (chiffre) et `.regex(/[^a-zA-Z0-9]/)` (caractère spécial) dans le schéma Zod de `registerUser`.
- **Hook `useAddToLibrary`** : extraction de la logique dupliquée entre `AddToLibraryButton` et `AddToLibraryPanel` dans `hooks/useAddToLibrary.ts`.
- **Tests sécurité** : `security.test.ts` (10 tests) — validation mdp renforcée, XSS sanitization, headers Helmet, auth edge cases (JWT malformé, mauvaise clé). Mise à jour de tous les mots de passe de test (`Password123` → `Test@1234`). Ajout xssSanitizer + helmetMiddleware dans `testServer.ts`. Total : 123 tests backend ✅.
- **Audit backlog** : mise à jour de tous les items cochés par les coéquipiers (cookies conditionnels, validation mdp client, CSRF, TODOs profile, `.max(2000)` description, accessibilité PR #132, loading.tsx Rémi, cache Redis, login/register/profile connectés API).

**Point #16 — Toast de bienvenue après connexion**
- Flag `sessionStorage("just_logged_in")` posé au login, consommé sur `/library` après chargement des données.
- Toast Sonner : "Bienvenue {username} — {n} livres dans votre bibliothèque". Apparaît une seule fois par session de connexion.

**Préparation point Amo #3 (vendredi 03/04)**
- Rédaction `docs/Point Projet/point-projet-3.md` — structure 7 slides, ~7-8 min.
- Contenu : état prod, 11 améliorations UX, algo de recommandation, cache Redis, audit qualité 39/40, 162 tests, travail d'équipe.
- Prompt PowerPoint préparé pour génération via Claude (claude.ai).

**Rebase main (2e de la journée)**
- Rebase sur les derniers commits de l'équipe (19 commits). Résolution de conflits dans `library/page.tsx` (i18n + pagination + dark mode + AuthContext + welcome toast), `search/page.tsx` (i18n + SearchBookActions), `AddToLibraryButton.tsx` (i18n + useAddToLibrary + LibraryStatusContext), `AddToLibraryPanel.tsx` (i18n + useAddToLibrary).
- Ajout clés i18n manquantes : `emptySearch`, `alreadyAdded`, `welcomeToast` (fr + en).

**Point #11 — Onboarding bibliothèque vide**
- Écran illustré quand la bibliothèque est vide : icône Library dans un cercle primary, titre, description, CTA "Découvrir des livres" vers `/search`.
- Stats, recherche, tri et filtres masqués quand `books.length === 0` (pas pertinents sans livres).
- Le petit `EmptyState` existant reste pour le cas "recherche sans résultat" (`hasBooks=true`).
- Clés i18n `onboardingTitle`, `onboardingDescription`, `onboardingCta` (fr + en).
