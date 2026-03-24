// Types pour l'utilisateur
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  email?: string;
  password?: string;
  username?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}