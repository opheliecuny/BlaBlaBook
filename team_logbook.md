# Journal de bord de l'équipe

## Sprint 0

### 11/03/2026

La majorité des documents du sprint 0 ont été validés, on peaufine les détails pour pouvoir avoir une version propre en fin de semaine.

#### Infos individuelles

- **Ophélie :** Maquettes desktop terminées (TODO: ajuster quelques détails de cohérence avec les wf), début des maquettes mobile
- **Rémi :** Corrigé le diagramme des use-cases suite au retour d'Amo. Ajouté des user stories, comparé les wireframes et maquettes puis update du kanban.
- **Paul :** Finalisation "Analyses des risques" | Mise à jour de la liste des roles par dev | Révision des US | Mise à jour de la documentation pour éliminer les incohérences | Inscription à Neon
- **Christopher :**  Création des wireframes desktop et mobile de la page profil utilisateur et création du sitemap PlantUML : `docs/sprint 0/diagrammes/sitemap.puml`
(Représentation de l'arborescence frontend avec niveaux d'accès (public / authentifié))

---

### 12/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :** Finalisation des maquettes version mobile et ajout d'une page type pour les mentions légales. Harmonisation entre les wf et les maquettes avec Christopher. Validation des maquettes.
- **Rémi :** Mis à jour du kanban suite modifications de Paul prenant en compte les nouvelles user stories. Modifications finales du diagramme use-cases. Début de structure du dossier backend avec tests pour explorer l'API OpenLibrary et rédaction d'un bref résumé à son sujet.
- **Paul :** Amélioration MVP | MAJ documentation de conception MCD à MPD | Guide Git et GitHub avec recap convention de nommage branches et commit.
- **Christopher :** Initialisation du projet frontend, Mise en place de la structure du projet, Composants de base (Navbar, Footer, layout), Pages créées (6 routes MVP), ajustements UI homepage + navbar et Corrections wireframes MVP.

---

### 13/03/2026

Journée rétrospective.

---

## Sprint 1

### 16/03/2026

Démarrage du sprint 1. Chacun attaque sa dominante : initialisation BDD côté Ophélie, backend côté Rémi, pages secondaires côté Paul, et structure des pages MVP côté Christopher.

#### Infos individuelles

- **Ophélie :** Initialisation de prisma (v6 car vulnérabilités sur v7), mise en place d'un docker compose pour être sûr que tout le monde peut lancer facilement une bdd.
- **Rémi :** Implémentation des routes générales. Début des contrôleurs (book et auth) avec une base de test pour book. Exploration d'openLibrary un peu plus en profondeur.
- **Paul :** Pages /legal (politique confidentialité + RGPD) et /profile (gestion profil + sécurité + suppression compte). Configuration Prettier frontend.
- **Christopher :** Structure complète des pages MVP frontend : page de recherche `/search` (grille de résultats, états vides, pagination côté client) et page de détail `/book/:id`. Corrections accessibilité sur l'ensemble des formulaires (labels sr-only, name, required, autoComplete). Gestion des cas limites sur la recherche (requête vide, aucun résultat).

---

### 17/03/2026

Bonne dynamique d'équipe, les fonctionnalités principales avancent en parallèle sur le back et le front.

#### Infos individuelles

- **Ophélie :** Seeding bdd et centralisation des erreurs en back avec un middleware. Début de controller library (route GET fonctionnelle) !
- **Rémi :** Finalisation du auth.controller et mise en place de user.controller. Implémentation des tests associés et début de refactorisation des controllers.
- **Paul :** Mise à jour pages /register et /login (composants shadcn/ui Input/Label/Checkbox, state management, validation). Développement complet page /library : composants StatCard et EmptyState, filtres interactifs avec variants, gestion CRUD livres (ajout/suppression), stats dynamiques, optimisation Next.js Image (remotePatterns OpenLibrary). Configuration next.config.ts pour images externes.
- **Christopher :** Intégration des maquettes sur la homepage (hero, section livres du moment), la navbar (suppression barre de recherche, lien "Rechercher", logo Playfair), la page search (harmonisation largeur, polices, boutons) et la page détail livre (layout deux colonnes, tag genre, lien auteur, encadré statut de lecture). Alignement sur la charte graphique (polices Playfair/Lora/Inter, couleurs terracotta/primary).

---

### 18/03/2026

Journée de branchement sur les vraies APIs et d'ajustements suite aux mises à jour du backend.

#### Infos individuelles

- **Ophélie :** le controller library est complété et toutes les routes liées sont fonctionnelles (tests effectués), ne reste plus qu'à préciser un peu les erreurs spécifiques à prisma et zod mais ça n'empêche pas de les utiliser.
- **Rémi :** Mise à jour du backend : `GET /books` retourne désormais `author` (string unique), `id` et `coverThumbnail`. `GET /books/search` et `GET /books/:id` retournent `category` (string) au lieu d'un tableau. Correction auth.controller.
- **Paul :** Finalisation pages frontend avec composants shadcn/ui : amélioration page /profile (remplacement inputs HTML natifs par composants shadcn/ui Input/Label/Button pour harmonisation design system), transformation bouton "Ajouter un livre" en lien vers /search dans /library.

- **Christopher :** Branchement des 3 pages publiques sur l'API réelle : `/search` sur `GET /books/search`, `/book/:id` sur `GET /books/:id`, homepage sur `GET /books` (section livres aléatoires). Affichage des vraies couvertures avec fallback `default-cover.png`. Adaptation aux réponses API mises à jour par Rémi (champ `category`, auteur string). Migration de Google Fonts vers Bunny Fonts (respect RGPD). Protection de la route `/library` avec redirection vers `/login`.

---

### 19/03/2026

*Avancée significative sur l'intégration frontend-backend : auth JWT finalisée, library CRUD mergé, AuthContext créé par Paul, reviews PR #76 et #77.*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :** rebase feature/api-search-integration sur main, analyse état du projet, identification blocage isbn + conflit auth cookie/localStorage, reviews PR #76 et #77, communication équipe

---

### 20/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 23/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 24/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 25/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 26/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 27/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 30/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 31/03/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 01/04/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 02/04/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---

### 03/04/2026

*Résumé*

#### Infos individuelles

- **Ophélie :**
- **Rémi :**
- **Paul :**
- **Christopher :**

---
