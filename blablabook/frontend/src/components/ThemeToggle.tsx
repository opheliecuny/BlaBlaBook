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
      <span
        id={`${id}-light`}
        className="group-data-[state=checked]:text-muted-foreground/70 cursor-pointer text-sm"
        onClick={() => setTheme("light")}
      >
        <SunIcon className="size-4" />
      </span>

      <Switch
        id={id}
        checked={isDark}
        onCheckedChange={(checked) =>
          setTheme(checked ? "dark" : "light")
        }
      />

      <span
        id={`${id}-dark`}
        className="group-data-[state=unchecked]:text-muted-foreground/70 cursor-pointer text-sm"
        onClick={() => setTheme("dark")}
      >
        <MoonIcon className="size-4" />
      </span>
    </div>
  );
}
