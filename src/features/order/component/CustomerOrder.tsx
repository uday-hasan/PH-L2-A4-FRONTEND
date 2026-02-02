"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types";
import { Package, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";
import { orderApi } from "../api/order.api";

export default function CustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getMyOrders().then((res) => {
      setOrders(res.data.data);
      setLoading(false);
    });
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return { color: "bg-yellow-100 text-yellow-700", icon: Clock };
      case "SHIPPED":
        return { color: "bg-blue-100 text-blue-700", icon: Truck };
      case "DELIVERED":
        return { color: "bg-green-100 text-green-700", icon: CheckCircle2 };
      default:
        return { color: "bg-red-100 text-red-700", icon: XCircle };
    }
  };

  if (loading) return <div className="p-20 text-center">Loading orders...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Package className="h-8 w-8 text-primary" /> My Order History
      </h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const config = getStatusConfig(order.status);
          return (
            <div
              key={order.id}
              className="bg-white border rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="bg-slate-50 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    Order ID
                  </p>
                  <p className="text-sm font-mono">{order.id.slice(0, 8)}...</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    Date
                  </p>
                  <p className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  className={`${config.color} border-none px-3 py-1 flex items-center gap-1`}
                >
                  <config.icon className="h-3 w-3" /> {order.status}
                </Badge>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    Total Amount
                  </p>
                  <p className="text-lg font-black text-primary">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-bold text-foreground">
                    Shipping to:
                  </span>{" "}
                  {order.shippingAddress}
                </p>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm border-b border-dashed pb-2"
                    >
                      <span>
                        {item.medicine.name}{" "}
                        <span className="text-muted-foreground ml-2">
                          x{item.quantity}
                        </span>
                      </span>
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
