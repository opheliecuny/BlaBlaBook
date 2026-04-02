"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/services/authService";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const { login: loginUser } = useAuth();
  const t = useTranslations("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login({ email, password });

      loginUser({
        id: response.id,
        email: response.email,
        username: response.username || email,
      });

      sessionStorage.setItem("just_logged_in", "true");
      router.push("/library");
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("401")) {
          setError(t("error.invalidCredentials"));
        } else {
          setError(t("error.generic"));
        }
      } else {
        setError(t("error.unknown"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-10">
      <section aria-labelledby="login-title" className="border-border w-full max-w-md rounded-xl border p-10 shadow-xl bg-card dark:bg-card">
        <h1 id="login-title" className="mb-1 text-center text-2xl font-bold uppercase">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mb-8 text-center text-sm">
          {t("subtitle")}
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5" aria-labelledby="login-title">
          {error && (
            <div role="alert" aria-live="assertive" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{t("passwordLabel")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            className="hover:bg-primary/80 mt-2 w-full"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? t("loading") : t("submit")}
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-primary hover:underline" aria-label={t("registerLinkLabel")}>
            {t("registerLinkText")}
          </Link>
        </p>
      </section>
    </div>
  );
}