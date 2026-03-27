// Types pour l'authentification

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirm: string;
  username: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  username?: string;
  accessToken: string;
  refreshToken: string;
}

export interface UpdateProfileRequest {
  email?: string;
  password?: string;
  currentPassword?: string;
  username?: string;
}
