"use client";

import React, { useEffect, useState } from "react";
import { Star, Quote, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { reviewApi } from "@/features/review/auth/review.api";
import { Skeleton } from "../ui/skeleton";
interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    name: string;
  };
  medicine: {
    name: string;
  };
}

interface ReviewsSectionProps {
  medicineId?: string;
  limit?: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  medicineId,
  limit = 6,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await reviewApi.getAll();

        setReviews(response.data.data.reviews || []);
      } catch (error: any) {
        console.error("Failed to fetch reviews", error);
        toast.error("Could not load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [medicineId, limit]);

  const renderStars = (rating: number) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "text-yellow-500 fill-yellow-500"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  if (loading) return <ReviewSkeletonGrid />;

  if (!loading && reviews.length === 0) {
    return (
      <div className="text-center py-12 opacity-50">
        <AlertCircle className="mx-auto h-12 w-12 mb-2" />
        <p>No reviews yet for this product.</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Star className="h-6 w-6 text-primary fill-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              Customer Reviews
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real feedback from patients and healthcare providers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition-all relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {getInitials(review.user.name)}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {review.user.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {renderStars(review.rating)}

              <p className="text-muted-foreground text-sm leading-relaxed italic">
                &quot;{review.comment || "No comment provided."}&quot;
              </p>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Purchased:{" "}
                  <span className="text-primary font-medium">
                    {review.medicine.name}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ReviewSkeletonGrid = () => (
  <div className="max-w-7xl mx-auto px-4 py-16">
    <div className="space-y-4 mb-12 flex flex-col items-center">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="pt-2 border-t border-border">
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ReviewsSection;
