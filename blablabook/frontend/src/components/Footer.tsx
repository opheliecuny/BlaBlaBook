import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-border bg-background mt-auto border-t">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-16">
          {/* Logo + tagline + copyright */}
          <div className="flex flex-col">
            <p className="text-lg font-bold font-playfair">BlaBlaBook</p>
            <p className="text-muted-foreground mt-1 text-sm">
              La plateforme qui facilite votre gestion de lecture.
            </p>
            <p className="text-muted-foreground mt-auto pt-6 text-xs">
              © 2026 - Christopher CART, Rémi CLOUET, Ophélie CUNY, Paul SEBAS
            </p>
          </div>

          {/* Plan du site */}
          <div>
            <p className="mb-3 text-sm font-semibold">Plan du site</p>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-foreground">
                  Mon compte
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-foreground">
                  Ma bibliothèque
                </Link>
              </li>
            </ul>
          </div>

          {/* Mentions légales */}
          <div>
            <p className="mb-3 text-sm font-semibold">Mentions légales</p>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cgu" className="hover:text-foreground">
                  CGU
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-foreground">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
