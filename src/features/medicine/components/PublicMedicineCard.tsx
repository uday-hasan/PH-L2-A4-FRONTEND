import { Star, ShoppingCart } from "lucide-react";
import { Medicine } from "@/types/index";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PublicMedicineCardProps {
  medicine: Medicine;
}

export const PublicMedicineCard = ({ medicine }: PublicMedicineCardProps) => {
  const calculateAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(medicine.reviews || []);
  const router = useRouter();
  return (
    <Link href={`/medicine/${medicine.id}`}>
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
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
            {medicine.description || "High quality pharmaceutical product"}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium text-sm">{avgRating}</span>
            <span className="text-xs text-muted-foreground">
              ({medicine.reviews?.length || 0} reviews)
            </span>
          </div>

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
                router.push(`/medicine/${medicine.id}`);
              }}
              className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
