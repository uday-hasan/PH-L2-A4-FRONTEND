"use client";
import { useCallback, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { categoryApi } from "../category.api";
import { CategoryCard } from "./CategoryCard";
import { CategoryDialog } from "./CategoryDialog";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 500);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await categoryApi.getAll({
        page,
        search: debouncedSearch,
        limit: 8,
      });
      setCategories(data.data.categories);
      setTotalPages(data.data.meta.totalPages);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchCategories();
  }, [page, debouncedSearch, fetchCategories]);

  const handleCreate = async (payload: any) => {
    try {
      await categoryApi.create(payload);
      toast.success("Category created");
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error creating category");
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await categoryApi.update(id, { status });
      toast.success("Status updated");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleUpdate = async (id: string, payload: any) => {
    const toastId = toast.loading("Updating category...");
    try {
      await categoryApi.update(id, payload);
      toast.success("Category updated successfully", { id: toastId });
      fetchCategories(); // Refresh grid
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed", {
        id: toastId,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Categories</h1>
          <p className="text-muted-foreground">
            Add and organize your medicine categories.
          </p>
        </div>
        <CategoryDialog onSubmit={handleCreate} />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat: any) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onStatusChange={handleStatusUpdate}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-2 py-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
