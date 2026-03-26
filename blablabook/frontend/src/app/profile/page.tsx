"use client";

import { useEffect, useState } from "react";
import { User, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteProfile, getProfile, updateProfile } from "@/services/userService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  // Etat des formulaires
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateJoined, setDateJoined] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      const data = await getProfile();
      const formattedDate = new Date(data.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long"
      });
      setUsername(data.username);
      setEmail(data.email);
      setDateJoined(formattedDate);
    }
    fetchProfile();
  }, []);

  // Handlers
  async function handleProfileUpdate(e: React.SubmitEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      // TODO : vérifier court-circuitage
      await updateProfile({ username, email });

      toast.success("Informations personnelles mises à jour avec succès !", {
        position: "top-center"
      });
    } catch (error) {
      toast.error("Une erreur est survenue lors de la mise à jour du profil.", {
        position: "top-center",
        description: error instanceof Error ? error.message : "Une erreur réseau est survenue"
      });
    }
  }

  async function handlePasswordUpdate(e: React.SubmitEvent<HTMLFormElement>) {
    try {
      e.preventDefault();

      if (newPassword !== confirmPassword) {
        toast.error("Le nouveau mot de passe et sa confirmation ne correspondent pas.", {
          position: "top-center"
        });
        return;
      }
      // TODO : mettre en place une validation côté client
      await updateProfile({ password: newPassword });
      toast.success("Mot de passe mis à jour avec succès !", {
        position: "top-center"
      });
    } catch (error) {
      toast.error("Une erreur est survenue lors de la mise à jour du mot de passe.", {
        position: "top-center"
      });
    }
  }

  async function handleAccountDelete() {
    try {
      await deleteProfile();
      toast.success("Votre compte a été supprimé avec succès.", {
        position: "top-center"
      });
      router.replace("/");
    } catch (error) {
      toast.error("Une erreur est survenue lors de la suppression du compte.", {
        position: "top-center"
      });
    }
  }

  return (
    <div className="bg-background min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header - Profil utilisateur */}
        <section className="bg-card rounded-2xl border p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="bg-primary mb-4 flex h-24 w-24 items-center justify-center rounded-full">
              <User className="text-primary-foreground h-12 w-12" aria-hidden="true" />
            </div>

            {/* Nom et email */}
            <h1 className="text-2xl font-bold">{username}</h1>
            <p className="text-muted-foreground mt-1">{email}</p>

            {/* Badge membre */}
            <div className="bg-secondary mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">
              <User className="h-4 w-4" aria-hidden="true" />
              <p className="text-xs uppercase">Membre depuis {dateJoined}</p>
            </div>
          </div>
        </section>

        {/* Section Informations personnelles */}
        <section aria-labelledby="profile-info" className="bg-card rounded-2xl border p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <User className="h-5 w-5" aria-hidden="true" />
            <h2 id="profile-info" className="text-xl font-semibold">Informations personnelles</h2>
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
                autoComplete="username"
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
                autoComplete="email"
              />
            </div>

            {/* Bouton Submit */}
            <Button type="submit" className="w-full">
              Enregistrer les modifications
            </Button>
          </form>
        </section>

        {/* Section Sécurité */}
        <section aria-labelledby="security-title" className="bg-card rounded-2xl border p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Shield className="h-5 w-5" aria-hidden="true" />
            <h2 id="security-title" className="text-xl font-semibold">Sécurité</h2>
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
                autoComplete="current-password"
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
                  autoComplete="new-password"
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
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Bouton Submit */}
            <Button type="submit" className="w-full">
              Mettre à jour le mot de passe
            </Button>
          </form>
        </section>

        {/* Zone de danger */}
        <section aria-labelledby="danger-zone" className="flex flex-col gap-6 sm:flex-row items-center justify-between rounded-2xl border-2 border-[var(--accent-alt)] bg-[var(--accent-alt)]/10 p-8">
          {/* Partie gauche - Icône et texte */}
          <div className="flex items-start space-x-4">
            {/* Icône d'alerte */}
            <div className="bg-[var(--accent-alt)] text-white mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>

            <div>
              <h2 id="danger-zone" className="text-xl font-bold text-[#A12C14]">Zone de danger</h2>
              <p className="mt-1 text-lg font-medium text-[#A12C14]">
                Supprimer mon compte
              </p>
              <p className="mt-1 text-sm text-destructive/70 font-medium">
                Cette action est irréversible. Toutes vos données seront effacées.
              </p>
            </div>
          </div>

          {/* Partie droite : Bouton de suppression */}
          <AlertDialog>
            <AlertDialogTrigger className="ml-4 shrink-0 border-[var(--accent-alt)] bg-[var(--accent-alt)] text-white p-2 rounded-md" aria-label="Supprimer le compte">
              Supprimer définitivement
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Supprimer votre compte ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="flex justify-end gap-2">
                <AlertDialogCancel>Annuler</AlertDialogCancel>

                <AlertDialogAction onClick={handleAccountDelete}>
                  Supprimer
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </div>
  );
}
