import apiClient from "@/lib/api-client";

export const medicineApi = {
  getAll: (params: any) => apiClient.get("/medicine", { params }),
  getPrivateAll: (params: any) =>
    apiClient.get("/medicine/private", { params }),
  getOne: (id: string) => apiClient.get(`/medicine/${id}`),
  create: (data: any) => apiClient.post("/medicine", data),
  update: (id: string, data: any) => apiClient.put(`/medicine/${id}`, data),
  updateStock: (id: string, quantity: number) =>
    apiClient.patch(`/medicine/${id}`, { available_quantity: quantity }),
};
