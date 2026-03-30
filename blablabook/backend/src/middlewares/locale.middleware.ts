import { Request, Response, NextFunction } from "express";

const SUPPORTED_LOCALES = ["fr", "en"];
const DEFAULT_LOCALE = "fr";

export const localeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const locale =
    (req.query.locale as string) ||
    req.headers["accept-language"]?.split(",")[0]?.split("-")[0] ||
    DEFAULT_LOCALE;

  req.locale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  next();
};