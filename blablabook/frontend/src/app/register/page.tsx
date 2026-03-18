"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  function handleRegister(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    if (!acceptTerms) {
      alert("Vous devez accepter les conditions d'utilisation");
      return;
    }

    console.log("Inscription:", { username, email, password });
    // TODO: API call POST /api/auth/register
  }

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4">
      <div className="border-border w-full max-w-md rounded-xl border bg-white p-10 shadow-xl">
        <h1 className="mb-1 text-center text-2xl font-bold uppercase">
          Créer un compte
        </h1>
        <p className="text-muted-foreground mb-8 text-center text-sm">
          Rejoignez la communauté de lecteurs BlaBlaBook
        </p>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
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
              autoComplete="username"
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
              autoComplete="email"
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

          <Button type="submit" className="hover:bg-primary/80 mt-2 w-full">
            S{"'"}inscrire
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
