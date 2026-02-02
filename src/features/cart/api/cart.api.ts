import apiClient from "@/lib/api-client";

export const cartApi = {
  getCart: () => apiClient.get("/cart"),
  addItem: (medicineId: string, quantity: number) =>
    apiClient.post("/cart/add", { medicineId, quantity }),
  updateQuantity: (itemId: string, quantity: number) =>
    apiClient.patch(`/cart/item/${itemId}`, { quantity }),
  removeItem: (itemId: string) => apiClient.delete(`/cart/item/${itemId}`),
};
