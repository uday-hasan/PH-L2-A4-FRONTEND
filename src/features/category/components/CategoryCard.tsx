import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { EditCategoryDialog } from "./EditCategory";

export const CategoryCard = ({ category, onStatusChange, onUpdate }: any) => {
  return (
    <Card className="relative hover:shadow-lg transition-all duration-200 border-border/60 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Category Icon/Initial */}
            <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {category.name.charAt(0).toUpperCase()}
            </div>

            {/* Category Name */}
            <CardTitle className="text-lg font-bold truncate mb-2">
              {category.name}
            </CardTitle>

            {/* Status Badge */}
            <Badge
              variant={category.status === "ACTIVE" ? "default" : "secondary"}
              className="text-[10px] uppercase tracking-wider"
            >
              {category.status}
            </Badge>
          </div>

          {/* Edit Button */}
          <div className="shrink-0">
            <EditCategoryDialog category={category} onUpdate={onUpdate} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div className="min-h-10">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {category.description || "No description provided."}
          </p>
        </div>

        {/* Medicine Count */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Products:</span>
          <span className="font-semibold text-foreground">
            {category._count?.medicine || 0}
          </span>
        </div>

        {/* Status Toggle */}
        <div className="pt-4 border-t border-border/40">
          <Label className="text-xs text-muted-foreground mb-3 block">
            Status Control
          </Label>
          <RadioGroup
            defaultValue={category.status}
            onValueChange={(val) => onStatusChange(category.id, val)}
            className="flex items-center gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ACTIVE" id={`active-${category.id}`} />
              <Label
                htmlFor={`active-${category.id}`}
                className="text-sm cursor-pointer font-medium"
              >
                Active
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="INACTIVE" id={`inactive-${category.id}`} />
              <Label
                htmlFor={`inactive-${category.id}`}
                className="text-sm cursor-pointer font-medium"
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
