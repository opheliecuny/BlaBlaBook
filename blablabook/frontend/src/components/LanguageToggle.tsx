"use client";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import Image from "next/image";

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
    const search = window.location.search;
    startTransition(() => {
      router.replace(segments.join("/") + search);
    });
  }

  return (
    <button
      onClick={switchLocale}
      className="cursor-pointer leading-none"
      aria-label={t("switchTo")}
    >
      <Image
        src={isEnglish ? "https://flagcdn.com/w40/fr.png" : "https://flagcdn.com/w40/gb.png"}
        alt={isEnglish ? "FR" : "GB"}
        width={40}
        height={27}
        unoptimized
        className="h-4 w-6 object-cover"
      />
    </button>
  );
}