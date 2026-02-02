"use client";
import React, { useEffect, useState } from "react";
import { authApi } from "@/features/auth/api/auth.api";
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Calendar,
  Package,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authApi.getMe();
        setUserData(response.data || response);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load profile data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) return <ProfileSkeleton />;

  const initials = userData?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-card border p-8 rounded-3xl shadow-sm">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-black text-primary border-4 border-background shadow-lg">
          {initials}
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {userData?.name}
            </h1>
            <Badge
              variant="secondary"
              className="px-3 py-1 text-xs font-bold uppercase tracking-wider"
            >
              {userData?.userType}
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
            <Mail className="h-4 w-4" /> {userData?.email}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="rounded-xl">
            <Settings className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statistics Cards */}
        <Card className="rounded-2xl border-2 border-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">
                  {userData?._count?.orders || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 border-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="text-2xl font-bold text-green-600 capitalize">
                  {userData?.status?.toLowerCase()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 border-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joined On</p>
                <p className="text-lg font-bold">
                  {new Date(userData?.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 py-2 border-b border-dashed">
              <span className="text-muted-foreground">Full Name</span>
              <span className="font-medium text-right">{userData?.name}</span>
            </div>
            <div className="grid grid-cols-2 py-2 border-b border-dashed">
              <span className="text-muted-foreground">Email Address</span>
              <span className="font-medium text-right">{userData?.email}</span>
            </div>
            <div className="grid grid-cols-2 py-2 border-b border-dashed">
              <span className="text-muted-foreground">User ID</span>
              <span className="font-mono text-[10px] text-right text-slate-400">
                {userData?.id}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Saved Addresses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userData?.address && userData.address.length > 0 ? (
              <div className="space-y-4">
                {userData.address.map((addr: any, index: number) => (
                  <div
                    key={index}
                    className="flex gap-3 p-4 bg-muted/50 rounded-2xl border"
                  >
                    <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <p className="text-sm">
                      {addr.address || "Default Address Provided"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No addresses saved yet.</p>
                <Button variant="link" size="sm">
                  Add New Address
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <Skeleton className="h-40 w-full rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </div>
  );
}
