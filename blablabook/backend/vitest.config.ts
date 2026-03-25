import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.{test,spec}.{ts,tsx}", "src/**/*.test.ts"],
    exclude: ["node_modules", "dist", "prisma/migrations"],
    fileParallelism: false, // Désactive le parallélisme pour éviter les conflits BDD
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/@types/**",
        "src/models/**",
        "generated/**",
        "**/*.d.ts",
        "**/*.config.ts",
        "**/index.ts",
        "src/app.ts", // Fichier principal, pas de tests nécessaires
        "src/utils/script.ts", // Scripts utilitaires
        "src/controllers/book.controller.ts", // API externe OpenLibrary, mocks complexes
      ],
      reportsDirectory: "./coverage",
      thresholds: {
        lines: 70,
        functions: 75,
        branches: 45, // Ajusté pour tenir compte des API externes
        statements: 70,
      },
    },
    setupFiles: ["./tests/setup.ts"],
    globalTeardown: "./tests/teardown.ts",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tests": path.resolve(__dirname, "./tests"),
    },
  },
});
