import type { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function LegalPage() {
  const t = useTranslations("legal");

  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl rounded-2xl bg-card p-8 shadow-sm md:p-12 dark:bg-card">
        {/* Header */}
        <header className="mb-8 border-b border-border pb-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground uppercase">
            {t("header.title")}
          </h1>
          <time dateTime="2026-03-24" className="text-sm text-muted-foreground italic">
            {t("header.lastUpdate")}
          </time>
        </header>

        {/* Content */}
        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              {t("sections.editor.title")}
            </h2>
            <p>
              <strong>BlaBlaBook</strong> {t("sections.editor.content1")}
            </p>
            <p className="mt-2">
              {t("sections.editor.content2")}
              <br />
              {t("sections.editor.residence")}
              <br />
              {t("sections.editor.publisher")}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              {t("sections.hosting.title")}
            </h2>
            <p>{t("sections.hosting.content1")}</p>
            <p className="mt-2">
              {t("sections.hosting.content2")}
              <br />
              {t("sections.hosting.content3")}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              {t("sections.external.title")}
            </h2>
            <p>{t("sections.external.content")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              {t("sections.contact.title")}
            </h2>
            <p>{t("sections.contact.content")}</p>
            <address className="mt-4 inline-block rounded-md border border-gray-200 bg-background p-4">
              {t("sections.contact.email")} :{" "}
              <a
                href="mailto:contact@blablabook.fr"
                className="font-bold text-primary hover:underline"
              >
                contact@blablabook.fr
              </a>
            </address>
          </section>
        </div>

        {/* Footer Links */}
        <footer
          aria-label={t("footer.aria.label")}
          className="mt-12 flex items-center justify-between border-t border-border pt-8"
        >
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
            aria-label={t("footer.aria.home")}
          >
            ← {t("footer.backHome")}
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground"
              aria-label={t("footer.aria.privacy")}
            >
              {t("footer.privacy")}
            </Link>
            <div className="text-xs text-muted-foreground" aria-hidden="true">
              |
            </div>
            <Link
              href="/cgu"
              className="text-xs text-muted-foreground hover:text-foreground"
              aria-label={t("footer.aria.cgu")}
            >
              {t("footer.cgu")}
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}