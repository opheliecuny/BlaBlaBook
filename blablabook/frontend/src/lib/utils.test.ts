import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("combine des classes simples", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignore les valeurs falsy", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("résout les conflits Tailwind via twMerge", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("gère les objets conditionnels via clsx", () => {
    expect(cn({ "font-bold": true, "text-red-500": false })).toBe("font-bold");
  });

  it("retourne une chaîne vide si aucun argument", () => {
    expect(cn()).toBe("");
  });
});
