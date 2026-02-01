import apiClient from "@/lib/api-client";

export const userApi = {
  getAll: (params: any) => apiClient.get("/users", { params }),
  getOne: (id: string) => apiClient.get(`/users/${id}`),
  update: (id: string, data: any) => apiClient.put(`/users/${id}`, data),
};
