"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
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
import { useState } from "react";
import { useTranslations } from "next-intl";

const ThemeToggle = dynamic(() => import("./ThemeToggle"), { ssr: false });

export default function Navbar() {
  const t = useTranslations("navbar");
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logoutService();
    logout();
    router.push("/");
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6 min-w-0">

        {/* Logo */}
        <Link href="/" className="text-xl font-playfair shrink-0">
          BlaBlaBook
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-3 ml-auto">
          <Link href="/" className="text-sm hover:text-primary">
            {t("home")}
          </Link>
          <Link href="/search" className="text-sm hover:text-primary">
            {t("search")}
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/library" className="text-sm hover:text-primary">
                {t("library")}
              </Link>
              <Link href="/profile" className="text-sm hover:text-primary">
                {t("profile")}
              </Link>
              <Button size="sm" onClick={handleLogout}>
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                {t("login")}
              </Link>
              <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
                {t("register")}
              </Link>
            </>
          )}
        </nav>
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>

        {/* Mobile menu */}
        <div className="ml-auto flex items-center gap-3 sm:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger aria-label="Ouvrir le menu">
              <Menu className="h-6 w-6" />
            </SheetTrigger>

            <SheetContent side="right" className="w-64 p-6">
              <nav className="flex flex-col gap-4 mt-6">
                <Link className="text-center" href="/" onClick={() => setOpen(false)}>Accueil</Link>
                <Link className="text-center" href="/search" onClick={() => setOpen(false)}>Rechercher</Link>

                {isAuthenticated ? (
                  <>
                    <Link className="text-center" href="/library" onClick={() => setOpen(false)}>{t("library")}</Link>
                    <Link className="text-center" href="/profile" onClick={() => setOpen(false)}>{t("profile")}</Link>
                    <Button className="text-center" onClick={() => { handleLogout(); setOpen(false); }}>
                      {t("logout")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link className="text-center" href="/login" onClick={() => setOpen(false)}>
                      {t("login")}
                    </Link>
                    <Link className="text-center" href="/register" onClick={() => setOpen(false)}>
                      {t("logout")}
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
