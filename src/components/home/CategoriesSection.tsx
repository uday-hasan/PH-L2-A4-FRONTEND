import React from "react";
import {
  Pill,
  Heart,
  Activity,
  Thermometer,
  Baby,
  Eye,
  Leaf,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  productCount: number;
}

const CategoriesSection: React.FC = () => {
  const categories: Category[] = [
    {
      id: "1",
      name: "Pain Relief",
      icon: <Pill className="h-8 w-8" />,
      productCount: 156,
    },
    {
      id: "2",
      name: "Vitamins",
      icon: <Heart className="h-8 w-8" />,
      productCount: 243,
    },
    {
      id: "3",
      name: "Antibiotics",
      icon: <Activity className="h-8 w-8" />,
      productCount: 89,
    },
    {
      id: "4",
      name: "Cold & Flu",
      icon: <Thermometer className="h-8 w-8" />,
      productCount: 124,
    },
    {
      id: "5",
      name: "Baby Care",
      icon: <Baby className="h-8 w-8" />,
      productCount: 178,
    },
    {
      id: "6",
      name: "Eye Care",
      icon: <Eye className="h-8 w-8" />,
      productCount: 67,
    },
    {
      id: "7",
      name: "Herbal",
      icon: <Leaf className="h-8 w-8" />,
      productCount: 201,
    },
    {
      id: "8",
      name: "Medical Devices",
      icon: <Stethoscope className="h-8 w-8" />,
      productCount: 95,
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our wide range of healthcare products organized by categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/medicine?category=${category.id}`}
              className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                {/* Icon */}
                <div className="bg-primary/10 text-primary p-4 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {category.icon}
                </div>

                {/* Category Name */}
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>

                {/* Product Count */}
                <p className="text-sm text-muted-foreground">
                  {category.productCount} products
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
