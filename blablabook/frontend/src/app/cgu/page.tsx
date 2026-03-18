import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CGU - BlaBlaBook",
  description: "Conditions Générales d'Utilisation (CGU) de BlaBlaBook",
};

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm md:p-12">
        {/* Header */}
        <header className="mb-8 border-b border-gray-100 pb-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 uppercase">
            Conditions Générales d{"'"}Utilisation
          </h1>
          <p className="text-sm text-gray-500 italic">
            Dernière mise à jour : 16 mars 2026
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-gray-600">
          <section>
            <h2 className="mb-3 text-xl font-medium text-gray-800">1. Objet</h2>
            <p>
              Les présentes Conditions Générales d{"'"}Utilisation ont pour
              objet l{"'"}encadrement juridique des modalités de mise à
              disposition du site et des services par{" "}
              <strong>BlaBlaBook</strong> et de définir les conditions d{"'"}
              accès et d{"'"}utilisation des services par l{"'"}Utilisateur.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-gray-800">
              2. Accès au site
            </h2>
            <p>
              Le site est accessible gratuitement en tout lieu à tout
              Utilisateur ayant un accès à Internet. Tous les frais supportés
              par l{"'"}Utilisateur pour accéder au service (matériel
              informatique, logiciels, connexion Internet, etc.) sont à sa
              charge.
            </p>
          </section>

          <section className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6">
            <h2 className="mb-3 text-xl font-medium text-blue-800">
              3. Propriété Intellectuelle
            </h2>
            <p className="text-blue-900/80">
              Les marques, logos, signes ainsi que tous les contenus du site
              (textes, images, son...) font l{"'"}objet d{"'"}une protection par
              le Code de la propriété intellectuelle et plus particulièrement
              par le droit d{"'"}auteur.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-gray-800">
              4. Responsabilité
            </h2>
            <p>
              Les sources des informations diffusées sur le site sont réputées
              fiables mais le site ne garantit pas qu{"'"}il soit exempt de
              défauts, d{"'"}erreurs ou d{"'"}omissions. L{"'"}éditeur ne pourra
              être tenu responsable de l{"'"}usage et de l{"'"}interprétation de
              l{"'"}information contenue dans ce site.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-gray-800">
              5. Droit applicable
            </h2>
            <p>
              La législation française s{"'"}applique au présent contrat. En cas
              d{"'"}absence de résolution amiable d{"'"}un litige né entre les
              parties, les tribunaux français seront seuls compétents pour en
              connaître.
            </p>
          </section>
        </div>

        {/* Footer links */}
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
              href="/legal"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Mentions légales
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
