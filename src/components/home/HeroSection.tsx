import React from "react";
import { ArrowRight, Shield, Truck, HeadphonesIcon } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-linear-to-br from-primary/5 to-primary/10 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Your Health, Our <span className="text-primary">Priority</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Get authentic medicines delivered to your doorstep. Quality
              healthcare products at affordable prices, backed by expert
              pharmacists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-md flex items-center justify-center space-x-2">
                <span>Shop Now</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium">
                Learn More
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    100% Authentic
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Verified products
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    Fast Delivery
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Within 24-48 hours
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                  <HeadphonesIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    24/7 Support
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Expert assistance
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Placeholder */}
          <div className="relative">
            <div className="aspect-square bg-linear-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-48 h-48 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-24 w-24 text-primary" />
                </div>
                <p className="text-muted-foreground font-medium">
                  Trusted Healthcare Platform
                </p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
