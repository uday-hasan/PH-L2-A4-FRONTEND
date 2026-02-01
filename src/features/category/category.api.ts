import apiClient from "@/lib/api-client";

export const categoryApi = {
  getAll: (params: { page: number; search: string; limit: number }) =>
    apiClient.get("/category", { params }),
  create: (data: any) => apiClient.post("/category", data),
  update: (id: string, data: any) => apiClient.put(`/category/${id}`, data),
};
