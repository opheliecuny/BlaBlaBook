import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - BlaBlaBook",
  description: "Comment BlaBlaBook protège et gère vos données personnelles.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm md:p-12">
        {/* Header */}
        <header className="mb-8 border-b border-border pb-8">
          <h1 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-foreground uppercase">
            Politique de Confidentialité
          </h1>
          <time dateTime="2026-03-24" className="text-sm text-gray-500 italic">
            Dernière mise à jour : 24 mars 2026
          </time>
          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            La présente politique de confidentialité décrit comment l{"'"}application
            <strong> BlaBlaBook</strong> collecte, utilise et protège les données personnelles de ses utilisateurs.
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              1. Données collectées
            </h2>
            <p>Nous collectons les informations suivantes :</p>
            <ul className="mt-2 ml-4 list-inside list-disc space-y-1">
              <li>Adresse email (pour l&apos;authentification)</li>
              <li>Pseudo ou nom d&apos;utilisateur</li>
              <li>Mot de passe (haché de manière sécurisée)</li>
              <li>Données de bibliothèque : livres, avis, statuts de lecture</li>
            </ul>
            <p className="mt-2">
              Nous utilisons également des cookies pour gérer votre session et maintenir votre connexion sécurisée.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              2. Finalité du traitement
            </h2>
            <p>
              Les données collectées sont utilisées uniquement pour :
            </p>
            <ul className="mt-2 ml-4 list-inside list-disc space-y-1">
              <li>La création et la gestion de votre compte utilisateur</li>
              <li>La sauvegarde et la consultation de votre bibliothèque personnelle</li>
              <li>L’amélioration et le bon fonctionnement du service</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              3. Services tiers
            </h2>
            <p>
              Nous utilisons l&apos;API <strong>OpenLibrary</strong> pour enrichir les informations des livres. Aucune de vos données personnelles n&apos;est transmise à ce service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              4. Sécurité
            </h2>
            <p>
              La sécurité de vos données est notre priorité. Nous mettons en œuvre des mesures techniques pour protéger vos informations personnelles contre tout accès non autorisé.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              5. Durée de conservation
            </h2>
            <p>
              Vos données sont conservées tant que votre compte est actif. Elles sont supprimées immédiatement après la fermeture de votre compte.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              6. Vos droits (RGPD)
            </h2>
            <p>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité de vos données. Vous pouvez également limiter ou vous opposer au traitement de vos données.
            </p>
            <p className="mt-2">
              Pour exercer vos droits, contactez-nous à :
            </p>
            <address className="mt-4 inline-block rounded-md border border-gray-200 bg-background p-4">
              Email :{" "}
              <a
                href="mailto:contact@blablabook.fr"
                className="font-bold text-primary hover:underline"
                aria-label="Envoyer un email à contact@blablabook.fr"
              >
                contact@blablabook.fr
              </a>
            </address>
            <p className="mt-2 text-sm text-gray-500">
              Vous pouvez également contacter la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CNIL</a> pour toute réclamation concernant vos données personnelles.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <footer className="mt-12 flex items-center justify-between border-t border-border pt-8">
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Retour à l&apos;accueil
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/cgu"
              className="text-xs text-muted-foreground hover:text-gray-700"
              aria-label="Voir les Conditions Générales d'Utilisation"
            >
              CGU
            </Link>
            <div className="text-xs text-muted-foreground" aria-hidden="true">
              |
            </div>
            <Link
              href="/legal"
              className="text-xs text-muted-foreground hover:text-gray-700"
              aria-label="Voir les Mentions Légales"
            >
              Mentions Légales
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}