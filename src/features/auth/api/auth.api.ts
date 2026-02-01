import apiClient from "@/lib/api-client";
import { LoginFormData, RegisterFormData } from "../schemas/auth-schema";

export const authApi = {
  register: async (data: RegisterFormData) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginFormData) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};
