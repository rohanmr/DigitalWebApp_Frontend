export type UserRole = "admin" | "volunteer";

export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}
