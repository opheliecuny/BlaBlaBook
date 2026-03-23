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
- 3 commits atomiques, PR #87 ouverte

**Bug signalé à l'équipe**
- PR #84 (Rémi) : `POST /auth/login` retourne `{ message }` au lieu de `{ id, email, username }` → AuthContext non hydraté après connexion → boutons "+ Biblio" et `/library` non fonctionnels
- Frontend (Paul) : conflit d'export `UpdateProfileResponse` dans `src/types/index.ts`

---

## Bilan Sprint 0

| Livrable | Emplacement | Statut |
|---|---|---|
| Wireframes desktop (7 PNG) | `docs/sprint 0/wireframes/desktop/` | ✅ |
| Wireframes mobile (7 PNG) | `docs/sprint 0/wireframes/mobile/` | ✅ |
| Diagramme de séquence login (PNG) | `docs/sprint 0/10.APIProcessus-de-connexion.png` | ✅ |
| Diagramme architecture détaillée (PNG) | `docs/sprint 0/4.architecture-technique.png` | ✅ |
| Diagramme d'activité US-05 (PlantUML) | `docs/sprint 0/diagrammes/activite-ajout-bibliotheque.puml` | ✅ |
| Sources PlantUML (4 `.puml`) | `docs/sprint 0/diagrammes/` | ✅ |
| Schéma BDD (MCD/MLD/MPD + SQL) | `docs/sprint 0/database/` | ✅ |
| Carnet de bord | `docs/sprint 0/carnet-de-bord/` | ✅ |
| Config VS Code équipe | `.vscode/settings.json` | ✅ |

---
