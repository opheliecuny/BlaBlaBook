"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log("Connexion:", { email, password });
    // TODO: API call POST /api/auth/login
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

          <Button type="submit" className="hover:bg-primary/80 mt-2 w-full">
            Se connecter
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
