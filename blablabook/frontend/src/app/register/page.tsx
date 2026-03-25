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

export default function RegisterPage() {
  const router = useRouter();
  const { login: loginUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (!acceptTerms) {
      setError("Vous devez accepter les conditions d'utilisation");
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

      // Stocker les données utilisateur (le token est dans un cookie httpOnly)
      loginUser({
        id: response.id,
        email: response.email,
        username: response.username || username,
      });

      // Rediriger vers la bibliothèque
      router.push("/library");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue lors de l'inscription");
      }
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-10">
      <div className="border-border w-full max-w-md rounded-xl border bg-white p-10 shadow-xl">
        <h1 className="mb-1 text-center text-2xl font-bold uppercase">
          Créer un compte
        </h1>
        <p className="text-muted-foreground mb-8 text-center text-sm">
          Rejoignez la communauté de lecteurs BlaBlaBook
        </p>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Nom d{"'"}utilisateur</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Entrez votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Adresse mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nom@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
              autoComplete="new-password"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="mt-1 flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked === true)}
            />
            <label
              htmlFor="terms"
              className="cursor-pointer text-sm leading-none"
            >
              J{"'"}accepte les{" "}
              <Link href="/cgu" className="text-primary hover:underline">
                Conditions d{"'"}utilisation
              </Link>{" "}
              et la{" "}
              <Link href="/legal" className="text-primary hover:underline">
                Politique de confidentialité
              </Link>
              .
            </label>
          </div>

          <Button
            type="submit"
            className="hover:bg-primary/80 mt-2 w-full"
            disabled={isLoading}
          >
            {isLoading ? "Inscription en cours..." : "S'inscrire"}
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
