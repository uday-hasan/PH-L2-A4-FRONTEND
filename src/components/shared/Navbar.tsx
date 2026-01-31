"use client";
import React, { useState } from "react";
import { Menu, X, User, ChevronDown, Heart } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  isLoggedIn?: boolean;
  userRole?: "customer" | "seller" | "admin";
  userName?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn = false,
  userRole = "customer",
  userName = "User",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getMenuItems = () => {
    const items: { label: string; path: string }[] = [
      { label: "Reviews", path: "/reviews" },
      { label: "Profile", path: "/profile" },
    ];

    if (userRole === "admin" || userRole === "seller") {
      items.unshift({ label: "Dashboard", path: "/dashboard" });
    }
    if (userRole === "customer") {
      items.unshift(
        { label: "My Orders", path: "/orders" },
        { label: "Cart", path: "/cart" },
      );
    }
    if (userRole === "seller") {
      items.push({ label: "My Products", path: "/my-products" });
    }
    if (userRole === "seller" || userRole === "admin") {
      items.push({ label: "Manage Products", path: "/manage-products" });
    }
    if (userRole === "admin") {
      items.push({ label: "Manage Users", path: "/manage-users" });
    }

    return items;
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Heart className="h-6 w-6" fill="currentColor" />
              </div>
              <span className="text-2xl font-bold text-primary">MediCare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/medicine"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Medicine
            </Link>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <button className="px-4 py-2 text-primary hover:text-primary/80 transition-colors font-medium">
                  Login
                </button>
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm">
                  Register
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{userName}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg py-2 z-20">
                      {getMenuItems().map((item, index) => (
                        <Link
                          key={index}
                          href={item.path}
                          className="block px-4 py-2 text-popover-foreground hover:bg-accent transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <hr className="my-2 border-border" />
                      <button className="w-full text-left px-4 py-2 text-destructive hover:bg-accent transition-colors">
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/medicine"
              className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              Medicine
            </Link>

            {!isLoggedIn ? (
              <div className="pt-4 space-y-3 border-t border-border">
                <button className="w-full py-2 text-primary hover:text-primary/80 transition-colors font-medium text-left">
                  Login
                </button>
                <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                  Register
                </button>
              </div>
            ) : (
              <div className="pt-4 space-y-2 border-t border-border">
                {getMenuItems().map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className="block py-2 text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <button className="w-full text-left py-2 text-destructive hover:text-destructive/80 transition-colors">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
