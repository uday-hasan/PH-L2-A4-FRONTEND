"use client";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { cartApi } from "../api/cart.api";
import CartItemRow from "./CartItemRow";
import CartSummary from "./CartSummary";
import CheckoutModal from "./CheckoutModal";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await cartApi.getCart();
      setCart(res.data.data);
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Use useMemo to calculate totals whenever cart items change
  const totals = useMemo(() => {
    if (!cart?.items) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };

    const subtotal = cart.items.reduce(
      (acc: number, item: any) =>
        acc + item.medicine.selling_price * item.quantity,
      0,
    );
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  }, [cart]);

  const updateQty = async (itemId: string, newQty: number) => {
    try {
      await cartApi.updateQuantity(itemId, newQty);
      fetchCart();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await cartApi.removeItem(itemId);
      toast.success("Item removed");
      fetchCart();
    } catch (error) {
      toast.error("Remove failed");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your cart...</p>
      </div>
    );

  if (!cart || cart.items.length === 0)
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-muted/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you {"haven't"} added anything yet.
        </p>
        <Link href="/medicine">
          <Button size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" /> Start Shopping
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <ShoppingBag className="h-8 w-8 text-primary" />
        Shopping Cart ({cart.items.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item: any) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQty={updateQty}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <CartSummary
            totals={totals}
            onCheckout={() => setIsCheckoutOpen(true)}
          />
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        total={totals.total}
      />
    </div>
  );
}
