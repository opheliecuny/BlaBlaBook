# Point projet #1 — BlaBlaBook

> Durée estimée : 7-8 minutes | Sprint 0 | Date : 12/03/2026

---

## 1. Contextualisation du projet (2 min)

### C'est quoi ?

**BlaBlaBook** est une plateforme web de gestion de bibliothèque personnelle.
Elle permet à chaque utilisateur de :

- Rechercher des livres (via l'API Open Library)
- Gérer ses lectures avec des statuts : *à lire*, *en cours*, *lu*
- Consulter des fiches détaillées par livre
- Laisser une note et un avis personnel

Le projet s'inspire de **Babelio** et **Goodreads**, en proposant une expérience plus simple et moderne.

---

### Par qui ?

Une équipe de 4 développeurs organisée en méthode **Scrum** :

| Membre | Rôle Scrum        | Dominante technique                         |
| ------ | ----------------- | ------------------------------------------- |
| Jeremy | Product Owner     | Recherche & Intégration API (Open Library)  |
| Pablo  | Scrum Master      | Bibliothèque & DevOps (Docker, Déploiement) |
| Kris   | Lead Dev Backend  | Architecture API Express, Prisma, JWT, Zod  |
| Lilo   | Lead Dev Frontend | Architecture Next.js, Tailwind, shadcn/ui   |

---

### Pour qui ?

**Cible principale** : tout lecteur de 18 à 45 ans souhaitant organiser sa vie de lecteur numériquement, qu'il soit occasionnel ou passionné.

**Cibles secondaires (évolutions futures)** :

- Membres de clubs de lecture (partage de bibliothèques)
- Lecteurs novices cherchant des recommandations communautaires

---

### Pourquoi ?

Les lecteurs n'ont pas d'outil simple et centralisé pour :

- Suivre leurs lectures (lus, en cours, à lire)
- Retrouver les infos d'un livre sans jongler entre plusieurs sites
- Organiser leur bibliothèque de façon numérique et accessible partout
- Partager leurs lectures avec d'autres lecteurs

---

### Comment ?

**Architecture fullstack** :

```plaintext
Frontend (Next.js)  →  Backend (Express/Node.js)  →  PostgreSQL (Neon)
                              ↕
                       Open Library API
```

- **Frontend** : Next.js + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Backend** : Node.js + Express + Zod + Prisma ORM
- **Base de données** : PostgreSQL hébergé sur Neon
- **Authentification** : Utilisation de JWT + argon2
- **DevOps** : Docker, GitHub, Vercel (front), Render (back)
- **API externe** : Open Library API (catalogue de livres gratuit et vaste)

---

## 2. Ce qui a été fait — Sprint 0 (3 min)

### Déroulement de la semaine

Le Sprint 0 a été consacré à la **phase de cadrage et de setup** : définir le projet avant d'écrire la moindre ligne de code fonctionnel.

### Répartition des tâches

**Documentation rédigée collectivement :**

- Présentation du projet et définition de la vision
- Définition des besoins et des objectifs
- Spécifications fonctionnelles du MVP (7 blocs fonctionnels)
- Définition de la cible et des contraintes (RGPD, WCAG, responsive)
- Choix et justification de toutes les technologies
- Schéma d'architecture technique
- Liste des routes frontend et endpoints API REST
- Arborescence complète de l'application (frontend + backend)
- 13 User Stories formalisées
- Backlog produit (17 items priorisés)
- Analyse des risques
- Définition des rôles Scrum et des rituels d'équipe

**Setup technique :**

- Création et configuration du dépôt GitHub (`main` protégée, branches de sprint)
- Structure du projet initialisée (frontend / backend / docs / docker)
- `.gitignore`, `.env.example`, `README.md`

### Choix techniques clés

| Choix                    | Justification                                                            |
| ------------------------ | ------------------------------------------------------------------------ |
| **Next.js** (App Router) | Routing intégré, SSR pour le SEO, écosystème riche                       |
| **Express**              | Minimaliste, adapté à une API REST, bien maîtrisé                        |
| **Prisma + PostgreSQL**  | Requêtes typées, migrations simples, protection injection SQL            |
| **Neon**                 | PostgreSQL managé, interface d'admin intégrée                            |
| **JWT + argon2**         | Auth stateless + hachage résistant aux attaques brute-force              |
| **Open Library API**     | Catalogue vaste et gratuit, évite de maintenir une base de livres propre |
| **Docker**               | Environnement de dev identique pour l'équipe                             |

---

## 3. Ce qui est à faire — Prochaines priorités (1 min 30)

Les items prioritaires du Sprint 1, dans l'ordre :

1. **Configuration de l'environnement de développement**
   - Docker Compose pour PostgreSQL
   - Initialisation Prisma + connexion BDD
   - Projets backend (Express) et frontend (Next.js) bootstrappés

2. **Configuration de la base de données**
   - Schéma Prisma : modèles `User`, `Book`, `LibraryItem`, enum `ReadingStatus`
   - Migration et test de connexion

3. **Implémentation de l'authentification (Backend)**
   - Routes `POST /auth/register` et `POST /auth/login`
   - Middleware JWT, validation Zod, hash argon2
   - Tests Postman

4. **Setup Frontend (Next.js)**
   - Configuration Tailwind CSS v4 + shadcn/ui
   - Layout global (Navbar, Footer)
   - Landing page avec sélection de livres aléatoire

5. **Authentification Frontend**
   - `AuthContext` + hook `useAuth`
   - Formulaires Login / Register avec validation temps réel
   - Gestion du JWT côté client

---

## 4. Ce qui doit être résolu — Questions en suspens (30 s)

- **Stratégie de stockage du JWT** : `localStorage` vs cookie `HttpOnly` — à trancher collectivement (sécurité vs simplicité)
- **Gestion des images Open Library** : certaines couvertures sont absentes de l'API, prévoir un fallback visuel
- **Limite de taux Open Library API** : vérifier les quotas et prévoir une stratégie de cache si nécessaire
- **Environnement de déploiement** : confirmer les comptes Vercel, Render et Neon pour toute l'équipe avant le premier déploiement

---

*Présentation préparée à partir de la documentation du Sprint 0 — BlaBlaBook*
