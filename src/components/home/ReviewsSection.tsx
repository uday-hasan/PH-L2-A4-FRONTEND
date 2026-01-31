import React from "react";
import { Star, Quote } from "lucide-react";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  medicineName: string;
  date: string;
  userAvatar?: string;
}

interface ReviewsSectionProps {
  reviews?: Review[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  // Mock data for demonstration
  const mockReviews: Review[] = reviews || [
    {
      id: "1",
      userName: "Sarah Johnson",
      rating: 5,
      comment:
        "Excellent service! The medicines arrived quickly and were exactly what I needed. The packaging was secure and professional.",
      medicineName: "Paracetamol 500mg",
      date: "2024-01-15",
    },
    {
      id: "2",
      userName: "Michael Chen",
      rating: 5,
      comment:
        "Very impressed with the quality and authenticity of the products. Customer support was helpful and responsive.",
      medicineName: "Vitamin C 1000mg",
      date: "2024-01-12",
    },
    {
      id: "3",
      userName: "Emily Davis",
      rating: 4,
      comment:
        "Great experience overall. Delivery was on time and the product quality is top-notch. Highly recommended!",
      medicineName: "Amoxicillin 250mg",
      date: "2024-01-10",
    },
    {
      id: "4",
      userName: "David Wilson",
      rating: 5,
      comment:
        "Best online pharmacy I have used. Genuine products at competitive prices with fast shipping.",
      medicineName: "Omeprazole 20mg",
      date: "2024-01-08",
    },
    {
      id: "5",
      userName: "Jessica Martinez",
      rating: 5,
      comment:
        "Trustworthy platform with excellent customer service. I appreciate the detailed product information provided.",
      medicineName: "Ibuprofen 400mg",
      date: "2024-01-05",
    },
    {
      id: "6",
      userName: "Robert Taylor",
      rating: 4,
      comment:
        "Reliable service and good quality medicines. The website is easy to navigate and checkout was smooth.",
      medicineName: "Cetirizine 10mg",
      date: "2024-01-03",
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Star className="h-6 w-6 text-primary fill-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              Customer Reviews
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what our customers are saying about their experience with
            MediCare
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {getInitials(review.userName)}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {review.userName}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(review.date)}
                  </p>
                </div>
              </div>

              {/* Rating */}
              {renderStars(review.rating)}

              {/* Comment */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {review.comment}
              </p>

              {/* Medicine Name */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Product:{" "}
                  <span className="text-primary font-medium">
                    {review.medicineName}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Reviews Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium">
            View All Reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
