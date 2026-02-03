"use client";
import React, { useState } from "react";
import { Mail, Send } from "lucide-react";

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setEmail("");
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="bg-primary-foreground/10 p-4 rounded-full">
              <Mail className="h-12 w-12" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold">
            Stay Updated with Health Tips
          </h2>

          {/* Description */}
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Subscribe to our newsletter and get exclusive deals, health tips,
            and updates on new products delivered straight to your inbox.
          </p>

          {/* Newsletter Form */}
          <div className="max-w-md mx-auto pt-4">
            {!isSubmitted ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-foreground text-primary rounded-lg hover:bg-primary-foreground/90 transition-colors font-medium shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Subscribe</span>
                  <Send className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-4 py-3 text-center">
                <p className="font-medium">✓ Thank you for subscribing!</p>
                <p className="text-sm text-primary-foreground/80 mt-1">
                  Check your email for confirmation.
                </p>
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <p className="text-sm text-primary-foreground/60">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
