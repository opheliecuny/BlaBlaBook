"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const { login: loginUser } = useAuth();

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

      // Stocker les données d'authentification
      loginUser(response.accessToken, {
        id: response.id,
        email: response.email,
        username: response.username || email,
      });

      // Rediriger vers la bibliothèque
      router.push("/library");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue lors de la connexion");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4">
      <div className="border-border w-full max-w-md rounded-xl border bg-white p-10 shadow-xl">
        <h1 className="mb-1 text-center text-2xl font-bold uppercase">
          Connexion
        </h1>
        <p className="text-muted-foreground mb-8 text-center text-sm">
          Veuillez vous connecter pour accéder à votre compte BlaBlaBook.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Adresse mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nom@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="hover:bg-primary/80 mt-2 w-full"
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
