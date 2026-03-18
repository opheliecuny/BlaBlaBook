"use client";

import { useState } from "react";
import { User, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  // Etat des formulaires
  const [username, setUsername] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@email.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handlers
  function handleProfileUpdate(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Profile updated:", { username, email });
    // TODO: API call
  }

  function handlePasswordUpdate(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    console.log("Password updated");
    // TODO: API call
  }

  function handleAccountDelete() {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.",
      )
    ) {
      console.log("Account deleted");
      // TODO: API call
    }
  }

  return (
    <div className="bg-background min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header - Profil utilisateur */}
        <div className="bg-card rounded-2xl border p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="bg-primary mb-4 flex h-24 w-24 items-center justify-center rounded-full">
              <User className="text-primary-foreground h-12 w-12" />
            </div>

            {/* Nom et email */}
            <h1 className="text-2xl font-bold">{username}</h1>
            <p className="text-muted-foreground mt-1">{email}</p>

            {/* Badge membre */}
            <div className="bg-secondary mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">
              <User className="h-4 w-4" />
              MEMBRE DEPUIS JANVIER 2023
            </div>
          </div>
        </div>

        {/* Section Informations personnelles */}
        <div className="bg-card rounded-2xl border p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <User className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Informations personnelles</h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Pseudo */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">Pseudo</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre pseudo"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
              />
            </div>

            {/* Bouton Submit */}
            <Button type="submit" className="w-full">
              Enregistrer les modifications
            </Button>
          </form>
        </div>

        {/* Section Sécurité */}
        <div className="bg-card rounded-2xl border p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Shield className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Sécurité</h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            {/* Mot de passe actuel */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </div>

            {/* Nouveau mot de passe */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>

              {/* Confirmation mot de passe */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">
                  Confirmation du mot de passe
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Bouton Submit */}
            <Button type="submit" className="w-full">
              Mettre à jour le mot de passe
            </Button>
          </form>
        </div>

        {/* Zone de danger */}
        <div className="border-destructive/20 bg-destructive/5 flex items-center justify-between rounded-2xl border-2 p-8">
          {/* Partie gauche - Icône et texte */}
          <div className="flex items-start space-x-4">
            {/* Icône d'alerte */}
            <div className="bg-destructive text-destructive-foreground mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>

            <div>
              <h2 className="text-xl font-bold">Zone de danger</h2>
              <p className="text-muted-foreground mt-1 text-lg font-medium">
                Supprimer mon compte
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Cette action est irréversible. Toutes vos données seront
                effacées.
              </p>
            </div>
          </div>

          {/* Partie droite : Bouton de suppression */}
          <Button
            variant="destructive"
            onClick={handleAccountDelete}
            className="ml-4 shrink-0"
          >
            Supprimer définitivement
          </Button>
        </div>
      </div>
    </div>
  );
}
