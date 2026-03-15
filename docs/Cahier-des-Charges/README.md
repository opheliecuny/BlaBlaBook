# Cahier des Charges - BlaBlaBook

**Projet** : BlaBlaBook - Application de gestion de bibliothèque personnelle
**Formation** : CDA (Concepteur Développeur d'Applications)
**Équipe** : Christopher CART, Ophélie, Paul, Rémi
**Version** : Sprint 0 - Documentation complète
**Dernière mise à jour** : 15 mars 2026

---

## 📂 Organisation du Cahier des Charges

Ce dossier contient l'ensemble de la documentation technique et fonctionnelle du projet BlaBlaBook, organisée en **8 catégories thématiques**.

---

## 🗂️ Structure des Dossiers

### 1️⃣ **Presentation** - Vision Globale du Projet

Présentation générale, définition des besoins et identification de la cible.

📁 Fichiers :

- `1.presentation-projet.md` - Présentation générale de BlaBlaBook
- `2.besoins-et-objectifs.md` - Définition des besoins utilisateurs et objectifs du projet
- `3.cible-du-projet.md` - Identification de la cible (utilisateurs)

---

### 2️⃣ **Fonctionnalites** - Spécifications Fonctionnelles

MVP, user stories, use cases et backlog produit.

📁 Fichiers :

- `1.MVP-fonctionnalites.md` - Définition du Minimum Viable Product
- `2.user-stories.md` - User stories détaillées (US-01 à US-13)
- `3.use-cases.puml` - Diagramme des cas d'utilisation (PlantUML)
- `4.backlog-items.md` - Backlog produit complet

---

### 3️⃣ **Architecture-Technique** - Choix Techniques et Diagrammes

Stack technique, justifications architecturales et diagrammes système.

📁 Fichiers :

- `1.choix-et-justifications.md` - Justification des choix architecturaux
- `2.stack-technologies.md` - Liste des technologies utilisées (Next.js, Express, PostgreSQL, etc.)
- `3.schema-architecture.png` - Schéma simplifié de l'architecture
- `4.arborescence-application.md` - Structure des dossiers du projet

📁 Sous-dossier : **diagrammes/**

- `architecture-detaillee.puml` / `.png` - Architecture détaillée (PlantUML)
- `architecture-simple.png` - Vue d'ensemble simplifiée
- `sequence-login.puml` / `.png` / `.md` - Diagramme de séquence - Connexion (US-02)
- `activite-ajout-bibliotheque.puml` - Diagramme d'activité - Ajout livre (US-05)
- `sitemap.puml` - Plan du site / arborescence frontend
- `justification-architecture.md` - Justifications détaillées des choix

---

### 4️⃣ **Base-de-Donnees** - Modélisation des Données

Modèles conceptuel, logique, physique et script SQL.

📁 Fichiers :

- `1.MCD.md` / `1.MCD-Mocodo.svg` - Modèle Conceptuel de Données + diagramme
- `2.MLD.md` / `2.MLD-drawio.svg` - Modèle Logique de Données + diagramme
- `3.MPD.md` - Modèle Physique de Données (script SQL documenté)
- `4.create-tables.sql` - Script SQL exécutable (PostgreSQL)
- `5.dictionnaire-de-donnees.md` - Dictionnaire de données complet

**Tables** : `user`, `book`, `library_item`
**Enum** : `ReadingStatus` (TO_READ, READING, READ)

---

### 5️⃣ **API-Backend** - Documentation de l'API REST

Routes, endpoints et processus métier.

📁 Fichiers :

- `1.liste-des-routes.md` - Liste exhaustive des routes API (Auth, Books, Library, User)
- `2.processus-connexion.png` - Schéma du processus d'authentification JWT

**API Backend** : Express.js + Prisma ORM + PostgreSQL
**API Externe** : Open Library API (recherche et métadonnées de livres)

---

### 6️⃣ **Interface-Utilisateur** - UI/UX Design

Charte graphique, navigateurs compatibles, wireframes et maquettes.

📁 Fichiers :

- `1.navigateurs-compatibles.md` - Navigateurs et versions supportés
- `2.charte-graphique.md` - "L'Élégance Littéraire" - Palette, typographie, composants

📁 Sous-dossiers :

- **wireframes/** - Wireframes basse fidélité (desktop + mobile, 7 pages)
- **maquettes/** - Maquettes haute fidélité (desktop + mobile, 9 pages)
  - `assets/` - Ressources graphiques (`default-cover.png`, `book-pile.jpg`)

**Thème** : Sobre, moderne, littéraire
**Framework UI** : shadcn/ui + Tailwind CSS v4

---

### 7️⃣ **Securite-et-Risques** - Analyse de Sécurité

Identification et mitigation des risques (OWASP, RGPD).

📁 Fichiers :

- `1.analyse-des-risques.md` - Analyse complète des risques (techniques, sécurité, réglementaires)

**Outils de sécurité** : argon2, JWT, Zod, Helmet, express-rate-limit

---

### 8️⃣ **Organisation-Equipe** - Gestion de Projet

Rôles, responsabilités et organisation de l'équipe.

📁 Fichiers :

- `1.roles-des-developpeurs.md` - Rôles et responsabilités de chaque développeur

---

## 🛠️ Technologies Utilisées

| Couche               | Technologies                                       |
| -------------------- | -------------------------------------------------- |
| **Frontend**         | Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui |
| **Backend**          | Node.js, Express, Prisma ORM, Zod                  |
| **Base de données**  | PostgreSQL (via Supabase)                          |
| **Authentification** | JWT + argon2                                       |
| **API Externe**      | Open Library API                                   |
| **Déploiement**      | Vercel (frontend), Render (backend)                |
| **DevOps**           | Docker, GitHub Actions                             |

---

## 📊 Statistiques du Projet

- **Pages documentées** : 70+ fichiers
- **User Stories** : 13 US (US-01 à US-13)
- **Routes API** : 15 endpoints
- **Tables BDD** : 3 tables (User, Book, LibraryItem)
- **Wireframes** : 7 pages × 2 versions (desktop/mobile)
- **Maquettes** : 9 pages × 2 versions (desktop/mobile)

---

## 🚀 Navigation Rapide

| Je veux...                | Aller dans...                                           |
| ------------------------- | ------------------------------------------------------- |
| Comprendre le projet      | `1-Presentation/`                                       |
| Voir les fonctionnalités  | `2-Fonctionnalites/2.user-stories.md`                   |
| Comprendre l'architecture | `3-Architecture-Technique/1.choix-et-justifications.md` |
| Voir la base de données   | `4-Base-de-Donnees/1.MCD.md`                            |
| Consulter les routes API  | `5-API-Backend/1.liste-des-routes.md`                   |
| Voir les maquettes        | `6-Interface-Utilisateur/maquettes/`                    |
| Analyser les risques      | `7-Securite-et-Risques/1.analyse-des-risques.md`        |

---

## 📝 Conventions de Nommage

- **Fichiers** : kebab-case minuscules (`besoins-et-objectifs.md`)
- **Dossiers** : PascalCase avec tirets (`1-Presentation/`)
- **Numérotation** : Par catégorie uniquement (pas de numérotation globale)

---

## 🔗 Ressources Externes

- **Dépôt GitHub** : [BlaBlaBook](https://github.com/O-clock-Figueres/projet-blablabook-cda)
- **API Open Library** : <https://openlibrary.org/developers/api>
- **shadcn/ui** : <https://ui.shadcn.com/>
- **OWASP Top 10 2025** : <https://owasp.org/Top10/>

---

### Documentation maintenue par l'équipe BlaBlaBook - CDA 2026
