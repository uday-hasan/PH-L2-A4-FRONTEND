"use client";
import { useCallback, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { categoryApi } from "../category.api";
import { CategoryCard as PrivateCategoryCard } from "./CategoryCard";
import { CategoryDialog } from "./CategoryDialog";
import Link from "next/link";
import { Category } from "@/types";

export default function CategoryPage({
  mood = "private",
}: {
  mood?: "private" | "public";
}) {
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
      toast.error(
        err instanceof Error ? err.message : "Failed to load categories",
      );
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
      toast.error(
        err instanceof Error ? err.message : "Failed to update status",
      );
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
    <div
      className={`space-y-6 ${mood === "private" ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"}`}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {mood === "private" ? "Manage Categories" : "Browse Categories"}
          </h1>
          <p className="text-muted-foreground">
            {mood === "private"
              ? "Add and organize your medicine categories."
              : "Explore our wide range of medicine categories."}
          </p>
        </div>
        {mood === "private" && <CategoryDialog onSubmit={handleCreate} />}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div
          className={`grid gap-4 ${
            mood === "private"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`bg-muted rounded-lg animate-pulse ${
                mood === "private" ? "h-48" : "h-40"
              }`}
            />
          ))}
        </div>
      ) : (
        <>
          {/* Private Mode - Admin Cards */}
          {mood === "private" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat: Category) => (
                <PrivateCategoryCard
                  key={cat.id}
                  category={cat}
                  onStatusChange={handleStatusUpdate}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          )}

          {/* Public Mode - Customer Cards */}
          {mood === "public" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat: Category) => (
                <Link
                  key={cat.id}
                  href={`/medicine?category=${cat.id}`}
                  className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    {/* Icon Placeholder */}
                    <div className="bg-primary/10 text-primary p-4 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <div className="h-8 w-8 flex items-center justify-center font-bold text-xl">
                        {cat.name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Category Name */}
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {cat.name}
                    </h3>

                    {/* Product Count */}
                    <p className="text-sm text-muted-foreground">
                      {cat._count?.medicine || 0} products
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories found.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && categories.length > 0 && (
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
      )}
    </div>
  );
}
