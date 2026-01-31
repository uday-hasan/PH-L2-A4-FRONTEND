import React from "react";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import Link from "next/link";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Heart className="h-6 w-6" fill="currentColor" />
              </div>
              <span className="text-2xl font-bold text-primary">MediCare</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your trusted partner for quality medicines and healthcare
              products. We deliver health and wellness to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="/medicine"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Medicine
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/shipping"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="/returns"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a
                  href="/track-order"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  123 Healthcare St, Medical District, Dhaka 1000
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a
                  href="tel:+8801234567890"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  +880 123 456 7890
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a
                  href="mailto:support@medicare.com"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  support@medicare.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © {currentYear} MediCare. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="/sitemap"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Sitemap
              </a>
              <a
                href="/accessibility"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Accessibility
              </a>
              <a
                href="/cookies"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
