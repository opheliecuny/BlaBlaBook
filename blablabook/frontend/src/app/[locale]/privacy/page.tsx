import type { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Privacy Policy - BlaBlaBook",
  description: "How BlaBlaBook collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl rounded-2xl p-8 shadow-sm md:p-12 bg-card dark:bg-card">
        {/* Header */}
        <header className="mb-8 border-b border-border pb-8">
          <h1 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-foreground uppercase">
            {t("title")}
          </h1>
          <time dateTime="2026-03-24" className="text-sm text-muted-foreground italic">
            {t("lastUpdate")}
          </time>
          <p className="mt-4 text-sm leading-relaxed text-foreground">
            {t("intro", { strong: "BlaBlaBook" })}
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              {t("section1.title")}
            </h2>
            <p>{t("section1.p1")}</p>
            <ul className="mt-2 ml-4 list-inside list-disc space-y-1">
              <li>{t("section1.li1")}</li>
              <li>{t("section1.li2")}</li>
              <li>{t("section1.li3")}</li>
              <li>{t("section1.li4")}</li>
            </ul>
            <p className="mt-2">{t("section1.p2")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              {t("section2.title")}
            </h2>
            <p>{t("section2.p1")}</p>
            <ul className="mt-2 ml-4 list-inside list-disc space-y-1">
              <li>{t("section2.li1")}</li>
              <li>{t("section2.li2")}</li>
              <li>{t("section2.li3")}</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              {t("section3.title")}
            </h2>
            <p>{t("section3.p1")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              {t("section4.title")}
            </h2>
            <p>{t("section4.p1")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              {t("section5.title")}
            </h2>
            <p>{t("section5.p1")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-medium text-foreground">
              {t("section6.title")}
            </h2>
            <p>{t("section6.p1")}</p>
            <p className="mt-2">{t("section6.p2")}</p>
            <address className="mt-4 inline-block rounded-md border border-border bg-background p-4">
              {t("section6.contactEmail")}{" "}
              <a
                href="mailto:contact@blablabook.fr"
                className="font-bold text-primary hover:underline"
              >
                contact@blablabook.fr
              </a>
            </address>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("section6.cnil")}{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                CNIL
              </a>
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <footer className="mt-12 flex items-center justify-between border-t border-border pt-8">
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("footer.home")}
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/cgu"
              className="text-xs text-muted-foreground hover:text-foreground"
              aria-label="Voir les CGU"
            >
              {t("footer.cgu")}
            </Link>
            <div className="text-xs text-muted-foreground" aria-hidden="true">
              |
            </div>
            <Link
              href="/legal"
              className="text-xs text-muted-foreground hover:text-foreground"
              aria-label="Voir les Mentions Légales"
            >
              {t("footer.legal")}
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}