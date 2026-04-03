# Sprint 3 - Finalisation BlaBlaBook

> **Date de rédaction** : 2026-03-29
> **Dernière mise à jour** : 2026-04-03
> **Phase** : Sprint 3 - Finalisation MVP + Internationalisation + Finitions
> **Durée** : 4 jours - du 30/03/2026 au 02/04/2026
> **Statut global** : Sprint terminé ✅ — i18n ✅ · dark mode ✅ · Redis ✅ · auth/refresh ✅ · Safari fix ✅ · SEO ✅ · Autocomplete ✅ · Recommandations ✅ · Corrections bugs ✅

---

## 1. État de départ

### 1.1 Ce qui est acquis du Sprint 2

| Domaine                 | Statut | Détail                                                                             |
| ----------------------- | ------ | ---------------------------------------------------------------------------------- |
| **Backend API REST**    | ✅      | Routes `/auth`, `/books`, `/library`, `/user` fonctionnelles                       |
| **Backend Sécurité**    | ✅      | Argon2, JWT, cookies httpOnly, Helmet, XSS, CORS, rate limiting                    |
| **Backend Tests**       | ✅      | Tests Vitest (unitaires + intégration), 91% coverage                               |
| **Frontend Pages**      | ✅      | Toutes les pages MVP (/, login, register, search, book/:id, library, profile, ...) |
| **Frontend Responsive** | ✅      | Toutes les pages mobile + desktop                                                  |
| **Frontend A11y**       | ✅      | Audit accessibilité et sémantique complet                                          |
| **CI/CD**               | ✅      | GitHub Actions (ci.yml + deploy.yml), deploy hooks Render                          |
| **Déploiement**         | ✅      | Neon + Render (backend + frontend) + UptimeRobot                                   |

### 1.2 Ce qui était à faire pour 100% du MVP

