"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { LoginFormData, loginSchema } from "../schemas/auth-schema";
import Link from "next/link";

import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth.api";
import { AxiosError } from "axios";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onFormSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authApi.login(data);

      const userData = response?.data;
      if (userData.success) {
        setAuth(userData);

        router.push("/");
        router.refresh();
      } else {
        setError(
          userData.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err: any) {
      if (err instanceof AxiosError) {
        const serverMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data;

        setError(
          serverMessage || "Login failed. Please check your credentials.",
        );
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h2>
          <p className="text-muted-foreground">
            Sign in to your MediCare account
          </p>
        </div>

        {/* Global Error Message Display */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center space-x-2 text-destructive text-sm animate-in fade-in zoom-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-background text-foreground ${
                  errors.email
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-input focus:ring-ring"
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-background text-foreground ${
                  errors.password
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-input focus:ring-ring"
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Authenticating...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">Or</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {"Don't"} have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
