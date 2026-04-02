"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { register } from "@/services/authService";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("register");
  const router = useRouter();
  const { login: loginUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleRegister(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
      return;
    }

    if (!acceptTerms) {
      setError(t("errors.acceptTerms"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({
        email,
        password,
        confirm: confirmPassword,
        username,
      });

      loginUser({
        id: response.id,
        email: response.email,
        username: response.username || username,
      });

      router.push("/library");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("errors.generic"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-10">
      <div className="border-border w-full max-w-md rounded-xl border p-10 shadow-xl bg-card dark:bg-card">
        <h1 className="mb-1 text-center text-2xl font-bold uppercase">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mb-8 text-center text-sm">
          {t("subtitle")}
        </p>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">{t("username")}</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder={t("usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{t("password")}</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showPassword
                    ? t("aria.hidePassword")
                    : t("aria.showPassword")
                }
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="h-1 w-full rounded mt-2 dark:bg-gray-700" aria-hidden="true">
              <div
                className={`h-full transition-all rounded ${score <= 1
                  ? "w-1/4 bg-red-500"
                  : score === 2
                    ? "w-2/4 bg-orange-400"
                    : score === 3
                      ? "w-3/4 bg-yellow-400"
                      : "w-full bg-green-500"
                  }`}
              />
            </div>

            <p className="text-xs text-muted-foreground">{t("passwordCriteria.text")}</p>
            <ul className="text-xs space-y-1 mt-1 list-disc pl-5">
              <li className={password.length >= 8 ? "text-green-600" : "text-muted-foreground"}>
                {t("passwordCriteria.minLength")}
              </li>
              <li className={/[A-Z]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
                {t("passwordCriteria.uppercase")}
              </li>
              <li className={/[0-9]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
                {t("passwordCriteria.number")}
              </li>
              <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
                {t("passwordCriteria.special")}
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="mt-1 flex items-start gap-2" role="group" aria-labelledby="terms-label">
            <p className="text-sm flex items-center gap-2 leading-none">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              />
              <label htmlFor="terms" className="cursor-pointer text-sm leading-none" id="terms-label">
                <span>
                  {t("terms.text1")}{" "}
                  <Link href="/cgu" className="text-primary hover:underline">
                    {t("terms.cgu")}
                  </Link>{" "}
                  {t("terms.text2")}{" "}
                  <Link href="/legal" className="text-primary hover:underline">
                    {t("terms.privacy")}
                  </Link>
                  .
                </span>
              </label>
            </p>
          </div>

          <Button type="submit" className="hover:bg-primary/80 mt-2 w-full" disabled={isLoading} aria-busy={isLoading}>
            {isLoading ? t("loading") : t("submit")}
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          {t("alreadyAccount")}{" "}
          <Link href="/login" className="text-primary hover:underline">
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
}