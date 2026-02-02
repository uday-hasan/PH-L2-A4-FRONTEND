"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Truck, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { orderApi } from "@/features/order/api/order.api";

interface CheckoutModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
}

export default function CheckoutModal({
  isOpen,
  onOpenChange,
  total,
}: CheckoutModalProps) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePlaceOrder = async () => {
    if (address.length < 5) {
      return toast.error("Please provide a valid shipping address");
    }

    setLoading(true);
    try {
      await orderApi.placeOrder({
        shippingAddress: address,
      });

      toast.success("Order placed successfully!");
      onOpenChange(false);
      router.push("/dashboard/orders");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Order placement failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" /> Finalize Order
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Order Summary in Modal */}
          <div className="bg-muted/50 p-4 rounded-xl border border-primary/10">
            <div className="flex justify-between text-sm mb-1 text-muted-foreground">
              <span>Payment Method:</span>
              <span className="font-bold text-foreground flex items-center gap-1">
                <CreditCard className="h-4 w-4" /> Cash on Delivery
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Amount Payable:</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Address Input */}
          <div className="space-y-3">
            <label className="text-sm font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Shipping Address
            </label>
            <Textarea
              placeholder="Enter your full delivery address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="min-h-[100px] rounded-xl focus-visible:ring-primary"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="rounded-xl px-8 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Confirm Order"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
