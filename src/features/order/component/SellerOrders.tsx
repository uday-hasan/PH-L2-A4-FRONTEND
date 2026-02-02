"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, User, MapPin } from "lucide-react";
import { orderApi } from "../api/order.api";

export default function SellerOrdersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await orderApi.getIncomingOrders();
      setItems(res.data.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch order items",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpdate = async (itemId: string, status: string) => {
    try {
      await orderApi.updateItemStatus(itemId, status);
      toast.success("Status updated");
      fetchItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Package className="h-8 w-8 text-primary" /> Incoming Order Requests
      </h1>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 text-xs font-bold uppercase text-slate-500">
                Medicine
              </th>
              <th className="p-4 text-xs font-bold uppercase text-slate-500">
                Customer
              </th>
              <th className="p-4 text-xs font-bold uppercase text-slate-500">
                Quantity
              </th>
              <th className="p-4 text-xs font-bold uppercase text-slate-500">
                Status
              </th>
              <th className="p-4 text-xs font-bold uppercase text-slate-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item: any) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="p-4">
                  <p className="font-bold">{item.medicine.name}</p>
                  <p className="text-xs text-slate-400">
                    ID: {item.id.slice(0, 8)}
                  </p>
                </td>
                <td className="p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" /> {item.order.customer.name}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="h-3 w-3" /> {item.order.shippingAddress}
                  </div>
                </td>
                <td className="p-4 font-semibold">{item.quantity} units</td>
                <td className="p-4">
                  <Badge variant="secondary" className="capitalize">
                    {item.status.toLowerCase()}
                  </Badge>
                </td>
                <td className="p-4">
                  <Select
                    onValueChange={(val) => handleUpdate(item.id, val)}
                    defaultValue={item.status}
                  >
                    <SelectTrigger className="w-[130px] h-9">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
