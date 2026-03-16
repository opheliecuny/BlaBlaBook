"use client";

import React, { useState } from "react";
import { User, Shield } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header - Profil utilisateur */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-400">
              <User className="h-12 w-12 text-white" />
            </div>

            {/* Nom et email */}
            <h1 className="text-2xl font-bold text-gray-900">{username}</h1>
            <p className="mt-1 text-gray-500">{email}</p>

            {/* Badge membre */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              <User className="h-4 w-4" />
              MEMBRE DEPUIS JANVIER 2023
            </div>
          </div>
        </div>

        {/* Section Informations personnelles */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <User className="h-5 w-5 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">
              Informations personnelles
            </h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Pseudo */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Pseudo
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre pseudo"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Bouton Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Enregistrer les modifications
            </button>
          </form>
        </div>

        {/* Section Sécurité */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Sécurité</h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            {/* Mot de passe actuel */}
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Mot de passe actuel
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Nouveau mot de passe */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Confirmation du mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Bouton Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Mettre à jour le mot de passe
            </button>
          </form>
        </div>

        {/* Zone de danger */}
        <div className="flex items-center justify-between rounded-2xl border-2 border-red-200 bg-red-50 p-8">
          {/* Partie gauche - Icône et texte */}
          <div className="flex items-start space-x-4">
            {/* Icône d'alerte */}
            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
              !
            </div>

            <div>
              <h2 className="text-xl font-bold text-red-900">Zone de danger</h2>
              <p className="mt-1 text-lg font-medium text-red-800">
                Supprimer mon compte
              </p>
              <p className="mt-1 text-sm text-red-600">
                Cette action est irréversible. Toutes vos données seront
                effacées.
              </p>
            </div>
          </div>

          {/* Partie droite : Bouton de suppression */}
          <button
            onClick={handleAccountDelete}
            className="ml-4 shrink-0 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
          >
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  );
}
