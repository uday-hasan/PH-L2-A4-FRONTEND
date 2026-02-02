"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingCart,
  Heart,
  Shield,
  Package,
  Clock,
  AlertCircle,
  ChevronLeft,
  Plus,
  Minus,
  CheckCircle2,
  User,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { medicineApi } from "../api/medicine.api";
import { Medicine } from "@/types/index";
import { reviewApi } from "@/features/review/auth/review.api";
import { useAuthStore } from "@/store/use-auth-store";

interface MedicineDetailsPageProps {
  medicineId: string;
}

export default function MedicineDetailsPage({
  medicineId,
}: MedicineDetailsPageProps) {
  const { isAuthenticated, user } = useAuthStore((state) => state);
  const userId = user?.id;
  const router = useRouter();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchMedicine = async () => {
      setLoading(true);
      try {
        const res = await medicineApi.getOne(medicineId);
        setMedicine(res.data.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load medicine");
      } finally {
        setLoading(false);
      }
    };

    if (medicineId) {
      fetchMedicine();
    }
  }, [medicineId]);

  const calculateAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = (reviews: { rating: number }[]) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (!reviews) return distribution;

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++;
      }
    });
    return distribution;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    if (!medicine) return;
    toast.success(`Added ${quantity} ${medicine.name} to cart`);
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmittingReview(true);
    try {
      const payload: { medicineId: string; rating: number; comment?: string } =
        {
          medicineId: medicineId,
          rating: reviewRating,
        };

      if (reviewComment.trim()) {
        payload.comment = reviewComment;
      }

      await reviewApi.create(payload);

      toast.success("Review added successfully");
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewComment("");

      const res = await medicineApi.getOne(medicineId);
      setMedicine(res.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const incrementQuantity = () => {
    if (medicine && quantity < medicine.available_quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleLoginRedirect = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    }
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            {/* Back button skeleton */}
            <div className="h-10 w-32 bg-muted rounded-lg mb-8" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-2xl" />
                <div className="flex gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-24 h-24 bg-muted rounded-lg" />
                  ))}
                </div>
              </div>

              {/* Content skeleton */}
              <div className="space-y-6">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-10 w-3/4 bg-muted rounded" />
                <div className="h-6 w-32 bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-5/6 bg-muted rounded" />
                  <div className="h-4 w-4/6 bg-muted rounded" />
                </div>
                <div className="h-32 w-full bg-muted rounded-xl" />
                <div className="h-16 w-full bg-muted rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Medicine Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The medicine {"you're"} looking for {"doesn't"} exist or has been
            removed.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const avgRating = calculateAverageRating(medicine.reviews || []);
  const ratingDistribution = getRatingDistribution(medicine.reviews || []);
  const totalReviews = medicine.reviews?.length || 0;
  const stockStatus =
    medicine.available_quantity === 0
      ? "out"
      : medicine.available_quantity < 20
        ? "low"
        : "available";

  const hasUserReviewed = medicine.reviews?.some(
    (review) => review.userId === userId,
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 hover:bg-primary/10"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Medicine
        </Button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-linear-to-br from-primary/10 via-primary/5 to-background border-2 border-border rounded-2xl overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-9xl font-bold text-primary/20 select-none">
                  {medicine.name.charAt(0)}
                </div>
              </div>

              {/* Stock Badge */}
              {stockStatus === "low" && (
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive" className="text-sm">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Low Stock
                  </Badge>
                </div>
              )}

              {stockStatus === "out" && (
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive" className="text-sm">
                    Out of Stock
                  </Badge>
                </div>
              )}

              {/* Wishlist Button */}
              {isAuthenticated && (
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 p-3 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-all"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Thumbnail Gallery (placeholder) */}
            <div className="flex gap-4">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-24 h-24 border-2 rounded-lg transition-all ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="w-full h-full bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary/40">
                      {medicine.name.charAt(index % medicine.name.length)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Category */}
            <Badge variant="outline" className="text-sm">
              {medicine.category?.name || "General Medicine"}
            </Badge>

            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {medicine.name}
              </h1>
              {medicine.description && (
                <p className="text-lg text-muted-foreground">
                  {medicine.description}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= parseFloat(avgRating.toString())
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{avgRating}</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <span className="text-sm text-muted-foreground">
                {totalReviews} reviews
              </span>
            </div>

            {/* Price */}
            <div className="bg-muted/50 p-6 rounded-xl border-2 border-border">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-foreground">
                  ${medicine.selling_price}
                </span>
                <span className="text-lg text-muted-foreground">/unit</span>
              </div>
              {medicine.available_quantity > 0 && (
                <p className="text-sm text-muted-foreground">
                  {medicine.available_quantity} units available
                </p>
              )}
            </div>

            {/* Quantity Selector - Only show if authenticated */}
            {isAuthenticated && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-20 text-center">
                    <span className="text-2xl font-bold">{quantity}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= medicine.available_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1 text-lg h-14"
                onClick={handleAddToCart}
                disabled={medicine.available_quantity === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {medicine.available_quantity === 0
                  ? "Out of Stock"
                  : isAuthenticated
                    ? "Add to Cart"
                    : "Login to Purchase"}
              </Button>
            </div>

            {/* Not logged in message */}
            {!isAuthenticated && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Sign in for the best experience
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      Create an account or sign in to add items to your cart,
                      save favorites, and leave reviews.
                    </p>
                    <Button
                      size="sm"
                      onClick={handleLoginRedirect}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Sign In / Sign Up
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <Shield className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm font-medium">Quality Assured</p>
                <p className="text-xs text-muted-foreground">
                  100% authentic products
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <Package className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm font-medium">Fast Delivery</p>
                <p className="text-xs text-muted-foreground">
                  Ships within 24 hours
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <Clock className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">
                  7-day return policy
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <CheckCircle2 className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">
                  Safe & encrypted
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Customer Reviews</h2>
            {isAuthenticated && !hasUserReviewed && (
              <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                {showReviewForm ? "Cancel" : "Write a Review"}
              </Button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && isAuthenticated && (
            <div className="mb-8 bg-card border-2 border-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Write Your Review</h3>

              {/* Star Rating Selector */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">
                  Your Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= reviewRating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">
                  Your Review
                </label>
                <Textarea
                  placeholder="Share your experience with this medicine..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmitReview}
                  disabled={submittingReview || reviewRating === 0}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewRating(0);
                    setReviewComment("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {totalReviews > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border-2 border-border rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-foreground mb-2">
                      {avgRating}
                    </div>
                    <div className="flex justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= parseFloat(avgRating.toString())
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on {totalReviews} reviews
                    </p>
                  </div>

                  <Separator className="mb-6" />

                  {/* Rating Distribution */}
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count =
                        ratingDistribution[
                          rating as keyof typeof ratingDistribution
                        ];
                      const percentage =
                        totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm w-8">{rating}★</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                {medicine.reviews?.slice(0, 10).map((review, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-foreground mb-3">{review.comment}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="font-medium">
                        {review.user?.name || "Anonymous User"}
                      </span>
                      <span>•</span>
                      <span>
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : "Recent"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-card border-2 border-border rounded-xl p-12 text-center">
              <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to review this medicine!
              </p>
              {isAuthenticated && !hasUserReviewed && (
                <Button onClick={() => setShowReviewForm(true)}>
                  Write the First Review
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              You need to be signed in to perform this action. Create an account
              or sign in to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleLoginRedirect} className="flex-1">
              Go to Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
