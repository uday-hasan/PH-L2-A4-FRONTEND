import { Star, Package, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Medicine } from "@/types/index";
import { StockUpdateDialog } from "./StockUpdateDialog";
import { EditMedicine } from "./EditMedicine";

interface Props {
  medicine: Medicine;
  onStatusChange: (
    id: string,
    payload: { status: "ACTIVE" | "INACTIVE" },
  ) => Promise<void>;
  onStockUpdate: (id: string, quantity: number) => Promise<void>;
  onEdit: (id: string, payload: any) => Promise<void>;
}

export const MedicineDashboardCard = ({
  medicine,
  onStatusChange,
  onStockUpdate,
  onEdit,
}: Props) => {
  const calculateAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(medicine.reviews || []);
  const stockStatus =
    medicine.available_quantity === 0
      ? "out-of-stock"
      : medicine.available_quantity < 20
        ? "low-stock"
        : "in-stock";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all border-border/60 group">
      {/* Header with Image Placeholder */}
      <div className="relative aspect-square bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <div className="text-6xl font-bold text-primary/20">
          {medicine.name.charAt(0)}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={medicine.status === "ACTIVE" ? "default" : "secondary"}
            className="text-xs"
          >
            {medicine.status}
          </Badge>
        </div>

        {/* Edit Button */}
        <div className="absolute top-3 right-3">
          <EditMedicine medicine={medicine} onUpdate={onEdit} />
        </div>

        {/* Stock Status Badge */}
        {stockStatus === "low-stock" && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="destructive" className="text-xs">
              Low Stock
            </Badge>
          </div>
        )}
        {stockStatus === "out-of-stock" && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Category & Name */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded inline-block">
            {medicine.category?.name || "General"}
          </span>
          <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors line-clamp-1">
            {medicine.name}
          </h3>
          {medicine.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {medicine.description}
            </p>
          )}
        </div>

        {/* Rating */}
        {medicine.reviews && medicine.reviews.length > 0 && (
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium text-sm">{avgRating}</span>
            <span className="text-xs text-muted-foreground">
              ({medicine.reviews.length})
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-center space-x-2 py-2 px-3 bg-muted/50 rounded-lg">
          <DollarSign className="h-4 w-4 text-primary" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Selling Price</p>
            <p className="text-xl font-bold text-foreground">
              ${medicine.selling_price}
            </p>
          </div>
        </div>

        {/* Stock Section */}
        <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Available Stock</p>
              <p className="text-lg font-bold text-foreground">
                {medicine.available_quantity}
              </p>
            </div>
          </div>
          <StockUpdateDialog medicine={medicine} onUpdate={onStockUpdate} />
        </div>

        {/* Status Toggle */}
        <div className="pt-4 border-t space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Status</p>
          <RadioGroup
            defaultValue={medicine.status}
            onValueChange={(val: "ACTIVE" | "INACTIVE") =>
              onStatusChange(medicine.id, { status: val })
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ACTIVE" id={`a-${medicine.id}`} />
              <Label htmlFor={`a-${medicine.id}`} className="text-sm">
                Active
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="INACTIVE" id={`i-${medicine.id}`} />
              <Label htmlFor={`i-${medicine.id}`} className="text-sm">
                Inactive
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
