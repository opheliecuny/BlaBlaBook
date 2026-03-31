# Sprint 3 - Finalisation BlaBlaBook

> **Date de rédaction** : 2026-03-29
> **Dernière mise à jour** : 2026-03-31
> **Phase** : Sprint 3 - Finalisation MVP + Internationalisation + Finitions
> **Durée** : 4 jours - du 30/03/2026 au 02/04/2026
> **Statut global** : Jour 1 terminé 🚀 — i18n ✅ · dark mode ✅ · Redis ✅ · auth/refresh ✅ · Safari fix ✅

---

## 1. État de départ

### 1.1 Ce qui est acquis du Sprint 2

| Domaine                 | Statut | Détail                                                                             |
| ----------------------- | ------ | ---------------------------------------------------------------------------------- |
| **Backend API REST**    | ✅      | Routes `/auth`, `/books`, `/library`, `/user` fonctionnelles                       |
| **Backend Sécurité**    | ✅      | Argon2, JWT, cookies httpOnly, Helmet, XSS, CORS, rate limiting                    |
| **Backend Tests**       | ✅      | 73 tests Vitest (33 unitaires + 40 intégration), 91% coverage                      |
| **Frontend Pages**      | ✅      | Toutes les pages MVP (/, login, register, search, book/:id, library, profile, ...) |
| **Frontend Responsive** | ✅      | Toutes les pages mobile + desktop                                                  |
| **Frontend A11y**       | ✅      | Audit accessibilité et sémantique complet                                          |
| **CI/CD**               | ✅      | GitHub Actions (ci.yml + deploy.yml), deploy hooks Render                          |
| **Déploiement**         | ✅      | Neon + Render (backend + frontend) + UptimeRobot                                   |

### 1.2 Ce qui reste à faire pour 100% du MVP

