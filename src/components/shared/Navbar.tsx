"use client";
import React, { useState } from "react";
import { Menu, X, ChevronDown, Heart, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { authApi } from "@/features/auth/api/auth.api";

const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout: clearStore } = useAuthStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearStore();
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      router.push("/login");
    }
  };
  const getMenuItems = () => {
    if (!user) return [];

    const items: { label: string; path: string }[] = [
      { label: "Profile", path: "/profile" },
    ];

    if (user.userType === "ADMIN" || user.userType === "SELLER") {
      items.unshift({ label: "Dashboard", path: "/dashboard" });
    }

    if (user.userType === "CUSTOMER") {
      items.unshift(
        { label: "My Orders", path: "/orders" },
        { label: "Cart", path: "/cart" },
      );
    }

    if (user.userType === "SELLER" || user.userType === "ADMIN") {
      items.push({ label: "Manage Products", path: "/manage-products" });
    }

    if (user.userType === "ADMIN") {
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

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {user?.name?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
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
                      <div className="px-4 py-2 border-b border-border mb-2">
                        <p className="text-xs text-muted-foreground">
                          Signed in as
                        </p>
                        <p className="text-sm font-semibold truncate">
                          {user?.email}
                        </p>
                      </div>

                      {getMenuItems().map((item, index) => (
                        <Link
                          key={index}
                          href={item.path}
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-popover-foreground hover:bg-accent transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}

                      <hr className="my-2 border-border" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-destructive hover:bg-destructive/10 transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent"
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
        <div className="md:hidden border-t border-border bg-card animate-in slide-in-from-top">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block py-2 font-medium">
              Home
            </Link>
            <Link href="/medicine" className="block py-2 font-medium">
              Medicine
            </Link>

            {!isAuthenticated ? (
              <div className="pt-4 space-y-3 border-t border-border">
                <Link
                  href="/login"
                  className="block w-full py-2 text-primary font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block w-full py-3 bg-primary text-primary-foreground text-center rounded-lg"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="pt-4 space-y-2 border-t border-border">
                {getMenuItems().map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-destructive font-bold"
                >
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
