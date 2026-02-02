import apiClient from "@/lib/api-client";

export const orderApi = {
  placeOrder: (data: { shippingAddress: string }) =>
    apiClient.post("/orders", data),

  getMyOrders: () => apiClient.get("/orders/my-orders"),
};