| Priorité  | Fonctionnalité                                                                         | Statut                  | Où ?                               |
| --------- | -------------------------------------------------------------------------------------- | ----------------------- | ---------------------------------- |
| 🔴 Haute   | **Notes (1–5 étoiles)** : backend câblé (PR #150), frontend StarRating à faire         | 🔄 Partiel               | `library/page.tsx`                 |
| 🔴 Haute   | **Avis personnel** : backend câblé (PR #150), frontend textarea à faire                | 🔄 Partiel               | `library/page.tsx`                 |
| 🟠 Moyenne | **Internationalisation FR/EN** : `next-intl`, routing `[locale]`, messages FR/EN       | ✅ Done (PR #159)        | Toutes les pages                   |
| 🟠 Moyenne | **Redis** : cache OpenLibrary + rate limiting `RedisStore` (Upstash)                   | ✅ Done (PR #155)        | `backend/src/utils/redisClient.ts` |
| 🟡 Basse   | **Mode nuit (Dark Mode)** : `next-themes`, `ThemeToggle`, toutes les pages             | ✅ Done (PR #160)        | `components/ThemeToggle.tsx`       |
| 🟡 Basse   | **Toast notifications** : Sonner déjà installé, non utilisé                            | ⏳ À faire               | `sonner` v2.0.7                    |
| 🟡 Basse   | **Refresh token** : `POST /auth/refresh` avec rotation + correction Safari cookie path | ✅ Done (PR #149 + #161) | `auth.controller.ts`               |

---

## 2. Planning 4 jours

| Jour               | Priorité                                               | Résultat                                                                     |
| ------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| **Jour 1** - 30/03 | ~~Notes + Avis~~ → Redis + Dark mode + i18n + fix auth | ✅ Redis (PR #155), Dark mode (PR #160), i18n (PR #159), Safari fix (PR #161) |
| **Jour 2** - 31/03 | Notes/Avis frontend (StarRating) + Toasts Sonner       | ⏳ En cours                                                                   |
| **Jour 3** - 01/04 | Corrections, tests, finitions                          | ⏳ À venir                                                                    |
| **Jour 4** - 02/04 | Stabilisation, review finale, démo                     | ⏳ À venir                                                                    |

---

## 3. Priorité 1 - Notes et Avis (MVP final)

> Les champs `rating` (INTEGER, 1-5) et `review` (TEXT) **existent déjà dans la table `library_item`** - seul le câblage backend/frontend manque.

### 3.1 Backend - Enrichir `PATCH /library/:id`

**Fichier** : `blablabook/backend/src/controllers/library.controller.ts`

Modifier le schéma Zod de validation pour accepter `rating` et `review` :

```typescript
const updateLibraryItemSchema = z.object({
  status: z.enum(["TO_READ", "READING", "READ"]).optional(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  review: z.string().max(1000).optional().nullable(),
});
```

Modifier la requête Prisma pour persister les nouveaux champs :

```typescript
const updatedItem = await prisma.library_item.update({
  where: { id, userId: req.user.id },
  data: {
    ...(status && { status }),
    ...(rating !== undefined && { rating }),
    ...(review !== undefined && { review }),
  },
});
```

**Fichier** : `blablabook/backend/src/routes/library.router.ts` - aucune modification nécessaire.

### 3.2 Frontend - UI Notes et Avis dans `/library`

**Fichier** : `blablabook/frontend/src/app/library/page.tsx`

Ajouter pour chaque livre :

- **Composant étoiles** : 5 étoiles cliquables (icône `Star` de `lucide-react`, remplies/vides selon `rating`)
- **Zone de texte** : `textarea` pour l'avis personnel (max 1000 caractères)
- **Sauvegarde** : appel `PATCH /library/:id` avec `rating` et `review` au blur ou sur bouton "Enregistrer"

Interface recommandée :

```tsx
// Composant StarRating (à créer dans components/StarRating.tsx)
// Props : rating: number | null, onChange: (rating: number) => void, readonly?: boolean
<StarRating rating={item.rating} onChange={(r) => handleRatingChange(item.id, r)} />

// Textarea review
<textarea
  placeholder="Votre avis sur ce livre..."
  maxLength={1000}
  defaultValue={item.review ?? ""}
  onBlur={(e) => handleReviewChange(item.id, e.target.value)}
/>
```

### 3.3 Service Frontend

**Fichier** : `blablabook/frontend/src/services/libraryService.ts`

Modifier `updateReadingStatus` (ou créer `updateLibraryItem`) pour accepter rating et review :

```typescript
export async function updateLibraryItem(
  id: string,
  data: { status?: ReadingStatus; rating?: number | null; review?: string | null }
): Promise<LibraryItem> {
  return api.patch(`/library/${id}`, data);
}
```

### 3.4 Tests à mettre à jour

**Backend** : `tests/integration/api/library.test.ts`

Ajouter des cas dans `PATCH /library/:id` :

- ✅ Mise à jour `rating` (1-5)
- ✅ Mise à jour `review`
- ✅ Validation : `rating` invalide (0, 6, string)
- ✅ Mise à jour simultanée `status` + `rating` + `review`

---

## 4. Priorité 2 - Internationalisation FR/EN (next-intl)

> **Choix technologique** : `next-intl` - bibliothèque recommandée pour Next.js App Router (compatible SSR, Server Components, Client Components).

### 4.1 Installation

```bash
cd blablabook/frontend
npm install next-intl
```

### 4.2 Structure des fichiers

```plaintext
blablabook/frontend/
├── messages/
│   ├── fr.json          # Traductions françaises (défaut)
│   └── en.json          # Traductions anglaises
├── src/
│   ├── i18n/
│   │   ├── routing.ts   # Configuration des locales
│   │   └── request.ts   # Chargement des messages côté serveur
│   └── middleware.ts    # Middleware de détection de locale
```

### 4.3 Configuration `next.config.ts`

```typescript
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org", pathname: "/b/**" },
    ],
  },
};

export default withNextIntl(nextConfig);
```

### 4.4 Configuration des locales (`src/i18n/routing.ts`)

```typescript
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed", // /search (fr), /en/search (en)
});
```

### 4.5 Middleware (`src/middleware.ts`)

```typescript
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

### 4.6 Structure des messages

**`messages/fr.json`** (extrait) :

```json
{
  "nav": {
    "home": "Accueil",
    "search": "Rechercher",
    "library": "Ma bibliothèque",
    "profile": "Mon profil",
    "login": "Connexion",
    "register": "Inscription",
    "logout": "Déconnexion"
  },
  "home": {
    "hero_title": "Votre bibliothèque personnelle",
    "hero_subtitle": "Gérez, notez et partagez vos lectures",
    "cta_search": "Rechercher un livre",
    "cta_library": "Ma bibliothèque",
    "books_section": "Sélection du moment"
  },
  "search": {
    "placeholder": "Rechercher un livre...",
    "results": "{count} résultat(s) pour \"{query}\"",
    "empty": "Aucun résultat trouvé",
    "add_to_library": "Ajouter à ma bibliothèque"
  },
  "library": {
    "title": "Ma bibliothèque",
    "empty": "Votre bibliothèque est vide",
    "filter_all": "Tous",
    "filter_to_read": "À lire",
    "filter_reading": "En cours",
    "filter_read": "Lu",
    "status_to_read": "À lire",
    "status_reading": "En cours",
    "status_read": "Lu",
    "rating_label": "Ma note",
    "review_label": "Mon avis",
    "review_placeholder": "Votre avis sur ce livre...",
    "delete_confirm": "Supprimer ce livre ?",
    "delete_description": "Cette action est irréversible."
  },
  "auth": {
    "login_title": "Connexion",
    "register_title": "Inscription",
    "email": "Adresse email",
    "password": "Mot de passe",
    "username": "Nom d'utilisateur",
    "submit_login": "Se connecter",
    "submit_register": "S'inscrire",
    "no_account": "Pas encore de compte ?",
    "already_account": "Déjà un compte ?"
  },
  "profile": {
    "title": "Mon profil",
    "section_info": "Informations personnelles",
    "section_security": "Sécurité",
    "section_danger": "Zone de danger",
    "save": "Enregistrer",
    "delete_account": "Supprimer mon compte"
  },
  "common": {
    "loading": "Chargement en cours…",
    "error": "Une erreur est survenue",
    "cancel": "Annuler",
    "confirm": "Confirmer",
    "save": "Enregistrer",
    "back": "Retour"
  },
  "errors": {
    "network": "Impossible de joindre le serveur",
    "unauthorized": "Session expirée, veuillez vous reconnecter",
    "not_found": "Page introuvable"
  }
}
```

**`messages/en.json`** (extrait) :

```json
{
  "nav": {
    "home": "Home",
    "search": "Search",
    "library": "My library",
    "profile": "My profile",
    "login": "Login",
    "register": "Sign up",
    "logout": "Logout"
  },
  "home": {
    "hero_title": "Your personal library",
    "hero_subtitle": "Manage, rate and share your reads",
    "cta_search": "Search a book",
    "cta_library": "My library",
    "books_section": "Featured books"
  },
  "search": {
    "placeholder": "Search a book...",
    "results": "{count} result(s) for \"{query}\"",
    "empty": "No results found",
    "add_to_library": "Add to my library"
  },
  "library": {
    "title": "My library",
    "empty": "Your library is empty",
    "filter_all": "All",
    "filter_to_read": "To read",
    "filter_reading": "Reading",
    "filter_read": "Read",
    "status_to_read": "To read",
    "status_reading": "Reading",
    "status_read": "Read",
    "rating_label": "My rating",
    "review_label": "My review",
    "review_placeholder": "Your thoughts on this book...",
    "delete_confirm": "Remove this book?",
    "delete_description": "This action cannot be undone."
  },
  "auth": {
    "login_title": "Login",
    "register_title": "Sign up",
    "email": "Email address",
    "password": "Password",
    "username": "Username",
    "submit_login": "Login",
    "submit_register": "Sign up",
    "no_account": "Don't have an account?",
    "already_account": "Already have an account?"
  },
  "profile": {
    "title": "My profile",
    "section_info": "Personal information",
    "section_security": "Security",
    "section_danger": "Danger zone",
    "save": "Save",
    "delete_account": "Delete my account"
  },
  "common": {
    "loading": "Loading…",
    "error": "An error occurred",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "save": "Save",
    "back": "Back"
  },
  "errors": {
    "network": "Unable to reach the server",
    "unauthorized": "Session expired, please log in again",
    "not_found": "Page not found"
  }
}
```

### 4.7 Utilisation dans les composants

**Server Components** :

```typescript
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  return <h1>{t("hero_title")}</h1>;
}
```

**Client Components** :

```typescript
"use client";
import { useTranslations } from "next-intl";

export function Navbar() {
  const t = useTranslations("nav");
  return <nav>{t("home")}</nav>;
}
```

### 4.8 Sélecteur de langue dans la Navbar

Ajouter un sélecteur FR/EN dans `Navbar.tsx` :

```tsx
"use client";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => {
    const next = locale === "fr" ? "en" : "fr";
    router.push(`/${next}${pathname}`);
  };

  return (
    <button onClick={toggle} className="text-sm font-medium">
      {locale === "fr" ? "EN" : "FR"}
    </button>
  );
}
```

---

## 5. Priorité 2b - Redis (Cache + Rate Limiting distribué)

> **Hébergement recommandé** : [Upstash](https://upstash.com/) — Redis serverless, free tier (10 000 req/jour), compatible Render et Neon. Pas de configuration de serveur requise.

### 5.1 Installation

```bash
cd blablabook/backend
npm install ioredis rate-limit-redis
npm install --save-dev @types/ioredis
```

### 5.2 Client Redis (`src/utils/redisClient.ts`)

```typescript
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!, {
  tls: process.env.NODE_ENV === "production" ? {} : undefined,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on("error", (err) => console.error("[Redis] Connection error:", err));

export { redis };
```

### 5.3 Cache OpenLibrary (`book.controller.ts`)

> Évite les appels répétés à OpenLibrary (API publique non garantie). TTL recommandé : 1h pour les recherches, 24h pour les détails d'un livre.

```typescript
import { redis } from "../utils/redisClient";

// Dans searchBooks()
const cacheKey = `search:${query}:${page}`;
const cached = await redis.get(cacheKey);
if (cached) return res.json(JSON.parse(cached));

// ... appel OpenLibrary ...
await redis.setex(cacheKey, 3600, JSON.stringify(results)); // TTL 1h

// Dans getBookById()
const cacheKey = `book:${openLibraryId}`;
const cached = await redis.get(cacheKey);
if (cached) return res.json(JSON.parse(cached));

// ... appel OpenLibrary ...
await redis.setex(cacheKey, 86400, JSON.stringify(book)); // TTL 24h
```

### 5.4 Rate Limiting Redis (`rateLimit.middleware.ts`)

> Remplace le store mémoire (qui se reset à chaque redémarrage Render) par un store Redis persistant et partagé entre instances.

```typescript
import { RedisStore } from "rate-limit-redis";
import { redis } from "../utils/redisClient";

export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  store: new RedisStore({ sendCommand: (...args) => redis.call(...args) }),
});
```

### 5.5 Variables d'environnement

| Variable    | Description                                           |
| ----------- | ----------------------------------------------------- |
| `REDIS_URL` | URL Upstash Redis (ex: `rediss://...upstash.io:6380`) |

Ajouter dans `.env.example` :

```env
REDIS_URL=rediss://your-redis-url:6380
```

### 5.6 Déploiement (Upstash)

1. Créer un compte sur [upstash.com](https://upstash.com/)
2. Créer une base Redis (région la plus proche de Render)
3. Copier l'URL `REDIS_URL` (format `rediss://...`)
4. Ajouter la variable dans les **Environment Variables** de Render

---

## 6. Priorité 3 - Mode Nuit (Dark Mode)

> Tailwind CSS v4 et shadcn/ui supportent nativement le dark mode via la stratégie `class`. L'ajout de `next-themes` suffit — les composants shadcn/ui s'adaptent automatiquement grâce aux variables CSS `--color-*`.

### 6.1 Installation

```bash
cd blablabook/frontend
npm install next-themes
```

### 6.2 ThemeProvider (`app/layout.tsx`)

Envelopper le `<body>` avec le provider :

```tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

> `suppressHydrationWarning` est nécessaire sur `<html>` pour éviter les erreurs d'hydratation Next.js liées au changement de classe `dark`.

### 6.3 Composant `ThemeToggle.tsx`

Créer `components/ThemeToggle.tsx` :

```tsx
"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Basculer le mode nuit"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

> `lucide-react` est déjà installé dans le projet — les icônes `Sun` et `Moon` sont disponibles.

### 6.4 Intégration dans la Navbar

Ajouter `<ThemeToggle />` dans [components/Navbar.tsx](blablabook/frontend/components/Navbar.tsx), aux côtés du futur `LanguageSwitcher` (section 4.4) :

```tsx
import { ThemeToggle } from "@/components/ThemeToggle";

// Dans la barre de navigation :
<nav>
  {/* ... autres liens ... */}
  <ThemeToggle />
  <LanguageSwitcher />
</nav>
```

### 6.5 Vérification des couleurs personnalisées

Vérifier que les overrides CSS dans [app/globals.css](blablabook/frontend/app/globals.css) définissent bien les variantes dark des couleurs de la charte graphique (fond, texte, card, border). shadcn/ui génère les tokens CSS automatiquement, mais les couleurs personnalisées ajoutées manuellement doivent avoir leur équivalent dark.

---

## 7. Priorité 4 - Finitions rapides

### 7.1 Toast Notifications (Sonner déjà installé)

> `sonner` v2.0.7 est déjà dans `package.json`. Le composant `<Toaster />` est déjà présent dans le layout. Il suffit d'utiliser les toasts dans les pages.

**Usage** :

```typescript
import { toast } from "sonner";

// Succès
toast.success("Livre ajouté à votre bibliothèque !");

// Erreur
toast.error("Une erreur est survenue.");

// Info
toast.info("Statut mis à jour.");
```

**Pages à mettre à jour** (remplacer `alert()` et messages statiques) :

- `library/page.tsx` : ajout livre, suppression, changement statut, note enregistrée
- `profile/page.tsx` : mise à jour profil, changement mot de passe, suppression compte
- `search/page.tsx` : ajout livre depuis la recherche

### 7.2 Optimisations mineures

| Amélioration                                         | Fichier                       | Effort |
| ---------------------------------------------------- | ----------------------------- | ------ |
| Loading skeleton sur la page library                 | `library/page.tsx`            | ~1h    |
| Compteur de caractères sur la textarea review        | `components/StarRating.tsx`   | ~30min |
| Mettre à jour `.env.example` et `.env.local.example` | `frontend/.env.local.example` | ~15min |

### 7.3 Refresh Token (si le temps le permet)

**Backend** : Ajouter `POST /auth/refresh` dans `auth.router.ts` et `auth.controller.ts`

```typescript
// Vérifier le refresh token en BDD → générer un nouveau accessToken
router.post("/auth/refresh", refreshTokenController);
```

**Frontend** : Intercepteur dans `lib/api.ts` pour renouveler automatiquement le token en cas de 401.

> ⚠️ Tâche plus complexe (~4h). À traiter uniquement si les priorités 1 et 2 sont complètes.

---

## 8. Backlog priorisé - Tâches Sprint 3

### 🔴 Priorité 1 - Notes et Avis - (Jour 1)

**Backend :**

- [ ] Modifier la validation Zod de `PATCH /library/:id` (accepter `rating`, `review`)
- [ ] Modifier la requête Prisma pour persister `rating` et `review`
- [ ] S'assurer que `GET /library` retourne `rating` et `review` dans la réponse

**Frontend :**

- [ ] Créer le composant `StarRating.tsx` (5 étoiles cliquables, readonly mode)
- [ ] Intégrer `StarRating` dans `library/page.tsx`
- [ ] Ajouter le champ `review` (textarea + sauvegarde)
- [ ] Mettre à jour `libraryService.ts` (enrichir `updateLibraryItem`)
- [ ] Mettre à jour les types TypeScript (`LibraryItem` → ajouter `rating`, `review`)

**Tests :**

- [ ] Ajouter cas de test `PATCH /library/:id` avec `rating` et `review`

### 🟠 Priorité 2b - Redis (Cache + Rate Limiting) - ✅ Done (PR #155)

**Setup :**

- [x] Installer `ioredis` et `rate-limit-redis` dans le backend
- [x] Créer `src/utils/redisClient.ts` (dégradation gracieuse si `REDIS_URL` absent)
- [x] Ajouter `REDIS_URL` dans `.env.example` et les variables Render
- [x] Créer un compte Upstash + base Redis (free tier)

**Cache OpenLibrary :**

- [x] Mettre en cache les résultats de `GET /books/search` (TTL 1h)
- [x] Mettre en cache les résultats de `GET /books/:openLibraryId` (TTL 24h)
- [x] Mettre en cache les résultats de `GET /books` (TTL 10min)

**Rate Limiting Redis :**

- [x] Remplacer le store mémoire par `RedisStore` dans `rateLimit.middleware.ts`
- [x] Tests unitaires Redis 8/8 ✅ (`tests/unit/utils/redisClient.test.ts`)

### 🟠 Priorité 2 - Internationalisation FR/EN - ✅ Done (PR #159)

**Setup :**

- [x] Installer `next-intl` (^4.8.3)
- [x] Créer `i18n/request.ts` (chargement messages SSR)
- [x] Configurer `src/middleware.ts` (routing locale)
- [x] Mettre à jour `next.config.ts` avec `withNextIntl`

**Traductions :**

- [x] Créer `messages/fr/` (home, navbar, footer, book, common, loading)
- [x] Créer `messages/en/` (home, navbar, footer, book, common, loading)

**Intégration pages :**

- [x] Restructurer `app/` → `app/[locale]/` (routing localisé)
- [x] `Navbar.tsx` avec sélecteur de langue
- [x] `app/[locale]/page.tsx` (accueil)
- [x] `app/[locale]/login/page.tsx`
- [x] `app/[locale]/register/page.tsx`
- [x] `app/[locale]/library/page.tsx`
- [x] `app/[locale]/search/page.tsx`
- [x] `app/[locale]/book/[id]/page.tsx`
- [x] `app/[locale]/profile/page.tsx`
- [x] `app/[locale]/not-found.tsx`
- [x] `Footer.tsx`

### 🟡 Priorité 3 - Mode Nuit - ✅ Done (PR #160)

- [x] Installer `next-themes` (^0.4.6)
- [x] Envelopper le layout avec `ThemeProvider` (`attribute="class"`, `enableSystem`)
- [x] Créer le composant `ThemeToggle.tsx` (Switch + icônes SunIcon/MoonIcon)
- [x] Intégrer `<ThemeToggle />` dans `Navbar.tsx`
- [x] Adapter toutes les pages et composants aux classes dark mode Tailwind

### 🟡 Priorité 4 - Finitions - (Jour 4)

- [ ] Intégrer les toasts Sonner dans `library/page.tsx` (ajout, suppression, statut, note)
- [ ] Intégrer les toasts Sonner dans `profile/page.tsx` (mise à jour profil, erreurs)
- [ ] Intégrer les toasts Sonner dans `search/page.tsx` (ajout livre)
- [ ] Vérifier et corriger les bugs résiduels
- [ ] Tester le flux complet en production
- [ ] Mettre à jour la documentation si nécessaire

### 🟢 Optionnel - Si le temps le permet

- [x] **Refresh token** : `POST /auth/refresh` avec rotation en BDD (PR #149) ✅
- [x] **Fix Safari** : proxy Next.js + `sameSite: "lax"` + `path` dynamique + `trust proxy` (PR #161) ✅
- [ ] **Loading skeletons** sur library et search
- [ ] **SEO** : métadonnées dynamiques sur `/book/[id]`

---

## 9. Référence rapide - Commandes

```bash
# Installation next-intl
cd blablabook/frontend
npm install next-intl

# Installation Redis (backend)
cd blablabook/backend
npm install ioredis rate-limit-redis

# Backend - Tests
npm test
npm run test:unit
npm run test:spec

# Frontend - Dev
cd blablabook/frontend
npm run dev

# Tester en local
curl http://localhost:3001/health         # Vérifier status API + DB
curl http://localhost:3001/books/search?q=tolkien  # Doit être mis en cache
```

---

## 9. Personnes responsables (suggestion)

| Tâche                                       | Assigné(e)                   |
| ------------------------------------------- | ---------------------------- |
| **Notes + Avis - Backend** (PATCH /library) | Rémi                         |
| **Notes + Avis - Frontend** (UI étoiles)    | Ophélie                      |
| **Mode nuit**                               | Ophélie                      |
| **Redis setup + cache OpenLibrary**         | Christopher + Rémi           |
| **i18n setup + traductions FR/EN**          | Paul + Remi                  |
| **i18n intégration pages + sélecteur**      | Christopher + Ophélie + Rémi |
| **Toasts Sonner + finitions**               | Tous                         |
| **Tests + corrections + déploiement**       | Paul + Christopher           |

---

## 10. Critères de validation du Sprint 3

À la fin du sprint, l'application doit permettre :

- [x] ✅ (acquis Sprint 2) Inscription, connexion, déconnexion
- [x] ✅ (acquis Sprint 2) Recherche et ajout de livres
- [x] ✅ (acquis Sprint 2) Gestion statut de lecture (TO_READ / READING / READ)
- [ ] Attribuer une note (1-5 étoiles) à un livre de la bibliothèque
- [ ] Rédiger et sauvegarder un avis personnel
- [ ] Naviguer en **français** (défaut) et en **anglais**
- [ ] Changer de langue via un sélecteur dans la navigation
- [ ] Recevoir des retours visuels (toasts) lors des actions importantes
- [ ] Les réponses OpenLibrary sont mises en cache (Redis) — pas d'appel répété à l'API
- [ ] Le rate limiting persiste entre les redémarrages Render (store Redis)
- [ ] Basculer entre le mode clair et le mode nuit via un bouton dans la navigation
- [ ] Le thème choisi est persisté (respect de la préférence système par défaut)

---

*Document rédigé le 2026-03-29 - à mettre à jour au fil de l'avancement du sprint.*
