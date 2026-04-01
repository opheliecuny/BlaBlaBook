"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { API_URL } from "@/lib/api";
import type { AuthUser } from "@/types/auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Le token est maintenant dans un cookie httpOnly et n'est plus stocké ici
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (res.ok) {
          setUser(await res.json());
          return;
        }

        if (res.status === 401) {
          // Access token expiré — on tente le refresh
          const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
          });

          if (refreshRes.ok) {
            // Nouveau access token reçu — on revalide la session
            const retryRes = await fetch(`${API_URL}/auth/me`, {
              credentials: "include",
            });
            if (retryRes.ok) {
              setUser(await retryRes.json());
            }
          }
          // Si le refresh échoue → session vraiment expirée, user reste null
        }
      } catch (error) {
        // Erreur réseau (backend inaccessible)
        console.error("Erreur lors de la vérification de session :", error);
        setAuthError(true);
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();
  }, []);

  function login(userData: AuthUser) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
  }

  function updateUser(userData: AuthUser) {
    setUser(userData);
  }

  const value = {
    user,
    isAuthenticated: !!user, // L'utilisateur est authentifié si user est présent (le token est dans les cookies)
    isLoading,
    authError,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
