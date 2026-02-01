import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { EditCategoryDialog } from "./EditCategory";

export const CategoryCard = ({ category, onStatusChange, onUpdate }: any) => {
  return (
    <Card className="relative hover:shadow-md transition-all duration-200 border-border/60">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold truncate max-w-36">
            {category.name}
          </CardTitle>
          <Badge
            variant={category.status === "ACTIVE" ? "default" : "secondary"}
            className="text-[10px] uppercase tracking-wider"
          >
            {category.status}
          </Badge>
        </div>

        {/* --- EDIT BUTTON --- */}
        <EditCategoryDialog category={category} onUpdate={onUpdate} />
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 h-10">
          {category.description || "No description provided."}
        </p>

        <div className="pt-4 border-t border-border/40">
          <RadioGroup
            defaultValue={category.status}
            onValueChange={(val) => onStatusChange(category.id, val)}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-1.5">
              <RadioGroupItem value="ACTIVE" id={`active-${category.id}`} />
              <Label
                htmlFor={`active-${category.id}`}
                className="text-xs cursor-pointer"
              >
                Active
              </Label>
            </div>
            <div className="flex items-center space-x-1.5">
              <RadioGroupItem value="INACTIVE" id={`inactive-${category.id}`} />
              <Label
                htmlFor={`inactive-${category.id}`}
                className="text-xs cursor-pointer"
              >
                Inactive
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
