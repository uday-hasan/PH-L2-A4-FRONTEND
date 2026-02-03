"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingCart,
  Shield,
  Package,
  Clock,
  ChevronLeft,
  Plus,
  Minus,
  CheckCircle2,
  User as UserIcon,
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
import { reviewApi } from "@/features/review/auth/review.api";

import { useAuthStore } from "@/store/use-auth-store";
import { Medicine } from "@/types";
import { cartApi } from "@/features/cart/api/cart.api";

interface MedicineDetailsPageProps {
  medicineId: string;
}

export default function MedicineDetailsPage({
  medicineId,
}: MedicineDetailsPageProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [medRes, cartRes] = await Promise.all([
        medicineApi.getOne(medicineId),
        isAuthenticated ? cartApi.getCart() : Promise.resolve(null),
      ]);

      setMedicine(medRes.data.data);

      if (cartRes) {
        const itemExists = cartRes.data.data.items.some(
          (i: any) => i.medicineId === medicineId,
        );
        setIsInCart(itemExists);
      }
    } catch (error: any) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load product details",
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, medicineId]);

  useEffect(() => {
    fetchInitialData();
  }, [medicineId, isAuthenticated, fetchInitialData]);

  const handleCartAction = async () => {
    if (!isAuthenticated) return setShowLoginDialog(true);
    if (isInCart) return router.push("/dashboard/cart");

    try {
      setCartLoading(true);
      await cartApi.addItem(medicineId, quantity);
      toast.success("Added to cart");
      setIsInCart(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) return toast.error("Please select a rating");

    setSubmittingReview(true);
    try {
      await reviewApi.create({
        medicineId,
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("Review submitted!");
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewComment("");
      fetchInitialData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getRatingStats = () => {
    const reviews = medicine?.reviews || [];
    const total = reviews.length;
    const avg =
      total > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1)
        : "0.0";
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => dist[r.rating as keyof typeof dist]++);
    return { avg, total, dist };
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse">
        Loading medicine details...
      </div>
    );
  if (!medicine)
    return <div className="p-20 text-center">Medicine not found.</div>;

  const { avg, total, dist } = getRatingStats();
  const hasUserReviewed = medicine.reviews?.some((r) => r.userId === user?.id);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Gallery */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-square bg-white border rounded-3xl flex items-center justify-center text-9xl font-bold text-primary/10 shadow-sm relative overflow-hidden">
              {medicine.name.charAt(0)}
              {medicine.available_quantity < 10 &&
                medicine.available_quantity > 0 && (
                  <Badge className="absolute top-6 left-6 bg-orange-500">
                    Low Stock
                  </Badge>
                )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-white border rounded-xl flex items-center justify-center text-2xl font-bold text-primary/5"
                >
                  {medicine.name.charAt(0)}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {medicine.category?.name}
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight">
                {medicine.name}
              </h1>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                {medicine.description}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-2" />
                <span className="font-bold text-yellow-700">{avg}</span>
                <span className="text-yellow-600/60 ml-1">({total})</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="text-sm font-medium text-green-600 flex items-center">
                <Shield className="h-4 w-4 mr-1" /> Quality Verified
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-primary">
                  ${medicine.selling_price}
                </span>
                <span className="text-muted-foreground font-medium">
                  / per unit
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {!isInCart && (
                  <div className="flex items-center border rounded-2xl p-1 bg-slate-50">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-bold text-lg">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity((q) => q + 1)}
                      disabled={quantity >= medicine.available_quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Button
                  size="lg"
                  onClick={handleCartAction}
                  disabled={cartLoading || medicine.available_quantity === 0}
                  className={`flex-1 h-14 text-lg rounded-2xl shadow-lg transition-all ${isInCart ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:scale-[1.02]"}`}
                >
                  {isInCart ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" /> View in Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                    </>
                  )}
                </Button>

                {/* <Button variant="outline" size="lg" className="h-14 w-14 rounded-2xl">
                  <Heart className={isFavorite ? "fill-red-500 text-red-500" : ""} />
                </Button> */}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-2xl flex items-center gap-3 bg-white">
                <Package className="text-blue-500" />
                <span className="text-sm font-semibold">Fast Delivery</span>
              </div>
              <div className="p-4 border rounded-2xl flex items-center gap-3 bg-white">
                <Clock className="text-purple-500" />
                <span className="text-sm font-semibold">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-24 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Customer Feedback</h2>
            {isAuthenticated && !hasUserReviewed && (
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                variant={showReviewForm ? "outline" : "default"}
              >
                {showReviewForm ? "Close Form" : "Write a Review"}
              </Button>
            )}
          </div>

          {showReviewForm && (
            <div className="max-w-2xl bg-white p-8 rounded-3xl border-2 border-primary/5 shadow-xl animate-in fade-in slide-in-from-top-4">
              <h3 className="text-xl font-bold mb-6">
                How was your experience?
              </h3>
              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setReviewRating(s)}>
                    <Star
                      className={`h-8 w-8 ${s <= reviewRating ? "fill-yellow-500 text-yellow-500" : "text-slate-200"}`}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Write your thoughts about this medicine..."
                className="mb-6 min-h-32 rounded-2xl"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
              <Button
                className="w-full h-12 rounded-xl"
                onClick={handleSubmitReview}
                disabled={submittingReview}
              >
                {submittingReview ? "Submitting..." : "Post Review"}{" "}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 bg-white p-8 rounded-3xl border h-fit sticky top-24">
              <div className="text-center space-y-2">
                <div className="text-6xl font-black">{avg}</div>
                <div className="flex justify-center">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-5 w-5 ${s <= Math.round(Number(avg)) ? "fill-yellow-500 text-yellow-500" : "text-slate-200"}`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  Based on {total} reviews
                </p>
              </div>
              <div className="mt-8 space-y-3">
                {[5, 4, 3, 2, 1].map((r) => (
                  <div key={r} className="flex items-center gap-4 text-sm">
                    <span className="w-4 font-bold">{r}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${(dist[r as keyof typeof dist] / total) * 100 || 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              {medicine.reviews?.map((r, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between mb-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${s <= r.rating ? "fill-yellow-500 text-yellow-500" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    {r.comment}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    {r.user?.name}
                  </div>
                </div>
              ))}
              {total === 0 && (
                <div className="text-center py-20 border-2 border-dashed rounded-3xl text-muted-foreground">
                  No reviews yet. Be the first to share your experience!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              Please sign in to your account to add products to your cart or
              leave reviews.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={() => router.push("/login")}
              className="h-12 text-lg"
            >
              Sign In
            </Button>
            <Button variant="ghost" onClick={() => setShowLoginDialog(false)}>
              Continue Browsing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
