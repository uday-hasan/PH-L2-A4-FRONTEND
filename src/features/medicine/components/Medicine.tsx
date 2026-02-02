"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { medicineApi } from "../api/medicine.api";
import { Medicine, PaginationMeta } from "@/types/index";
import { AddMedicineDialog } from "./AddMedicine";
import { MedicineDashboardCard } from "./MedicineDashboardCard";

export default function MedicinePage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    totalPages: 1,
    total: 0,
    page: 1,
    limit: 8,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 500);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const res = await medicineApi.getPrivateAll({
        page,
        limit: 8,
        search: debouncedSearch,
      });
      setMedicines(res.data.data.medicines);
      setMeta(res.data.data.meta);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
