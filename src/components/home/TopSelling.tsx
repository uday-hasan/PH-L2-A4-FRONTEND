import React from "react";
import { Star, ShoppingCart, TrendingUp } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  description: string;
  selling_price: number;
  available_quantity: number;
  category: {
    name: string;
  };
  reviews: {
    rating: number;
  }[];
}

interface TopSellingProps {
  medicines?: Medicine[];
}

const TopSelling: React.FC<TopSellingProps> = ({ medicines }) => {
  // Mock data for demonstration
  const mockMedicines: Medicine[] = medicines || [
    {
      id: "1",
      name: "Paracetamol 500mg",
      description: "Effective pain relief and fever reducer",
      selling_price: 5.99,
      available_quantity: 150,
      category: { name: "Pain Relief" },
      reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
    },
    {
      id: "2",
      name: "Vitamin C 1000mg",
      description: "Boost your immune system naturally",
      selling_price: 12.99,
      available_quantity: 200,
      category: { name: "Vitamins" },
      reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }],
    },
    {
      id: "3",
      name: "Amoxicillin 250mg",
      description: "Antibiotic for bacterial infections",
      selling_price: 8.99,
      available_quantity: 80,
      category: { name: "Antibiotics" },
      reviews: [{ rating: 4 }, { rating: 5 }, { rating: 4 }],
    },
    {
      id: "4",
      name: "Omeprazole 20mg",
      description: "Relief from acid reflux and heartburn",
      selling_price: 15.99,
      available_quantity: 120,
      category: { name: "Digestive Health" },
      reviews: [{ rating: 5 }, { rating: 5 }, { rating: 5 }],
    },
    {
      id: "5",
      name: "Ibuprofen 400mg",
      description: "Anti-inflammatory and pain reliever",
      selling_price: 7.49,
      available_quantity: 180,
      category: { name: "Pain Relief" },
      reviews: [{ rating: 4 }, { rating: 4 }, { rating: 5 }],
    },
    {
      id: "6",
      name: "Cetirizine 10mg",
      description: "Allergy relief medication",
      selling_price: 6.99,
      available_quantity: 160,
      category: { name: "Allergy" },
      reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
    },
  ];

  const calculateAverageRating = (reviews: { rating: number }[]) => {
    if (reviews.length === 0) return 0;
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMedicines.map((medicine) => (
            <div
              key={medicine.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl font-bold text-primary/20">
                  {medicine.name.charAt(0)}
                </div>
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                  Bestseller
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {medicine.category.name}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                  {medicine.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {medicine.description}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-sm">
                    {calculateAverageRating(medicine.reviews)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({medicine.reviews.length} reviews)
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
                  <button className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition-colors">
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <a
            href="/medicine"
            className="inline-block text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View All Products →
          </a>
        </div>
      </div>
    </section>
  );
};

export default TopSelling;
