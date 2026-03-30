import createMiddleware from "next-intl/middleware";

export const i18nMiddleware = createMiddleware({
  locales: ["fr", "en"],
  defaultLocale: "fr",
});