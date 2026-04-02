# Propositions d'améliorations UX — Sprint 3

**Auteur :** Christopher
**Date :** 31/03/2026
**Objectif :** Liste de propositions à discuter au standup du 01/04. Chaque point est indépendant — on priorise ensemble demain matin.

---

## Homepage

**1. Remplacement automatique des cartes après ajout**
Quand un utilisateur ajoute un livre depuis "Livres du moment", la carte affiche "✓ Ajouté" puis est remplacée par un nouveau livre après 2-3 secondes. La sélection reste toujours fraîche et incite à explorer.
→ *Impact technique : section "Livres du moment" à passer en Client Component.*

**2. Bouton "Rafraîchir" la sélection**
Icône de rafraîchissement à côté du titre "Livres du moment" pour recharger 4 nouveaux livres sans recharger la page.

**3. Indicateur "Sélection personnalisée"**
Quand l'utilisateur est connecté, afficher "Sélection personnalisée" au lieu de "Sélection aléatoire" pour lui signaler que les suggestions sont adaptées à ses goûts (algo de recommandation déjà en place en backend).

---

## Recherche

**4. Skeleton loading**
Ajouter un écran de chargement avec des rectangles animés (skeletons) à la place de l'écran blanc entre le clic et l'affichage des résultats.

**5. Suggestions instantanées (autocomplete)**
Après 3 caractères, dropdown avec les 5 premiers résultats (titre + auteur + miniature) sans soumettre le formulaire. Permet de trouver un livre plus vite.

---

## Bibliothèque

**6. Tri visible**
Sélecteur de tri : date d'ajout, titre A-Z, auteur, note. Le backend le supporte déjà (`?sort=...&order=...`) mais le frontend ne l'expose pas.

**7. Affichage des notes sur les cartes**
Afficher visuellement la note (étoiles) quand un livre a été noté. Aperçu rapide des préférences sans ouvrir la fiche.

**8. Filtre par note**
Pouvoir filtrer par rating (★★★★★, ★★★★, etc.) en plus des filtres par statut existants.

**9. Mode liste / grille**
Toggle pour basculer entre la vue grille (couvertures) et une vue liste compacte (titre + auteur + statut sur une ligne). Utile avec beaucoup de livres.

**10. Statistiques enrichies**
Ajouter sous les 3 compteurs actuels : "Auteur le plus lu", "Genre préféré", "Dernière lecture". Données déjà en base.

**11. Onboarding bibliothèque vide**
Pour un nouvel utilisateur : écran visuel avec illustration + "Commencez par ajouter vos premiers livres" + bouton vers la recherche, au lieu du message texte actuel.

---

## Fiche livre

**12. Section "Vous aimerez aussi"**
En bas de `/book/:id`, 4 livres du même genre ou auteur. Encourage la découverte.

**13. Bouton "Partager"**
Copie le lien du livre dans le presse-papier avec un toast "Lien copié !".

---

## UX globale

**14. Confirmation visuelle améliorée pour "+ Biblio"**
Animation de la carte (scale + check animé) quand un livre est ajouté, au lieu du simple texte. Plus satisfaisant, surtout sur mobile.

**15. Compteur de livres dans la Navbar**
Badge à côté de "Ma bibliothèque" indiquant le nombre total de livres. Déjà disponible via le `LibraryStatusContext` en place.

**16. Toast de bienvenue**
Au premier chargement après connexion : "Bienvenue {username} — {n} livres dans votre bibliothèque". Renforce l'engagement.
