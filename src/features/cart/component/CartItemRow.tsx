import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartItemRow({ item, onUpdateQty, onRemove }: any) {
  const medicine = item.medicine;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center text-2xl font-bold text-primary">
        {medicine.name.charAt(0)}
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-bold text-lg">{medicine.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {medicine.description}
        </p>
        <p className="text-primary font-semibold mt-1">
          ${medicine.selling_price.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-3 bg-muted/50 p-1 rounded-lg">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-bold">{item.quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
          disabled={item.quantity >= medicine.available_quantity}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-right min-w-20">
        <p className="font-bold text-lg">
          ${(medicine.selling_price * item.quantity).toFixed(2)}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:bg-destructive/10"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
