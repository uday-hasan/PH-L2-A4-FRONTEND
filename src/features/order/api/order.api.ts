import apiClient from "@/lib/api-client";

export const orderApi = {
  placeOrder: (data: { shippingAddress: string }) =>
    apiClient.post("/orders", data),
  getMyOrders: () => apiClient.get("/orders/my-orders"),

  getIncomingOrders: () => apiClient.get("/orders/incoming"),
  updateItemStatus: (orderItemId: string, status: string) =>
    apiClient.patch(`/orders/item-status/${orderItemId}`, { status }),

  getAllOrders: () => apiClient.get("/orders/admin/all"),
  updateGlobalStatus: (orderId: string, status: string) =>
    apiClient.patch(`/orders/admin/status/${orderId}`, { status }),
};
