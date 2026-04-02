"use client";

import { useEffect, useState } from "react";
import { User, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteProfile,
  getProfile,
  updateProfile,
} from "@/services/userService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const t = useTranslations("profile");
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
        month: "long",
      });
      setUsername(data.username);
      setEmail(data.email);
      setDateJoined(formattedDate);
    }
    fetchProfile();
  }, []);

  async function handleProfileUpdate(e: React.SubmitEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      await updateProfile({ username, email });
      toast.success(t("toast.profileUpdated"), { position: "top-center" });
    } catch (error) {
      toast.error(t("toast.profileError"), {
        position: "top-center",
        description: error instanceof Error ? error.message : t("toast.networkError"),
      });
    }
  }

  async function handlePasswordUpdate(e: React.SubmitEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        toast.error(t("toast.passwordMismatch"), { position: "top-center" });
        return;
      }
      await updateProfile({ password: newPassword, currentPassword });
      toast.success(t("toast.passwordUpdated"), { position: "top-center" });
    } catch (error) {
      toast.error(t("toast.passwordError"), {
        position: "top-center",
        description: error instanceof Error ? error.message : t("toast.networkError"),
      });
    }
  }

  async function handleAccountDelete() {
    try {
      await deleteProfile();
      toast.success(t("toast.accountDeleted"), { position: "top-center" });
      router.replace("/");
    } catch (error) {
      toast.error(t("toast.accountDeleteError"), {
        position: "top-center",
        description: error instanceof Error ? error.message : t("toast.networkError"),
      });
    }
  }

  return (
    <div className="bg-background min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header - Profil utilisateur */}
        <section className="bg-card rounded-2xl border p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary mb-4 flex h-24 w-24 items-center justify-center rounded-full">
              <User className="text-primary-foreground h-12 w-12" aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-bold">{username}</h1>
            <p className="text-muted-foreground mt-1">{email}</p>

            <div className="bg-secondary mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium dark:bg-muted">
              <User className="h-4 w-4" aria-hidden="true" />
              <p className="text-xs uppercase">{t("memberSince", { date: dateJoined })}</p>
            </div>
          </div>
        </section>

        {/* Section Informations personnelles */}
        <section aria-labelledby="profile-info" className="bg-card rounded-2xl border p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <User className="h-5 w-5" aria-hidden="true" />
            <h2 id="profile-info" className="text-xl font-semibold">{t("personalInfo")}</h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">{t("username")}</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("usernamePlaceholder")}
                autoComplete="username"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
              />
            </div>

            <Button type="submit" className="w-full">{t("saveChanges")}</Button>
          </form>
        </section>

        {/* Section Sécurité */}
        <section aria-labelledby="security-title" className="bg-card rounded-2xl border p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Shield className="h-5 w-5" aria-hidden="true" />
            <h2 id="security-title" className="text-xl font-semibold">{t("security")}</h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
              <Input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t("currentPasswordPlaceholder")}
                autoComplete="current-password"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newPassword">{t("newPassword")}</Label>
                <Input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("newPasswordPlaceholder")}
                  autoComplete="new-password"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("confirmPasswordPlaceholder")}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">{t("updatePassword")}</Button>
          </form>
        </section>

        {/* Zone de danger */}
        <section aria-labelledby="danger-zone" className="flex flex-col items-center justify-between gap-6 rounded-2xl border-2 border-(--accent-alt) bg-(--accent-alt)/10 p-8 sm:flex-row">
          <div className="flex items-start space-x-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--accent-alt) text-white">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>

            <div>
              <h2 id="danger-zone" className="text-xl font-bold text-[#A12C14]">{t("dangerZone")}</h2>
              <p className="mt-1 text-lg font-medium text-[#A12C14]">{t("deleteAccount")}</p>
              <p className="text-destructive/70 mt-1 text-sm font-medium">{t("deleteWarning")}</p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger
              className="ml-4 shrink-0 rounded-md border-(--accent-alt) bg-(--accent-alt) p-2 text-white"
              aria-label={t("deleteAccount")}
            >
              {t("deleteForever")}
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("confirmDeleteTitle")}</AlertDialogTitle>
                <AlertDialogDescription>{t("confirmDeleteDesc")}</AlertDialogDescription>
              </AlertDialogHeader>

              <div className="flex justify-end gap-2">
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleAccountDelete}>{t("delete")}</AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </div>
  );
}