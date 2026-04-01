# Point projet #2 — BlaBlaBook

> Durée estimée : 7-8 minutes | Sprint 1 | Date : 27/03/2026

---

## 1. État général du sprint 1

L'application est **en production** depuis le 25/03 :
- Base de données : PostgreSQL sur **Neon**
- Backend : Express sur **Render**
- Frontend : Next.js sur **Vercel**

Le sprint 1 est techniquement terminé sur le plan fonctionnel. La semaine du 23 au 26/03 a été consacrée à la finalisation, au déploiement et à une phase d'audit qualité.

---

## 2. Ce qui a été fait — semaine du 23 au 26/03

### Paul — Tests & CI/CD

- Installation complète de **Vitest** backend : 73 tests (91% couverture) ✅
- Mise en place **GitHub Actions CI/CD** : 5 jobs (lint + tests + build, front et back)
- Déploiement production complet : Neon, Render, Vercel ✅
- Pages `/legal`, `/cgu`, `/privacy`, `/profile`, `/404`

### Ophélie — Responsive & accessibilité

- Finalisation du responsive : homepage, Navbar, Footer, `book/:id`, `search`, `library`, `register`
- Page 404 personnalisée
- Revue sémantique et accessibilité (halfway)
- Début de dynamisation page `/profile` (données utilisateur + routes `GET /user` + `DELETE /user`)

### Rémi — Refactorisation backend + responsive

- Refactorisation `book.controller` + `auth.controller` vers `asyncWrapper` (suppression try/catch)
- Responsive pages `book/:id`, `search`, `library`, `cgu`, `register`
- Page `loading.tsx` pour améliorer l'UX

### Christopher — Audit + 6 PRs correctifs (26/03)

**Fix tests + reviews matin :**
- Sync `main`, suppression branche `test/backend-frontend-vitest`
- 3 tests `bookService.test.ts` cassés suite PR #121 : retour type `BookSearchResponse` au lieu de `[]`, URL avec `&page=1`, paramètre `page` non testé → corrigés, 39/39 ✅ → PR #130 mergée
- Review #127 (init.sh) : OK à merger
- Review #128 (env) : bug signalé → fallback port `3001` au lieu de `3000` dans `api.ts` pointe sur le frontend
- Review #129 (fix vuln Next.js) : périmètre trop large, inclut les mêmes changements que #128 + le bug → signalé à Paul pour scinder

**Audit codebase après-midi :**
- Analyse systématique frontend + backend
- 20+ items identifiés : bugs critiques auth/cookies, sécurité (rate limiting, cookies HTTP), UX (erreurs silencieuses, toasts), dette technique (types incohérents, cascade manquante)
- Backlog constitué et ajouté au CLAUDE.md

**6 PRs correctifs :**

| PR | Description | Statut |
|----|-------------|--------|
| #136 | Cookies de logout effacés sans `secure`/`sameSite`/`path` → refreshToken persistait 7 jours | ✅ Approuvée |
| #137 | `POST /auth/register` ne retournait que `{ id, email }` → username absent → AuthContext stockait l'email comme username | ✅ Approuvée |
| #138 | `catch` vides sur `AddToLibraryButton` et `AddToLibraryPanel` → erreurs avalées silencieusement → feedback visuel rouge + message | ✅ Approuvée (retour Rémi : utiliser `<Button variant="destructive">`) |
| #139 | Changement de mot de passe n'envoyait jamais le mot de passe actuel → `currentPassword` ajouté dans Zod, vérification argon2, transmission frontend + 2 tests | ⚠️ CI échoue (lint + tests) |
| #140 | Rate limiting jamais branché → 3 niveaux (global 100/15min, auth 10/15min, search 30/1min) + cookies conditionnels selon `NODE_ENV` | ✅ Approuvée |
| #141 | `AuthContext` ne distinguait pas erreur réseau d'un 401 → `authError` séparé, état d'erreur avec bouton "Réessayer" dans `/library`, toasts sonner | ✅ Approuvée |

---

## 3. Ce qui est à faire — aujourd'hui (27/03)

### À corriger avant merge

- **#139** — corriger les 2 jobs CI qui échouent (lint backend + tests) — seul bloquant sur les 6 PRs
- **#138** — appliquer le retour de Rémi : remplacer `<button>` inline + couleur `"red"` en dur par `<Button variant="destructive">` de shadcn

### À signaler à l'équipe

- **#136** — vérifier le commentaire d'Ophélie sur le linter backend avant merge
- **#137, #140, #141** — prêtes à merger dès ce matin

### Selon ce qui est mergé

- Attaquer un item du backlog : route `/auth/refresh` manquante (déconnexion forcée à 1h) ou `AlertDialog` shadcn pour remplacer le `confirm()` natif dans `/library`

### Backlog qualité (à prioriser collectivement)

Parmi les 20+ items identifiés lors de l'audit, les plus impactants :

**Fonctionnel :**
- Route `POST /auth/refresh` manquante → déconnexion forcée à expiration du token (1h)
- Champs `rating` et `review` non exposés côté frontend

**Sécurité :**
- Validation mot de passe côté client (min 8, 1 maj, 1 min) absente
- CSRF non adressé

**UX :**
- `confirm()` natif dans `/library` → à remplacer par `AlertDialog` shadcn
- Page `/library` retourne `null` au lieu de rediriger si non connecté
- Pas de loading state sur la recherche

---

## 4. Questions en suspens

- **PR #136** : Ophélie signale un souci linter backend — à inspecter avant merge
- **Refresh token** : stratégie à décider en équipe (route `/auth/refresh` à implémenter ?)
- **Prochains items** du backlog à assigner : qui prend quoi ?
- **Sprint 2** : démarrage prévu quand ?

---

*Point préparé à partir de l'état des PRs GitHub et du carnet de bord — BlaBlaBook*
