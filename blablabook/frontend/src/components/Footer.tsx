"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("components.footer");

  return (
    <footer className="border-border bg-background mt-auto border-t">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:gap-16 md:text-left">
          
          {/* Logo + tagline + copyright */}
          <div className="flex flex-col">
            <p className="text-lg font-bold font-playfair">BlaBlaBook</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {t("tagline")}
            </p>
            <p className="text-muted-foreground mt-auto pt-6 text-xs">
              {t("copyright")}
            </p>
          </div>

          {/* Plan du site */}
          <div>
            <p className="mb-3 text-sm font-semibold">
              {t("siteMapTitle")}
            </p>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-foreground">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground">
                  {t("login")}
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-foreground">
                  {t("profile")}
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-foreground">
                  {t("library")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Mentions légales */}
          <div>
            <p className="mb-3 text-sm font-semibold">
              {t("legalTitle")}
            </p>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/cgu" className="hover:text-foreground">
                  {t("cgu")}
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-foreground">
                  {t("legalNotice")}
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}