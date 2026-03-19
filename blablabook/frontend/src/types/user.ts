// Types pour l'utilisateur

export interface UpdateProfileData {
  email?: string;
  password?: string;
  username?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
    createdAt: string;
    updatedAt: string;
  };
}
