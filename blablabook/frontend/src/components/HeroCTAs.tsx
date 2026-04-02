"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";

export default function HeroCTAs() {
  const t = useTranslations("home");
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated) {
    return (
      <div className="flex justify-around gap-2 sm:justify-start sm:gap-3">
        <Link
          href="/library"
          className="sm:border-input sm:text-foreground inline-flex h-auto items-center justify-center rounded-md border border-[var(--accent-alt)] bg-[var(--color-btn-subtle)] p-2 text-center text-sm font-semibold text-[var(--accent-alt)] hover:bg-[var(--color-btn-subtle-hover)] active:bg-[var(--color-btn-subtle-active)] dark:bg-gray-800"
        >
          {t("hero.libraryCta")}
        </Link>
        <Link
          href="/search"
          className="inline-flex h-auto items-center justify-center rounded-md bg-[var(--accent-alt)] p-2 text-center text-sm font-semibold text-white hover:bg-[var(--accent-alt-hover)]"
        >
          {t("hero.searchCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex justify-around gap-2 sm:justify-start sm:gap-3">
      <Link
        href="/login"
        className="sm:border-input sm:text-foreground inline-flex h-auto items-center justify-center rounded-md border border-[var(--accent-alt)] bg-[var(--color-btn-subtle)] p-2 text-center text-sm font-semibold text-[var(--accent-alt)] hover:bg-[var(--color-btn-subtle-hover)] active:bg-[var(--color-btn-subtle-active)] dark:bg-gray-800"
      >
        {t("hero.loginCta")}
      </Link>
      <Link
        href="/register"
        className="inline-flex h-auto items-center justify-center rounded-md bg-[var(--accent-alt)] p-2 text-center text-sm font-semibold text-white hover:bg-[var(--accent-alt-hover)]"
      >
        {t("hero.registerCta")}
      </Link>
    </div>
  );
}
