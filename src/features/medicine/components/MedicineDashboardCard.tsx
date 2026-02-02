import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  return (
    <Card className="hover:shadow-lg transition-all border-border/60">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div className="space-y-1">
          <Badge variant="outline" className="text-[10px]">
            {medicine.category?.name}
          </Badge>
          <CardTitle className="text-lg font-bold truncate">
            {medicine.name}
          </CardTitle>
          <p className="text-xs font-semibold text-primary">
            Price: ${medicine.selling_price}
          </p>
        </div>
        <EditMedicine medicine={medicine} onUpdate={onEdit} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground font-medium">
            Stock: <b>{medicine.available_quantity}</b>
          </span>
          <StockUpdateDialog medicine={medicine} onUpdate={onStockUpdate} />
        </div>

        <div className="pt-4 border-t space-y-3">
          <RadioGroup
            defaultValue={medicine.status}
            onValueChange={(val: "ACTIVE" | "INACTIVE") =>
              onStatusChange(medicine.id, { status: val })
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="ACTIVE" id={`a-${medicine.id}`} />
              <Label htmlFor={`a-${medicine.id}`} className="text-xs">
                Active
              </Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="INACTIVE" id={`i-${medicine.id}`} />
              <Label htmlFor={`i-${medicine.id}`} className="text-xs">
                Inactive
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
