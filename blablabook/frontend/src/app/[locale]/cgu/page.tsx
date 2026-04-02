import type { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cgu");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function CGUPage() {
  const t = useTranslations("cgu");

  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl rounded-2xl bg-card p-8 shadow-sm sm:p-10 md:p-12 dark:bg-card">
        {/* Header */}
        <header className="mb-8 border-b border-border pb-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground uppercase">
            {t("header.title")}
          </h1>
          <time dateTime="2026-03-16" className="text-sm text-muted-foreground italic">
            {t("header.lastUpdate")}
          </time>
        </header>

        {/* Content */}
        <div className="space-y-8 text-muted-foreground">
          <section aria-labelledby="section-objet">
            <h2 id="section-objet" className="mb-3 text-xl font-medium text-foreground">
              {t("sections.objet.title")}
            </h2>
            <p>{t("sections.objet.content")}</p>
          </section>

          <section aria-labelledby="section-acces">
            <h2 id="section-acces" className="mb-3 text-xl font-medium text-foreground">
              {t("sections.acces.title")}
            </h2>
            <p>{t("sections.acces.content")}</p>
          </section>

          <section aria-labelledby="section-propriete">
            <h2 id="section-propriete" className="mb-3 text-xl font-medium text-foreground">
              {t("sections.propriete.title")}
            </h2>
            <p>{t("sections.propriete.content")}</p>
          </section>

          <section aria-labelledby="section-responsabilite">
            <h2 id="section-responsabilite" className="mb-3 text-xl font-medium text-foreground">
              {t("sections.responsabilite.title")}
            </h2>
            <p>{t("sections.responsabilite.content")}</p>
          </section>

          <section aria-labelledby="section-droit">
            <h2 id="section-droit" className="mb-3 text-xl font-medium text-foreground">
              {t("sections.droit.title")}
            </h2>
            <p>{t("sections.droit.content")}</p>
          </section>
        </div>

        {/* Footer links */}
        <footer
          aria-label={t("footer.aria.label")}
          className="mt-12 flex flex-col items-center gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
            aria-label={t("footer.aria.home")}
          >
            ← {t("footer.backHome")}
          </Link>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:divide-x sm:divide-gray-200">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground sm:pr-4"
              aria-label={t("footer.aria.privacy")}
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="/legal"
              className="text-sm text-muted-foreground hover:text-foreground sm:pl-4"
              aria-label={t("footer.aria.legal")}
            >
              {t("footer.legal")}
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}