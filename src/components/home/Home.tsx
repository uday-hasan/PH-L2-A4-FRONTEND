import React from "react";
import HeroSection from "./HeroSection";
import TopSelling from "./TopSelling";
import ReviewsSection from "./ReviewsSection";
import CategoriesSection from "./CategoriesSection";
import NewsletterSection from "./NewsletterSection";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Categories Section */}
        <CategoriesSection />

        {/* Top Selling Products */}
        <TopSelling />

        {/* Customer Reviews */}
        <ReviewsSection />

        {/* Newsletter Subscription */}
        <NewsletterSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
