"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { logout as logoutService } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logoutService();
    logout();
    router.push("/");
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="font-light text-xl text-[#374151] shrink-0 font-playfair">
          BlaBlaBook
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 shrink-0 ml-auto">
          <Link href="/" className="text-sm hover:text-primary">
            Accueil
          </Link>
          <Link href="/search" className="text-sm hover:text-primary">
            Rechercher
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/library" className="text-sm hover:text-primary">
                Ma bibliothèque
              </Link>
              <Link href="/profile" className="text-sm hover:text-primary">
                Compte
              </Link>
              <Button variant="outline" size="sm" className="border-primary hover:bg-primary/5" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-primary")}>
                Connexion
              </Link>
              <Link href="/register" className={cn(buttonVariants({ size: "sm" }), "shadow-[0_2px_8px_rgba(55,48,163,0.4)]")}>
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
