import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Truck } from "lucide-react";

export default function CartSummary({ items }: any) {
  const subtotal = items.reduce(
    (acc: number, item: any) =>
      acc + item.medicine.selling_price * item.quantity,
    0,
  );
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-card border-2 border-primary/10 rounded-2xl p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Tax (5%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      <Button className="w-full mt-6 h-12 text-lg font-bold shadow-lg shadow-primary/20">
        Proceed to Checkout
      </Button>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Truck className="h-4 w-4 text-primary" />
          <span>Free delivery on orders over $50</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Secure encrypted checkout</span>
        </div>
      </div>
    </div>
  );
}
