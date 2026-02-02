"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orderApi } from "../api/order.api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await orderApi.getAllOrders();
      setOrders(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleGlobalUpdate = async (orderId: string, status: string) => {
    try {
      await orderApi.updateGlobalStatus(orderId, status);
      toast.success("Global order updated");
      fetchOrders();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update global status",
      );
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading Admin View...</div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-black">System Orders</h1>

      <div className="grid gap-6">
        {orders.map((order: any) => (
          <Card key={order.id} className="overflow-hidden border-2">
            <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Order #{order.id.slice(0, 8)}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {order.customer.name} ({order.customer.email})
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs font-bold uppercase text-slate-400">
                    Total Amount
                  </p>
                  <p className="text-xl font-black text-primary">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
                <Select
                  onValueChange={(v) => handleGlobalUpdate(order.id, v)}
                  defaultValue={order.status}
                >
                  <SelectTrigger className="w-[140px] font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm mb-4">
                <strong>Shipping Address:</strong> {order.shippingAddress}
              </p>
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Order Items
                </h4>
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-muted/30 p-3 rounded-xl border border-dashed"
                  >
                    <div>
                      <p className="font-semibold text-sm">
                        {item.medicine.name} x {item.quantity}
                      </p>
                      <p className="text-[10px] text-primary font-medium">
                        Vendor: {item.medicine.seller.name}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
