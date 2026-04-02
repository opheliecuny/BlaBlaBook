"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { logout as logoutService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

const ThemeToggle = dynamic(() => import("./ThemeToggle"), { ssr: false });

export default function Navbar() {
  const t = useTranslations("components.navbar");
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const LanguageToggle = dynamic(() => import("./LanguageToggle"), {
    ssr: false,
  });

  async function handleLogout() {
    await logoutService();
    logout();
    router.push("/");
  }

  return (
    <header className="border-border bg-background sticky top-0 z-50 border-b pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 max-w-7xl min-w-0 items-center gap-6 px-4">
        {/* Logo */}
        <Link href="/" className="font-playfair shrink-0 text-xl">
          BlaBlaBook
        </Link>

        {/* Desktop nav */}
        <nav className="ml-auto hidden items-center gap-3 sm:flex">
          <Link href="/" className="hover:text-primary text-sm">
            {t("home")}
          </Link>
          <Link href="/search" className="hover:text-primary text-sm">
            {t("search")}
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/library" className="hover:text-primary text-sm">
                {t("library")}
              </Link>
              <Link href="/profile" className="hover:text-primary text-sm">
                {t("profile")}
              </Link>
              <Button size="sm" onClick={handleLogout}>
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                )}
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "sm" }))}
              >
                {t("register")}
              </Link>
            </>
          )}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        {/* Mobile menu */}
        <div className="ml-auto flex items-center gap-3 sm:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger aria-label={t("openMenu")}>
              <Menu className="h-6 w-6" />
            </SheetTrigger>

            <SheetContent side="right" className="w-64 p-6">
              <nav className="mt-6 flex flex-col gap-4">
                <Link
                  className="text-center"
                  href="/"
                  onClick={() => setOpen(false)}
                >
                  {t("home")}
                </Link>
                <Link
                  className="text-center"
                  href="/search"
                  onClick={() => setOpen(false)}
                >
                  {t("search")}
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      className="text-center"
                      href="/library"
                      onClick={() => setOpen(false)}
                    >
                      {t("library")}
                    </Link>
                    <Link
                      className="text-center"
                      href="/profile"
                      onClick={() => setOpen(false)}
                    >
                      {t("profile")}
                    </Link>
                    <Button
                      className="text-center"
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                    >
                      {t("logout")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      className="text-center"
                      href="/login"
                      onClick={() => setOpen(false)}
                    >
                      {t("login")}
                    </Link>
                    <Link
                      className="text-center"
                      href="/register"
                      onClick={() => setOpen(false)}
                    >
                      {t("register")}
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