| Priorité  | Fonctionnalité                                                                         | Statut                  |
| --------- | -------------------------------------------------------------------------------------- | ----------------------- |
| 🔴 Haute   | **Notes (1–5 étoiles)** : backend câblé (PR #150), frontend StarRating                | ✅ Done                  |
| 🔴 Haute   | **Avis personnel** : backend câblé (PR #150), frontend textarea                        | ✅ Done                  |
| 🟠 Moyenne | **Internationalisation FR/EN** : `next-intl`, routing `[locale]`, messages FR/EN       | ✅ Done (PR #159)        |
| 🟠 Moyenne | **Redis** : cache OpenLibrary + rate limiting `RedisStore` (Upstash)                   | ✅ Done (PR #155)        |
| 🟡 Basse   | **Mode nuit (Dark Mode)** : `next-themes`, `ThemeToggle`, toutes les pages             | ✅ Done (PR #160)        |
| 🟡 Basse   | **Toast notifications** : Sonner déjà installé                                         | ✅ Done                  |
| 🟡 Basse   | **Refresh token** : `POST /auth/refresh` avec rotation + correction Safari cookie path | ✅ Done (PR #149 + #161) |

---

## 2. Planning 4 jours — Résultats

| Jour               | Priorité                                               | Résultat                                                                                               |
| ------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Jour 1** - 30/03 | Redis + Dark mode + i18n + fix auth                    | ✅ Redis (PR #155), Dark mode (PR #160), i18n (PR #159), Safari fix (PR #161)                          |
| **Jour 2** - 31/03 | Notes/Avis frontend + Toasts Sonner + SEO              | ✅ SEO (PR #189), recommandations (PR #187), library status (PR search), onboarding bibliothèque vide  |
| **Jour 3** - 01/04 | Autocomplete, corrections, tests, finitions            | ✅ Autocomplete (PR #194), i18n corrections (PR #188), fix auth (PR #185), Google Books fallback        |
| **Jour 4** - 02/04 | Stabilisation, corrections bugs, review finale         | ✅ Fix 502 logout (PR #198), fix delete library (PR #200), fix popup login (PR #201), fix navbar (PR #197) |

---

## 3. Réalisations Sprint 3

### 3.1 Jour 1 — 30/03 ✅

- ✅ **Redis cache** OpenLibrary (PR #155) — TTL search 1h / book 24h / random 10min
- ✅ **Dark mode** (PR #160) — `next-themes`, `ThemeToggle`, classes `dark:` sur toutes les pages
- ✅ **Internationalisation FR/EN** (PR #159) — `next-intl`, routing `[locale]`, messages FR/EN
- ✅ **Fix Safari** (PR #161) — `sameSite: "lax"`, `trust proxy: 1`, proxy Next.js pour cookies same-site

### 3.2 Jour 2 — 31/03 ✅

- ✅ **SEO** : robots.txt + sitemap (PR #189), OpenGraph images
- ✅ **Recommandations personnalisées** (PR #187) — algorithme backend + label "Sélection personnalisée" si connecté
- ✅ **LibraryStatusContext** — contexte cross-page pour savoir si un livre est dans la bibliothèque
- ✅ **Statut bibliothèque sur /search** — bouton "Déjà ajouté" + suppression directe depuis la recherche
- ✅ **Onboarding bibliothèque vide** — écran d'accueil pour les nouveaux utilisateurs
- ✅ **Welcome toast** au premier login (sessionStorage `just_logged_in`)
- ✅ **Toasts Sonner** intégrés sur library (suppression, statut, bienvenue)
- ✅ **Fix AuthContext** (PR #185) — distinction erreur réseau vs session expirée

### 3.3 Jour 3 — 01/04 ✅

- ✅ **Autocomplete recherche** (PR #194) — composant `SearchAutocomplete` avec debounce 300ms, AbortController, navigation clavier
- ✅ **Google Books fallback** — intégration si OpenLibrary ne retourne pas de résultats
- ✅ **LibreTranslate** — module d'intégration pour traduction descriptions
- ✅ **i18n corrections** (PR #188) — translations manquantes, fix query params lors du changement de locale (PR #195)
- ✅ **Bouton refresh** sur "Livres du moment" (PR #176) — skeleton loading + rafraîchissement sans rechargement de page
- ✅ **Fix UX book details** (PR #179) — améliorations visuelles page fiche livre
- ✅ **Test coverage backend** — nouveaux fichiers unitaires : `errorHandler`, `locale.middleware`, `rateLimit.middleware`, `wrappers`, `index.router`
- ✅ **Test coverage frontend** — `api.test.ts` retry + non-Error exception, `authService.test.ts` branches SSR

### 3.4 Jour 4 — 02/04 → 03/04 ✅

- ✅ **Fix 502 logout** (PR #198) — `authService.logout()` remplace `apiClient.post` par `fetch` natif (évite `Content-Type: application/json` avec corps vide)
- ✅ **Fix delete bibliothèque** (PR #200) — mapping `bookId` corrigé (`item.bookId` au lieu de `item.id`)
- ✅ **Fix popup nombre de livres au login** (PR #201) — découplage des deux `useEffect` (fetch + toast welcome)
- ✅ **Fix nom liens navbar** (PR #197) — corrections texte menu mobile
- ✅ **i18n complète** — `ShareButton`, `SearchBookActions`, `RelatedBooks` mis à jour ; clés `unknownAuthor`, `shareButton`, `searchBookActions` ajoutées
- ✅ **Fix LCP** — `priority={i === 0}` sur première couverture (`BookCover`) dans `RandomBooksSection` et `library/page.tsx`
- ✅ **Fix authError post-login** — `login()` dans `AuthContext` remet `authError` à `null`
- ✅ **Proxy route.ts** — suppression du fallback `NEXT_PUBLIC_API_URL` (évite localhost dans conteneur Docker)

---

## 4. Critères de validation du Sprint 3

| Critère                                                                              | Statut |
| ------------------------------------------------------------------------------------ | ------ |
| Inscription, connexion, déconnexion                                                  | ✅      |
| Recherche et ajout de livres                                                         | ✅      |
| Gestion statut de lecture (TO_READ / READING / READ)                                 | ✅      |
| Statut bibliothèque visible depuis la page recherche                                 | ✅      |
| Recommandations personnalisées sur la page d'accueil si connecté                     | ✅      |
| Naviguer en **français** (défaut) et en **anglais**                                  | ✅      |
| Changer de langue via un sélecteur dans la navigation                                | ✅      |
| Recevoir des retours visuels (toasts) lors des actions importantes                   | ✅      |
| Les réponses OpenLibrary sont mises en cache (Redis)                                 | ✅      |
| Le rate limiting persiste entre les redémarrages Render (store Redis)                | ✅      |
| Basculer entre le mode clair et le mode nuit                                         | ✅      |
| SEO : robots.txt, sitemap, OpenGraph                                                 | ✅      |
| Autocomplete sur la barre de recherche                                               | ✅      |
| Attribuer une note (1-5 étoiles) à un livre de la bibliothèque                       | 🔄 Backend câblé, frontend à finaliser |
| Rédiger et sauvegarder un avis personnel                                             | 🔄 Backend câblé, frontend à finaliser |

---

## 5. Backlog restant (post-Sprint 3)

- [ ] **StarRating component** — composant 5 étoiles cliquables dans `library/page.tsx`
- [ ] **Textarea review** — champ avis personnel + sauvegarde dans `library/page.tsx`
- [ ] **Loading skeletons** — sur library et search
- [ ] **SEO dynamique** — métadonnées sur `/book/[id]`

---

*Document rédigé le 2026-03-29 — mis à jour le 2026-04-03.*
