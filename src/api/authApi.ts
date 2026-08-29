import axiosInstance from "./axiosInstance";
import type { LoginResponse } from "@/types/user";

export interface LoginPayload {
  identifier: string; // email or mobile
  password: string;
}

export const loginApi = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post<LoginResponse>("/auth/login", {
    email: payload.identifier,
    mobile: payload.identifier,
    password: payload.password,
  });
  return data;
};

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const changePasswordApi = async (
  payload: ChangePasswordPayload,
): Promise<{ success: boolean; message: string }> => {
  const { data } = await axiosInstance.patch("/auth/change-password", payload);
  return data;
};

export interface UpdateProfilePayload {
  name: string;
  email: string;
  mobile: string;
}

export const updateProfileApi = async (
  payload: UpdateProfilePayload,
): Promise<{
  success: boolean;
  message: string;
  user: import("@/types/user").User;
}> => {
  const { data } = await axiosInstance.patch("/auth/me", payload);
  return data;
};
