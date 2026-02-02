"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Star, ShoppingCart, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Medicine } from "@/types/index";
import { medicineApi } from "@/features/medicine/api/medicine.api";

interface TopSellingProps {
  limit?: number;
}

const TopSelling: React.FC<TopSellingProps> = ({ limit = 6 }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopSelling = useCallback(async () => {
    setLoading(true);
    try {
      const res = await medicineApi.getAll({
        page: 1,
        limit: limit,
        search: "",
      });
      setMedicines(res.data.data.medicines);
    } catch (error) {
      console.error("Failed to fetch top selling medicines:", error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTopSelling();
  }, [fetchTopSelling]);

  const calculateAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Top Selling
              </h2>
            </div>
            <p className="text-muted-foreground">
              Most popular medicines this month
            </p>
          </div>
          <a
            href="/medicine"
            className="hidden md:block text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View All →
          </a>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-lg overflow-hidden animate-pulse"
              >
                {/* Skeleton Image */}
                <div className="aspect-square bg-muted" />

                {/* Skeleton Content */}
                <div className="p-4 space-y-3">
                  {/* Category skeleton */}
                  <div className="h-5 w-20 bg-muted rounded" />

                  {/* Title skeleton */}
                  <div className="h-6 w-3/4 bg-muted rounded" />

                  {/* Description skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                  </div>

                  {/* Rating skeleton */}
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-muted rounded" />
                    <div className="h-4 w-12 bg-muted rounded" />
                    <div className="h-4 w-16 bg-muted rounded" />
                  </div>

                  {/* Price and button skeleton */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <div className="h-8 w-20 bg-muted rounded" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </div>
                    <div className="h-10 w-10 bg-muted rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No medicines available at the moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((medicine) => (
              <Link
                key={medicine.id}
                href={`/medicine/${medicine.id}`}
                className="group"
              >
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {/* Product Image Placeholder */}
                  <div className="aspect-square bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
                    <div className="text-6xl font-bold text-primary/20">
                      {medicine.name.charAt(0)}
                    </div>
                    {medicine.available_quantity > 100 && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                        Bestseller
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {medicine.category?.name || "General"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                      {medicine.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {medicine.description ||
                        "High quality pharmaceutical product"}
                    </p>

                    {/* Rating */}
                    {medicine.reviews && medicine.reviews.length > 0 ? (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium text-sm">
                          {calculateAverageRating(medicine.reviews)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({medicine.reviews.length} reviews)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-muted" />
                        <span className="text-xs text-muted-foreground">
                          No reviews yet
                        </span>
                      </div>
                    )}

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          ${medicine.selling_price}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {medicine.available_quantity} in stock
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Add to cart logic here
                          console.log("Add to cart:", medicine.id);
                        }}
                        className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        {!loading && medicines.length > 0 && (
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
};

export default TopSelling;
