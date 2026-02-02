import apiClient from "@/lib/api-client";

export const reviewApi = {
  create: (data: { medicineId: string; rating: number; comment?: string }) => {
    return apiClient.post("/review", data);
  },
  getAll: () => {
    return apiClient.get(`/review`);
  },
  getByMedicine: (
    medicineId: string,
    params?: { page?: number; limit?: number },
  ) => {
    return apiClient.get(`/review/medicine/${medicineId}`, { params });
  },
  update: (
    reviewId: string,
    data: { medicineId: string; rating?: number; comment?: string },
  ) => {
    return apiClient.put(`/review/${reviewId}`, data);
  },
  updateStatus: (reviewId: string, status: "ACTIVE" | "INACTIVE") => {
    return apiClient.patch(`/review/${reviewId}/status`, { status });
  },
};
