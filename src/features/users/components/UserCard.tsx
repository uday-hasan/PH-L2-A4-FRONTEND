import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, ShieldCheck } from "lucide-react";
import { EditUserDialog } from "./EditUserDialog";

export const UserCard = ({ user, onStatusChange, onUpdate }: any) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all border-border/50">
      <CardHeader className="p-4 bg-muted/30 border-b">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-sm truncate max-w-32">
                {user.name}
              </h3>
              <Badge variant="outline" className="text-[10px] h-5">
                {user.userType}
              </Badge>
            </div>
          </div>
          <EditUserDialog user={user} onUpdate={onUpdate} />
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Mail className="w-3.5 h-3.5 mr-2" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 mr-2" />
            <span>
              Status:{" "}
              <b
                className={
                  user.status === "ACTIVE"
                    ? "text-green-600"
                    : "text-destructive"
                }
              >
                {user.status}
              </b>
            </span>
          </div>
        </div>

        <div className="pt-3 border-t">
          <RadioGroup
            defaultValue={user.status}
            onValueChange={(val) => onStatusChange(user.id, { status: val })}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-1.5">
              <RadioGroupItem value="ACTIVE" id={`active-${user.id}`} />
              <Label
                htmlFor={`active-${user.id}`}
                className="text-xs cursor-pointer"
              >
                Active
              </Label>
            </div>
            <div className="flex items-center space-x-1.5">
              <RadioGroupItem value="INACTIVE" id={`inactive-${user.id}`} />
              <Label
                htmlFor={`inactive-${user.id}`}
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
