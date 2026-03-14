import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] px-4">
      <div className="w-full max-w-md bg-white border border-border rounded-xl shadow-sm p-10">
        <h1 className="text-2xl font-bold mb-1">CONNEXION</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Veuillez vous connecter pour accéder à votre compte BlaBlaBook.
        </p>

        {/* TODO: brancher sur l'API POST /auth/login */}
        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Adresse mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="nom@exemple.com"
              className="border border-border rounded px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              className="border border-border rounded px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <Button type="submit" className="w-full mt-2">
            Se connecter
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
