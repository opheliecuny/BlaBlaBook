"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

export default function LanguageToggle() {
  const t = useTranslations("components.languageToggle");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const isEnglish = locale === "en";

  function switchLocale() {
    const newLocale = isEnglish ? "fr" : "en";
    const segments = pathname.split("/");
    segments[1] = newLocale;
    startTransition(() => {
      router.replace(segments.join("/"));
    });
  }

  return (
    <button
      onClick={switchLocale}
      className="cursor-pointer text-xl leading-none"
      aria-label={t("switchTo")}
    >
      {isEnglish ? "🇫🇷" : "🇬🇧"}
    </button>
  );
}