import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions Légales - BlaBlaBook",
  description: "Mentions légales de BlaBlaBook",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm md:p-12">
        {/* Header */}
        <header className="mb-8 border-b border-gray-100 pb-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 uppercase">
            Mentions Légales
          </h1>
          <p className="text-sm text-gray-500 italic">
            Dernière mise à jour : 16 mars 2026
          </p>
          <p className="mt-4 text-sm text-gray-700">
            La présente politique de confidentialité décrit la manière dont l
            {"'"}application BlaBlaBook collecte, utilise et protège les données
            personnelles de ses utilisateurs dans le cadre de l{"'"}utilisation
            de la plateforme.
          </p>
        </header>

        {/* Politique de Confidentialité */}
        <section className="mb-8">
          <div className="space-y-8 text-gray-600">
            <div>
              <h2 className="mb-3 text-xl font-medium text-gray-800">
                1. Données collectées
              </h2>
              <p className="leading-relaxed">
                Lors de l{"'"}utilisation de l{"'"}application BlaBlaBook,
                certaines données peuvent être collectées afin d{"'"}assurer le
                bon fonctionnement du service. Ces données peuvent inclure :
              </p>
              <ul className="mt-2 ml-4 list-inside list-disc space-y-1">
                <li>Adresse email (pour la connexion)</li>
                <li>Nom d{"'"}utilisateur (affiché publiquement)</li>
                <li>Mot de passe (stocké de manière sécurisée sous hachée)</li>
                <li>
                  Données liées à la bibliothèque personnelles de l{"'"}
                  utilisateur (livres ajoutés, statut de lecture, etc.)
                </li>
                <li>Notes et avis personnels sur les livres</li>
                <p className="mt-4">
                  Aucune données sensible supplémentaire n{"'"}est collectée
                  sans le consentement explicite de l{"'"}utilisateur
                </p>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-medium text-gray-800">
                2. Finalité de la collecte
              </h2>
              <p className="leading-relaxed">
                Les données collectées sont utilisées uniquement dans le cadre
                du fonctionnement de l{"'"}application. Elles permettent
                notamment :
              </p>
              <ul className="mt-2 ml-4 list-inside list-disc space-y-1">
                <li>La création et la gestion de comptes utilisateurs</li>
                <li>La gestion de la bibliothèque personnelle</li>
                <li>
                  L{"'"}amélioration de l{"'"}expérience utilisateur
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-medium text-gray-800">
                3. Utilisation d{"'"}API externes
              </h2>
              <p className="leading-relaxed">
                L{"'"}application peut utiliser des services tierces
                (openLibraryBook API) afin de récupérer des informations sur les
                livres (titre, auteur, description, couverture, etc.). Ces
                informations sont utilisées pour enrichir les fonctionnalités de
                recherche et de découverte de livres.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-medium text-gray-800">
                4. Conservation des données
              </h2>
              <p className="leading-relaxed">
                Les données personnelles sont conservées uniquement pendant la
                durée nécessaire au fonctionnement du service. Les utilisateurs
                peuvent demander la suppression de leurs données à tout moment.
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6">
              <h2 className="mb-3 text-xl font-medium text-blue-800">
                5. Sécurité des données
              </h2>
              <p className="leading-relaxed text-blue-900/80">
                Des mesures de sécurité appropriées sont mises en place pour
                protéger les données des utilisateurs contre tout accès non
                autorisé, modification, divulgation ou destruction. Les mots de
                passe sont notamment stockés sous forme hashé avec argon2.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-medium text-gray-800">
                6. Partage des données
              </h2>
              <p className="leading-relaxed">
                Les données personnelles des utilisateurs ne sont ni vendues, ni
                louées, ni partagées avec des tiers à des fins commerciales.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-medium text-gray-800">
                7. Droits des utilisateurs
              </h2>
              <p className="leading-relaxed">
                Conformément au Règlement Général sur la Protection des Données
                (RGPD), chaque utilisateur dispose des droits suivants :
              </p>
              <ul className="mt-2 ml-4 list-inside list-disc space-y-1">
                <li>Droit d{"'"}accès à ses données personnelles</li>
                <li>Droit de rectification</li>
                <li>Droit à l{"'"}effacement de ses données</li>
                <li>Droit à limitation du traitement</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-medium text-gray-800">
                8. Contact
              </h2>
              <p className="leading-relaxed">
                Pour toute question relative à la protection des données ou pour
                exercer leurs droits, les utilisateurs peuvent contacter les
                responsables du projet à l{"'"}adresse suivante :
                <br />
                <a
                  href="mailto:contact@blablabook.fr"
                  className="text-indigo-600 hover:underline"
                >
                  contact@blablabook.fr
                </a>
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-medium text-gray-800">
                9. Modifications
              </h2>
              <p className="leading-relaxed">
                Cette politique de confidentialité peut être mise à jour à tout
                moment afin de refléter les évolutions du service ou de la
                réglementation. Les utilisateurs sont invités à consulter
                régulièrement cette page.
              </p>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <footer className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
          <Link
            href="/"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            ← Retour à l{"'"}accueil
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/privacy"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Politique de confidentialité
            </Link>
            <div className="text-xs text-gray-600">|</div>
            <Link
              href="/cgu"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              CGU
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
