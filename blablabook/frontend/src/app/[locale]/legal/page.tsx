import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions Légales - BlaBlaBook",
  description: "Mentions légales de BlaBlaBook",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm md:p-12 dark:bg-gray-800">
        {/* Header */}
        <header className="mb-8 border-b border-border pb-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground uppercase">
            Mentions Légales
          </h1>
          <time dateTime="2026-03-24" className="text-sm text-gray-500 italic">
            Dernière mise à jour : 24 mars 2026
          </time>
        </header>

        {/* Content */}
        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
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
            <h2 className="mb-3 text-xl font-medium text-foreground">
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
            <h2 className="mb-3 text-xl font-medium text-foreground">
              3. Liens externes
            </h2>
            <p>
              Le site peut contenir des liens vers des sites externes. Les
              éditeurs ne peuvent être tenus responsables du contenu de ces sites
              tiers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              4. Contact
            </h2>
            <p>
              Pour toute question, vous pouvez nous contacter à l’adresse
              suivante :
            </p>
            <address className="mt-4 inline-block rounded-md border border-gray-200 bg-background p-4">
              Email :{" "}
              <a
                href="mailto:contact@blablabook.fr"
                className="font-bold text-primary hover:underline"
              >
                contact@blablabook.fr
              </a>
            </address>
          </section>
        </div>

        {/* Footer Links */}
        <footer aria-label="Liens légaux" className="mt-12 flex items-center justify-between border-t border-border pt-8">
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
            aria-label="Retour à la page d'accueil"
          >
            ← Retour à l&apos;accueil
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-gray-700"
              aria-label="Voir la politique de confidentialité"
            >
              Politique de confidentialité
            </Link>
            <div className="text-xs text-muted-foreground" aria-hidden="true">
              |
            </div>
            <Link
              href="/cgu"
              className="text-xs text-muted-foreground hover:text-gray-700"
              aria-label="Voir les conditions générales d'utilisation"
            >
              CGU
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}