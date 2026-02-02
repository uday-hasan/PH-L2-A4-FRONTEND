"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { authApi } from "@/features/auth/api/auth.api";
import { Menu, X, LogOut, Heart, ChevronRight, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  BarChart3,
  Home,
} from "lucide-react";

export const NAV_ITEMS = {
  ADMIN: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    {
      label: "Manage Categories",
      href: "/dashboard/categories",
      icon: Box,
    },
    { label: "Manage Users", href: "/dashboard/users", icon: Users },
    { label: "All Medicines", href: "/dashboard/medicine", icon: Package },
    { label: "System Logs", href: "/dashboard/logs", icon: BarChart3 },
  ],
  SELLER: [
    { label: "Store Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Medicines", href: "/dashboard/medicine", icon: Package },

    { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  ],
};

const NavContent = ({
  setIsMobileOpen,
}: {
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout: clearStore } = useAuthStore();

  const role = user?.userType as "ADMIN" | "SELLER";
  const menuItems = NAV_ITEMS[role] || [];

  const handleLogout = async () => {
    try {
      await authApi.logout();
      clearStore();
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-primary p-2 rounded-lg">
          <Heart
            className="h-5 w-5 text-primary-foreground"
            fill="currentColor"
          />
        </div>
        <span className="text-xl font-bold text-primary">MediCare</span>
      </div>

      {/* Role Badge */}
      <div className="px-6 mb-6">
        <div className="bg-accent px-3 py-1 rounded-full w-fit">
          <p className="text-[10px] uppercase font-bold text-accent-foreground tracking-wider">
            {role} Portal
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        <Link
          href="/"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors mb-4"
        >
          <Home className="h-5 w-5" />
          <span className="font-medium">Back to Site</span>
        </Link>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive
                      ? ""
                      : "text-muted-foreground group-hover:text-primary",
                  )}
                />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-border bg-accent/30">
        <div className="flex items-center space-x-3 px-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.name?.[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button (Visible only on small screens) */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-primary text-primary-foreground rounded-md shadow-lg"
        >
          {isMobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <NavContent setIsMobileOpen={setIsMobileOpen} />
      </aside>
    </>
  );
};

export default Sidebar;
