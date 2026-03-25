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
            Dernière mise à jour : 24 mars 2026
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-gray-600">
          <section>
            <h2 className="mb-3 text-xl font-medium text-gray-800">
              1. Éditeur du site
            </h2>
            <p>
              Le site <strong>BlaBlaBook</strong> est un projet réalisé dans le cadre
              de fin de formation à l’école O’clock.
            </p>
            <p className="mt-2">
              Équipe projet : Christopher CART, Rémi CLOUET, Ophélie CUNY, Paul SEBAS
              <br />
              Résidence : France
              <br />
              Responsable de publication : l’équipe projet
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-gray-800">
              2. Hébergement
            </h2>
            <p>
              Le site est hébergé par :
            </p>
            <p className="mt-2">
              Render (ou autre hébergeur à préciser)
              <br />
              Les informations complètes de l’hébergeur seront renseignées dès
              leur validation.
            </p>
          </section>


          <section>
            <h2 className="mb-3 text-xl font-medium text-gray-800">
              3. Liens externes
            </h2>
            <p>
              Le site peut contenir des liens vers des sites externes. Les
              éditeurs ne peuvent être tenus responsables du contenu de ces sites
              tiers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-gray-800">
              4. Contact
            </h2>
            <p>
              Pour toute question, vous pouvez nous contacter à l’adresse
              suivante :
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
            ← Retour à l&apos;accueil
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