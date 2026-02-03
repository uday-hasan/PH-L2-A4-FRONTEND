"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, FilterX, Check } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { medicineApi } from "../api/medicine.api";
import { Medicine, PaginationMeta } from "@/types/index";
import { AddMedicineDialog } from "./AddMedicine";
import { MedicineDashboardCard } from "./MedicineDashboardCard";
import { PublicMedicineCard } from "./PublicMedicineCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryApi } from "@/features/category/category.api";
import { AxiosError } from "axios";

interface MedicinePageProps {
  mode?: "private" | "public";
}

export default function MedicinePage({ mode = "private" }: MedicinePageProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>(
    [],
  );

  const [meta, setMeta] = useState<PaginationMeta>({
    totalPages: 1,
    total: 0,
    page: 1,
    limit: mode === "public" ? 6 : 8,
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");

  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const [appliedMin, setAppliedMin] = useState<number | undefined>(undefined);
  const [appliedMax, setAppliedMax] = useState<number | undefined>(undefined);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 500);

  const isPriceFilterValid =
    Number(minPrice) > 0 &&
    Number(maxPrice) > 0 &&
    Number(maxPrice) > Number(minPrice);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, supRes] = await Promise.all([
          categoryApi.getAll({ page: 1, limit: 100, search: "" }),
          medicineApi.getSuppliers(),
        ]);
        setCategories(catRes.data.data.categories || []);
        setSuppliers(supRes.data.data || []);
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.response?.data);
        console.error("Filter fetch error:", err);
      }
    };
    fetchFilters();
  }, []);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: mode === "public" ? 6 : 8,
        search: debouncedSearch,
        category_id: selectedCategory === "all" ? undefined : selectedCategory,
        seller_id: selectedSupplier === "all" ? undefined : selectedSupplier,
        minPrice: appliedMin,
        maxPrice: appliedMax,
      };

      const res =
        mode === "public"
          ? await medicineApi.getAll(params)
          : await medicineApi.getPrivateAll(params);

      setMedicines(res.data.data.medicines);
      setMeta(res.data.data.meta);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load medicines");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    debouncedSearch,
    selectedCategory,
    selectedSupplier,
    appliedMin,
    appliedMax,
    mode,
  ]);

  const handleApplyPriceFilter = () => {
    if (isPriceFilterValid) {
      setAppliedMin(Number(minPrice));
      setAppliedMax(Number(maxPrice));
      setPage(1);
    }
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedSupplier("all");
    setMinPrice("");
    setMaxPrice("");
    setAppliedMin(undefined);
    setAppliedMax(undefined);
    setPage(1);
  };

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, selectedSupplier]);

  const renderFilters = () => (
    <div className="flex flex-wrap items-end gap-4 mb-8 bg-muted/20 p-4 rounded-xl border border-border">
      {/* Search */}
      <div className="flex-1 min-w-[200px] space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase ml-1">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category */}
      <div className="w-[200px] space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase ml-1">
          Category
        </label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Supplier */}
      <div className="w-[200px] space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase ml-1">
          Manufacturer
        </label>
        <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
          <SelectTrigger>
            <SelectValue placeholder="Manufacturer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Manufacturers</SelectItem>
            {suppliers?.map((sup) => (
              <SelectItem key={sup.id} value={sup.id}>
                {sup.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Inputs & Filter Button */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase ml-1">
          Price Range
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-20"
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-20"
          />
          <Button
            variant={isPriceFilterValid ? "default" : "secondary"}
            size="icon"
            onClick={handleApplyPriceFilter}
            disabled={!isPriceFilterValid}
            title="Apply price filter"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Reset */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase opacity-0">
          Reset
        </label>
        <Button variant="outline" onClick={handleReset} className="px-3">
          <FilterX className="h-4 w-4 mr-2" /> Reset
        </Button>
      </div>
    </div>
  );

  const renderPagination = () =>
    meta.totalPages > 1 && (
      <div className="flex justify-center items-center space-x-4 py-8">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span className="text-sm font-medium">
          Page {page} of {meta.totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === meta.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    );

  if (mode === "public") {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">
                  Medicine Store
                </h2>
              </div>
              <p className="text-muted-foreground">
                Find and filter top-quality medicines
              </p>
            </div>
          </div>
          {renderFilters()}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-muted rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {medicines.map((m) => (
                  <PublicMedicineCard key={m.id} medicine={m} />
                ))}
              </div>
              {medicines.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  No medicines found matching your criteria.
                </div>
              )}
            </>
          )}
          {renderPagination()}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <AddMedicineDialog onRefresh={fetchMedicines} />
      </div>
      {renderFilters()}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-muted rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {medicines.map((m) => (
            <MedicineDashboardCard
              key={m.id}
              medicine={m}
              onStatusChange={(id, p) =>
                medicineApi.update(id, p).then(fetchMedicines)
              }
              onStockUpdate={(id, q) =>
                medicineApi.updateStock(id, q).then(fetchMedicines)
              }
              onEdit={(id, p) => medicineApi.update(id, p).then(fetchMedicines)}
            />
          ))}
        </div>
      )}
      {renderPagination()}
    </div>
  );
}
