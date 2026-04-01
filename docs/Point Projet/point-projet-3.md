# Point projet #3 — BlaBlaBook

> Durée estimée : 7-8 minutes | Sprint 3 | Date : 03/04/2026

---

## 1. Où on en est (1 min)

Sprint 3 terminé. L'application est **en production** et fonctionnelle :

| Couche | Service | Statut |
|--------|---------|--------|
| Frontend | Vercel | ✅ |
| Backend | Render | ✅ |
| BDD | Neon (PostgreSQL) | ✅ |
| Cache | Upstash (Redis) | ✅ |

**Depuis le dernier point (27/03)** : cache Redis, recommandations personnalisées, backlog d'audit 100% traité, i18n fr/en, dark mode, tests sécurité, 11 améliorations UX.

---

## 2. Améliorations UX — 11 points livrés (2 min)

### Homepage
- **Sélection personnalisée** : sous-titre conditionnel connecté/déconnecté (i18n fr+en)
- **Bouton "Rafraîchir"** + loader sur les livres du moment
- **Animation "+ Biblio"** : scale + check animé à l'ajout d'un livre

### Recherche
- **Autocomplete** : suggestions instantanées après 3 caractères (debounce + dropdown)

### Bibliothèque
- **Sélecteur de tri** : Date d'ajout / Titre A→Z / Auteur A→Z avec inversion
- **Mode liste / grille** : toggle entre vue couvertures et vue compacte
- **Statistiques enrichies** : auteur le plus lu, genre préféré, dernière lecture
- **Onboarding bibliothèque vide** : écran illustré + CTA vers la recherche

### Fiche livre
- **"Vous aimerez aussi"** : 4 livres du même genre/auteur en bas de page (Ophélie)
- **Bouton "Partager"** : copie du lien + toast "Lien copié !" (Ophélie)

### UX globale
- **Toast de bienvenue** : "Bienvenue {username} — {n} livres" après connexion

---

## 3. Architecture technique — recommandations + cache (2 min)

### Algorithme de recommandation personnalisée

Moteur hybride content-based dans `recommendation.ts` (~200 lignes) :

1. **Profil utilisateur** — extraction préférences genre/auteur/époque depuis la bibliothèque. Pondération par statut (READING ×1.5, READ ×1.0, TO_READ ×0.5) et par note.
2. **Requêtes ciblées** — 4 requêtes Open Library en parallèle : top 2 genres + top 1 auteur + 1 genre "sérendipité" (anti bulle de filtre).
3. **Scoring multi-critères** (0-100 pts) — Genre (35) + Auteur (25) + Époque (15) + Nouveauté (10) + Couverture (5) + Popularité (5) + Sérendipité (5).
4. **Filtrage** — exclusion livres déjà en biblio, déduplication, sélection top 4.
5. **Cache Redis** — clé `reco:{userId}:{bucket30min}`, TTL 30 min.

### Cache Redis (Upstash)

| Endpoint | Clé | TTL |
|----------|-----|-----|
| Recherche | `search:{query}:{page}` | 1h |
| Détail livre | `book:{id}` | 24h |
| Livres aléatoires | `random:{genre}:{page}` | 10 min |
| Recommandations | `reco:{userId}:{bucket}` | 30 min |

**Gain mesuré** : `/books/search?q=tolkien` → 2.4s → **100ms** (cache chaud).

Dégradation gracieuse : si Redis est absent/en erreur, l'app continue sans cache.

---

## 4. Qualité — audit et tests (1.5 min)

### Backlog d'audit : 39/40 items traités

| Catégorie | Items | Cochés |
|-----------|-------|--------|
| 🔴 Bugs critiques | 6 | **6/6** |
| 🟠 Manques fonctionnels | 7 | **7/7** |
| 🟡 Sécurité | 6 | **6/6** |
| 🔵 UX / qualité | 10 | **9/10** |
| ⚪ Optimisations | 10 | **10/10** |

### Tests : 123 backend + 39 frontend

**Tests de sécurité** (`security.test.ts` — 10 tests) :
- Validation mdp : rejet si manque chiffre, caractère spécial, minuscule
- XSS sanitization : `<script>` et `onerror=` nettoyés
- Headers Helmet : `x-content-type-options`, `x-frame-options`
- Auth edge cases : JWT malformé, JWT signé avec mauvaise clé

---

## 5. Travail d'équipe (1 min)

| Membre | Réalisations sprint 3 |
|--------|----------------------|
| **Rémi** | i18n complet (next-intl) FR + EN, loading.tsx global |
| **Ophélie** | Dark mode, accessibilité (PR #132), "Vous aimerez aussi", bouton Partager |
| **Paul** | Fix auth cookies Safari, fix déploiement Render |
| **Christopher** | Cache Redis, recommandations, audit complet, 9 UX sprint 3, tests sécurité |

---

*Point préparé à partir du carnet de bord, du backlog CLAUDE.md et de l'état des PRs GitHub — BlaBlaBook*
