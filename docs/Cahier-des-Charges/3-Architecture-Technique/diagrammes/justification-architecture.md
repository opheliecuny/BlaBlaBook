# Justification de l'architecture — BlaBlaBook

## Vue d'ensemble

BlaBlaBook suit une architecture **fullstack découplée** en 3 couches indépendantes :

```
Utilisateur → Frontend (Next.js) → Backend API (Express) → Base de données (PostgreSQL)
                                          ↕
                                  Open Library API
```

Ce découplage permet à chaque couche d'évoluer, d'être testée et déployée **indépendamment**.

---

## Frontend — Next.js + Tailwind CSS + shadcn/ui

### Next.js
Next.js est un framework React qui offre le **routing intégré** (App Router), le **rendu côté serveur (SSR)** et l'**optimisation SEO** de façon native. Il s'impose aujourd'hui comme le standard en production pour les applications React et est massivement adopté par les entreprises. Il correspond parfaitement à notre besoin de pages dynamiques (bibliothèque, recherche) tout en restant simple à déployer sur Vercel.

### Tailwind CSS
Tailwind permet un développement UI **rapide et cohérent** via des classes utilitaires directement dans le HTML/JSX. Il évite la multiplication des fichiers CSS et facilite le **responsive design**. Toute l'équipe adopte le même système de styles, ce qui réduit les conflits et accélère la collaboration.

### shadcn/ui
Bibliothèque de composants UI **modernes et accessibles**, construite sur Radix UI et conçue pour s'intégrer nativement avec Tailwind. Contrairement à d'autres bibliothèques (Material UI, Ant Design), shadcn/ui copie les composants directement dans le projet — on garde le **contrôle total** sur le code sans dépendance lourde.

---

## Backend — Node.js + Express

### Node.js
Node.js permet de développer le backend **en JavaScript**, le même langage que le frontend. Cela réduit la charge cognitive pour l'équipe et facilite le partage de types et de logique entre les deux couches. Son écosystème npm est le plus vaste disponible.

### Express
Framework minimaliste et flexible pour construire une **API REST**. Il ne fait pas de magie cachée : chaque middleware, chaque route est explicite et lisible. C'est la solution la plus documentée et la plus utilisée pour les APIs Node.js, ce qui facilite la recherche de ressources et la montée en compétences.

---

## Base de données — PostgreSQL + Prisma

### PostgreSQL
Base de données **relationnelle robuste** et open-source. Idéale pour notre modèle de données structuré (Users, Books, Library) qui contient des relations claires entre entités. PostgreSQL est le standard de l'industrie pour les applications web nécessitant des données fiables et cohérentes (ACID).

### Prisma
ORM moderne qui génère un **client TypeScript typé** à partir du schéma de base de données. Il apporte :
- Les **migrations** automatiques du schéma
- La **protection contre les injections SQL** par défaut
- Une syntaxe intuitive proche du langage naturel
- Une intégration parfaite avec Node.js et TypeScript

---

## Authentification — JWT + argon2 + Zod

### JWT (JSON Web Token)
Système d'authentification **stateless** : le serveur n'a pas besoin de stocker les sessions. Le token est signé, contient les infos utiles (userId, email) et est vérifié à chaque requête. Parfait pour une API REST découplée du frontend.

### argon2
Les mots de passe ne sont **jamais stockés en clair**. argon2 les hash avec un salt aléatoire et un facteur de coût configurable, rendant les attaques par force brute extrêmement lentes même en cas de vol de la base. Argon2 est le standard recommandé par l'OWASP pour le hachage de mots de passe.

### Zod
Bibliothèque de validation de schémas TypeScript. Valide toutes les entrées utilisateur **côté client ET côté serveur** (double validation). Protège contre les données malformées et les injections, et génère des messages d'erreur explicites pour l'UX.

---

## Sécurité additionnelle — Helmet + express-rate-limit

### Helmet
Middleware Express qui configure automatiquement les **headers HTTP de sécurité** (Content-Security-Policy, X-Frame-Options, etc.) pour protéger contre les attaques XSS, clickjacking et autres vulnérabilités communes.

### express-rate-limit
Limite le nombre de tentatives de connexion par IP et par email (**5 essais / 15 minutes**). Protège contre les attaques **brute force** sur les endpoints d'authentification.

---

## Déploiement — Vercel + Render + Supabase + Docker

### Vercel
Plateforme de déploiement conçue **nativement pour Next.js** (même éditeur). Déploiement en 0 configuration depuis GitHub, CDN global, HTTPS automatique et preview deployments pour chaque branche.

### Render
Plateforme cloud simple pour héberger l'**API Node.js/Express**. Déploiement continu depuis GitHub, scaling automatique, et plan gratuit suffisant pour le projet.

### Supabase
Hébergement **PostgreSQL managé** avec interface d'administration, backups automatiques et connexion sécurisée. Évite d'avoir à gérer soi-même un serveur de base de données.

### Docker
Permet d'avoir un **environnement de développement identique** pour tous les membres de l'équipe via `docker-compose`. Plus de "ça marche sur ma machine" — chaque développeur travaille avec exactement la même configuration.

---

## Synthèse des choix

| Critère              | Choix retenu | Alternative écartée                                      |
| -------------------- | ------------ | -------------------------------------------------------- |
| Framework frontend   | Next.js      | Create React App (pas de SSR)                            |
| Styles               | Tailwind CSS | CSS Modules (plus verbeux)                               |
| Backend              | Express      | NestJS (trop complexe pour le MVP)                       |
| Base de données      | PostgreSQL   | MongoDB (pas adapté aux données relationnelles)          |
| ORM                  | Prisma       | Sequelize (typage moins fort)                            |
| Auth                 | JWT          | Sessions serveur (stateful, moins adapté à une API REST) |
| Déploiement frontend | Vercel       | Netlify                                                  |
| Déploiement backend  | Render       | Railway                                                  |
