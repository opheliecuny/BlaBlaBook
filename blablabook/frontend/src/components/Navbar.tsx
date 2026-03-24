"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
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
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6 min-w-0">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-playfair shrink-0">
          BlaBlaBook
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-3 ml-auto">
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
              <Button size="sm" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                Connexion
              </Link>
              <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
                Inscription
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu */}
        <div className="ml-auto sm:hidden">
          <Sheet>
            <SheetTrigger aria-label="Ouvrir le menu">
                <Menu className="h-6 w-6" />
            </SheetTrigger>

            <SheetContent side="right" className="w-64 p-6">
              <nav className="flex flex-col gap-4 mt-6">
                <Link className="text-center" href="/">Accueil</Link>
                <Link className="text-center" href="/search">Rechercher</Link>

                {isAuthenticated ? (
                  <>
                    <Link className="text-center" href="/library">Ma bibliothèque</Link>
                    <Link className="text-center" href="/profile">Compte</Link>
                    <Button className="text-center" onClick={handleLogout}>
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Link className="text-center" href="/login">
                      Connexion
                    </Link>
                    <Link className="text-center" href="/register">
                      Inscription
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}