"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données utilisateur depuis localStorage au montage
  // Le token est maintenant dans un cookie httpOnly et n'est plus stocké ici
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    // Vérifier que les données sont valides avant de les utiliser
    try {
      if (storedUser) {
        // Si les données sont présentes, on les parse et on les met dans le state
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du localStorage :", error);
      // En cas d'erreur, on nettoie les données corrompues
      localStorage.removeItem("user");
    } finally {
      // Quel que soit le résultat, on arrête le chargement
      setIsLoading(false);
    }
  }, []);

  function login(userData: User) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  function updateUser(userData: User) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  const value = {
    user,
    isAuthenticated: !!user, // L'utilisateur est authentifié si user est présent (le token est dans les cookies)
    isLoading,
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
