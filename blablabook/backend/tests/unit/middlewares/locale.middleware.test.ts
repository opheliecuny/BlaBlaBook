import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { localeMiddleware } from "../../../src/middlewares/locale.middleware";

function makeReq(
  opts: { query?: Record<string, string>; acceptLanguage?: string } = {},
): Request {
  return {
    query: opts.query ?? {},
    headers: opts.acceptLanguage
      ? { "accept-language": opts.acceptLanguage }
      : {},
  } as unknown as Request;
}

const mockRes = {} as Response;

describe("localeMiddleware", () => {
  it("utilise la locale du query param 'fr' (supportée)", () => {
    const next = vi.fn() as NextFunction;
    const req = makeReq({ query: { locale: "fr" } });

    localeMiddleware(req, mockRes, next);

    expect(req.locale).toBe("fr");
    expect(next).toHaveBeenCalledOnce();
  });

  it("utilise la locale du query param 'en' (supportée)", () => {
    const next = vi.fn() as NextFunction;
    const req = makeReq({ query: { locale: "en" } });

    localeMiddleware(req, mockRes, next);

    expect(req.locale).toBe("en");
    expect(next).toHaveBeenCalledOnce();
  });

  it("retombe sur 'fr' si la locale du query param n'est pas supportée", () => {
    const next = vi.fn() as NextFunction;
    const req = makeReq({ query: { locale: "de" } });

    localeMiddleware(req, mockRes, next);

    expect(req.locale).toBe("fr");
  });

  it("utilise la locale du header Accept-Language si valide ('en-US,en;q=0.9')", () => {
    const next = vi.fn() as NextFunction;
    const req = makeReq({ acceptLanguage: "en-US,en;q=0.9" });

    localeMiddleware(req, mockRes, next);

    expect(req.locale).toBe("en");
  });

  it("utilise la locale du header Accept-Language si valide ('fr-FR')", () => {
    const next = vi.fn() as NextFunction;
    const req = makeReq({ acceptLanguage: "fr-FR,fr;q=0.9" });

    localeMiddleware(req, mockRes, next);

    expect(req.locale).toBe("fr");
  });

  it("retombe sur 'fr' si le header Accept-Language contient une locale non supportée", () => {
    const next = vi.fn() as NextFunction;
    const req = makeReq({ acceptLanguage: "de-DE,de;q=0.9" });

    localeMiddleware(req, mockRes, next);

    expect(req.locale).toBe("fr");
  });

  it("retombe sur 'fr' si aucune locale n'est fournie (ni query param ni header)", () => {
    const next = vi.fn() as NextFunction;
    const req = makeReq();

    localeMiddleware(req, mockRes, next);

    expect(req.locale).toBe("fr");
  });

  it("le query param a priorité sur le header Accept-Language", () => {
    const next = vi.fn() as NextFunction;
    const req = makeReq({ query: { locale: "en" }, acceptLanguage: "fr-FR" });

    localeMiddleware(req, mockRes, next);

    expect(req.locale).toBe("en");
  });
});
