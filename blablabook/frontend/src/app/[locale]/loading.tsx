"use client";

import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center gap-6 px-4">
      <p className="text-2xl font-bold tracking-tight select-none">
        <span className="text-foreground">BlaBlaBook</span>
      </p>
      <div className="relative h-10 w-10" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border-4 border-border" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
      </div>
      <div role="status">
        <p className="text-muted-foreground text-sm animate-pulse">
          {t("loading.status")}
        </p>
      </div>
    </div>
  );
}