import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - BlaBlaBook",
  description: "Comment BlaBlaBook protège et gère vos données personnelles.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm md:p-12">
        {/* Header */}
        <header className="mb-8 border-b border-gray-100 pb-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 uppercase">
            Politique de Confidentialité
          </h1>
          <p className="text-sm text-gray-500 italic">
            Dernière mise à jour : 16 mars 2026
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            La présente politique de confidentialité décrit la manière dont l
            {"'"}application
            <strong> BlaBlaBook</strong> collecte, utilise et protège les
            données personnelles de ses utilisateurs.
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-gray-600">
          <section>
            <h2 className="mb-3 text-xl font-medium text-gray-800">
              1. Données collectées
            </h2>
            <p>Lors de l{"'"}utilisation de BlaBlaBook, nous collectons :</p>
            <ul className="mt-2 ml-4 list-inside list-disc space-y-1">
              <li>Adresse email (pour l{"'"}authentification)</li>
              <li>Nom d{"'"}utilisateur</li>
              <li>
                Mot de passe (haché via <strong>Argon2</strong>)
              </li>
              <li>
                Données de bibliothèque (livres, avis, statuts de lecture)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-gray-800">
              2. Finalité du traitement
            </h2>
            <p>
              Vos données ne servent qu{"'"}au bon fonctionnement de l{"'"}
              application : gestion de votre compte, sauvegarde de vos lectures
              et amélioration du service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-gray-800">
              3. Services tiers
            </h2>
            <p>
              Nous utilisons l{"'"}API <strong>OpenLibrary</strong> pour
              enrichir les informations des livres. Aucune de vos données
              personnelles n{"'"}est transmise à ce service.
            </p>
          </section>

          <section className="rounded-lg border-l-4 border-indigo-500 bg-indigo-50 p-6">
            <h2 className="mb-3 text-xl font-medium text-indigo-800">
              4. Sécurité
            </h2>
            <p className="text-indigo-900/80">
              La sécurité est notre priorité. Outre le hachage des mots de
              passe, nous mettons en œuvre des mesures techniques pour prévenir
              toute fuite de données.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-gray-800">
              5. Vos droits (RGPD)
            </h2>
            <p>
              Vous disposez d{"'"}un droit d{"'"}accès, de rectification et de
              suppression de vos données. Pour l{"'"}exercer, contactez-nous :
            </p>
            <div className="mt-4 inline-block rounded-md border border-gray-200 bg-gray-50 p-4">
              Email :{" "}
              <a
                href="mailto:contact@blablabook.fr"
                className="font-bold text-indigo-600 hover:underline"
              >
                contact@blablabook.fr
              </a>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <footer className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
          <Link
            href="/"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            ← Retour à l{"'"}accueil
          </Link>
          <div className="space-x-4">
            <Link
              href="/cgu"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              CGU
            </Link>
            <Link
              href="/legal"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Mentions Légales
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
