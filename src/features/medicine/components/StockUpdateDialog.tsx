import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import { Medicine } from "@/types/index";

interface Props {
  medicine: Medicine;
  onUpdate: (id: string, quantity: number) => Promise<void>;
}

export const StockUpdateDialog = ({ medicine, onUpdate }: Props) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onUpdate(medicine.id, quantity);
    setLoading(false);
    setOpen(false);
    setQuantity(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Plus className="w-3 h-3" /> Stock
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock: {medicine.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            type="number"
            placeholder="Quantity to add..."
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <Button
            className="w-full"
            disabled={loading || quantity <= 0}
            onClick={handleSubmit}
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Update Inventory"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
