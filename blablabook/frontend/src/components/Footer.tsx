import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo + tagline */}
          <div>
            <p className="font-bold text-lg">BlaBlaBook</p>
            <p className="text-sm text-muted-foreground mt-1">
              La plateforme qui facilite votre gestion de lecture.
            </p>
          </div>

          {/* Plan du site */}
          <div>
            <p className="font-semibold text-sm mb-3">Plan du site</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground">Accueil</Link></li>
              <li><Link href="/login" className="hover:text-foreground">Connexion</Link></li>
              <li><Link href="/profile" className="hover:text-foreground">Mon compte</Link></li>
              <li><Link href="/library" className="hover:text-foreground">Ma bibliothèque</Link></li>
            </ul>
          </div>

          {/* Mentions légales */}
          <div>
            <p className="font-semibold text-sm mb-3">Mentions légales</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Politique de confidentialité</Link></li>
              <li><Link href="#" className="hover:text-foreground">CGU</Link></li>
              <li><Link href="#" className="hover:text-foreground">Mentions légales</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-4 text-xs text-muted-foreground">
          © 2026 - Christoper CART, Rémi CLOUET, Ophélie CUNY, Paul SEBAS
        </div>
      </div>
    </footer>
  );
}
