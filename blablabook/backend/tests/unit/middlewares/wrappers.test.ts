import { describe, it, expect } from "vitest";
import { helmetMiddleware } from "../../../src/middlewares/helmet.middleware";
import { xssSanitizer } from "../../../src/middlewares/xss-sanitizer.middleware";

/**
 * helmet.middleware.ts et xss-sanitizer.middleware.ts ne sont pas importés
 * par le testServer de test (qui bypass app.ts). Ces tests forcent l'import
 * du module, ce qui exécute les lignes de niveau module et atteint la couverture.
 */
describe("Middleware wrappers", () => {
  describe("helmetMiddleware (helmet.middleware.ts)", () => {
    it("devrait exporter une fonction middleware Express valide", () => {
      expect(helmetMiddleware).toBeDefined();
      expect(typeof helmetMiddleware).toBe("function");
    });

    it("devrait appeler next() sur une requête normale", () => {
      const req = {} as Parameters<typeof helmetMiddleware>[0];
      const res = {
        setHeader: () => {},
        getHeader: () => undefined,
        removeHeader: () => {},
      } as unknown as Parameters<typeof helmetMiddleware>[1];
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      helmetMiddleware(req, res, next);

      expect(nextCalled).toBe(true);
    });
  });

  describe("xssSanitizer (xss-sanitizer.middleware.ts)", () => {
    it("devrait exporter une fonction middleware Express valide", () => {
      expect(xssSanitizer).toBeDefined();
      expect(typeof xssSanitizer).toBe("function");
    });

    it("devrait appeler next() et ne pas modifier un body sans contenu XSS", () => {
      const req = {
        body: { username: "testuser", email: "test@example.com" },
        headers: { "content-type": "application/json" },
      } as unknown as Parameters<typeof xssSanitizer>[0];
      const res = {} as Parameters<typeof xssSanitizer>[1];
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      xssSanitizer(req, res, next);

      expect(nextCalled).toBe(true);
      expect(req.body.username).toBe("testuser");
      expect(req.body.email).toBe("test@example.com");
    });
  });
});
