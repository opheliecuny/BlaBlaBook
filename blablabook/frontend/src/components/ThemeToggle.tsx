"use client";

import { useId } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const id = useId();
  const { resolvedTheme, setTheme } = useTheme();

  if (!resolvedTheme) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="group inline-flex items-center gap-2"
      data-state={isDark ? "checked" : "unchecked"}
    >
      <button
        id={`${id}-light`}
        className="group-data-[state=checked]:text-muted-foreground/70 cursor-pointer text-sm"
        onClick={() => setTheme("light")}
        aria-label="Activer le thème clair"
        aria-pressed={!isDark}
      >
        <SunIcon className="size-4" />
      </button>

      <label htmlFor={id} className="sr-only">Toggle theme</label>
      <Switch
        id={id}
        checked={isDark}
        onCheckedChange={(checked) =>
          setTheme(checked ? "dark" : "light")
        }
        aria-label={isDark ? "Activer le thème clair" : "Activer le thème sombre"}
      />

      <button
        id={`${id}-dark`}
        className="group-data-[state=unchecked]:text-muted-foreground/70 cursor-pointer text-sm"
        onClick={() => setTheme("dark")}
        aria-label="Activer le thème sombre"
        aria-pressed={isDark}
      >
        <MoonIcon className="size-4" />
      </button>
    </div>
  );
}
