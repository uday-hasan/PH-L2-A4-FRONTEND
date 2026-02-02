"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { medicineApi } from "../api/medicine.api";
import { Medicine, PaginationMeta } from "@/types/index";
import { AddMedicineDialog } from "./AddMedicine";
import { MedicineDashboardCard } from "./MedicineDashboardCard";
import { PublicMedicineCard } from "./PublicMedicineCard";

interface MedicinePageProps {
  mode?: "private" | "public";
}

export default function MedicinePage({ mode = "private" }: MedicinePageProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    totalPages: 1,
    total: 0,
    page: 1,
    limit: mode === "public" ? 6 : 8,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 500);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const res =
        mode === "public"
          ? await medicineApi.getAll({
              page,
              limit: 6,
              search: debouncedSearch,
            })
          : await medicineApi.getPrivateAll({
              page,
              limit: 8,
              search: debouncedSearch,
            });
      setMedicines(res.data.data.medicines);
      setMeta(res.data.data.meta);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load medicines");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, mode]);

  // Handler: Update Stock
  const handleStockUpdate = async (id: string, quantity: number) => {
    try {
      await medicineApi.updateStock(id, quantity);
      toast.success("Stock updated");
      fetchMedicines();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Stock update failed");
    }
  };

  // Handler: Update Status or Other Info
  const handleUpdate = async (id: string, payload: Partial<Medicine>) => {
    try {
      await medicineApi.update(id, payload);
      toast.success("Medicine updated");
      fetchMedicines();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Public Mode Rendering
  if (mode === "public") {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Medicine</h2>
              </div>
              <p className="text-muted-foreground">
                Most popular medicines this month
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medicines..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-muted rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.map((medicine) => (
                <PublicMedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 py-8">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm">
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
          )}

          {/* Mobile View All Button */}
          {meta.totalPages > 1 && (
            <div className="mt-8 text-center md:hidden">
              <a
                href="/medicine"
                className="inline-block text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View All Products →
              </a>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Private Mode Rendering
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Medicine Inventory</h1>
        <AddMedicineDialog onRefresh={fetchMedicines} />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
              onStatusChange={handleUpdate}
              onStockUpdate={handleStockUpdate}
              onEdit={handleUpdate}
            />
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 py-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span>
            {page} / {meta.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
