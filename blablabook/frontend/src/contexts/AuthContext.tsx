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
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données depuis localStorage au montage
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    // Vérifier que les données sont valides avant de les utiliser
    try {
      if (storedToken && storedUser) {
        // Si les données sont présentes, on les parse et on les met dans le state
        const parsedUser = JSON.parse(storedUser);

        setAccessToken(storedToken);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du localStorage :", error);
      // En cas d'erreur, on nettoie les données corrompues
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    } finally {
      // Quel que soit le résultat, on arrête le chargement
      setIsLoading(false);
    }
  }, []);

  function login(token: string, userData: User) {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function logout() {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }

  function updateUser(userData: User) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken, // L'utilisateur est authentifié si les deux sont présents
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
