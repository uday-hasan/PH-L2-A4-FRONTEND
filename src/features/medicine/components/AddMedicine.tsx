"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";

import { toast } from "sonner";
import { categoryApi } from "@/features/category/category.api";
import { medicineApi } from "../api/medicine.api";

const medicineSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  selling_price: z.number().positive("Must be a positive number"),
  purchase_price: z.number().positive("Must be a positive number"),
  available_quantity: z.number().int().min(0, "Quantity cannot be negative"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type MedicineFormValues = z.infer<typeof medicineSchema>;

export const AddMedicineDialog = ({ onRefresh }: { onRefresh: () => void }) => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      available_quantity: 0,
      category: "",
      status: "ACTIVE",
      description: "",
      name: "",
      purchase_price: 0,
      selling_price: 0,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll({
          limit: 100,
          page: 1,
          search: "",
        });
        setCategories(res.data.data.categories);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load categories",
        );
      }
    };
    if (open) fetchCategories();
  }, [open]);

  const onSubmit = async (data: MedicineFormValues) => {
    setIsSubmitting(true);
    try {
      await medicineApi.create(data);
      toast.success("Medicine added successfully");
      reset();
      setOpen(false);
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Add Medicine
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Medicine Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                onValueChange={(val) =>
                  setValue("category", val, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchase_price">Purchase Price</Label>
              <Input
                id="purchase_price"
                type="number"
                step="0.01"
                {...register("purchase_price", { valueAsNumber: true })}
              />
              {errors.purchase_price && (
                <p className="text-xs text-destructive">
                  {errors.purchase_price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="selling_price">Selling Price</Label>
              <Input
                id="selling_price"
                type="number"
                step="0.01"
                {...register("selling_price", { valueAsNumber: true })}
              />
              {errors.selling_price && (
                <p className="text-xs text-destructive">
                  {errors.selling_price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="available_quantity">Stock</Label>
              <Input
                id="available_quantity"
                type="number"
                {...register("available_quantity", { valueAsNumber: true })}
              />
              {errors.available_quantity && (
                <p className="text-xs text-destructive">
                  {errors.available_quantity.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Save Medicine"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
