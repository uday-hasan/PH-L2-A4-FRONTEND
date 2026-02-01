"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { authApi } from "@/features/auth/api/auth.api";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setAuth, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authApi.getMe();
        setAuth(user);
      } catch {
        logout();
      }
    };
    initAuth();
  }, [setAuth, logout]);

  return <>{children}</>;
};
