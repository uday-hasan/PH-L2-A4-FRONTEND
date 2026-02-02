"use client";
import { useAuthStore } from "@/store/use-auth-store";
import React from "react";
import CustomerOrders from "./CustomerOrder";
import SellerOrdersPage from "./SellerOrders";
import AdminOrdersPage from "./AdminOrders";

const Order = () => {
  const { user } = useAuthStore((state) => state);
  const userType = user?.userType;
  return (
    <div>
      {userType === "CUSTOMER" ? (
        <CustomerOrders />
      ) : userType === "SELLER" ? (
        <SellerOrdersPage />
      ) : (
        <AdminOrdersPage />
      )}
    </div>
  );
};

export default Order;
