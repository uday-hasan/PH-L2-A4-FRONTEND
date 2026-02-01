"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { RegisterFormData, registerSchema } from "../schemas/auth-schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth.api";
import { AxiosError } from "axios";
import { toast } from "sonner";

const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Omit<RegisterFormData, "status">>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      userType: "CUSTOMER",
    },
  });

  const password = watch("password");

  const passwordChecks = {
    minLength: password?.length >= 8,
    hasUppercase: /[A-Z]/.test(password || ""),
    hasLowercase: /[a-z]/.test(password || ""),
    hasNumber: /[0-9]/.test(password || ""),
    hasSpecial: /[^A-Za-z0-9]/.test(password || ""),
  };

  const onFormSubmit = async (data: Omit<RegisterFormData, "status">) => {
    setIsLoading(true);
    setServerError(null);
    const toastId = toast.loading("Creating your account...");

    try {
      await authApi.register({ ...data, status: "ACTIVE" });

      toast.success("Registration successful! Please login.", { id: toastId });

      router.push("/login");
    } catch (err: any) {
      let message = "Registration failed. Please try again.";

      if (err instanceof AxiosError) {
        message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data ||
          message;
      }

      setServerError(message);
      toast.error(message, { id: toastId });
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Create Account
          </h2>
          <p className="text-muted-foreground">Join MediCare today</p>
        </div>

        {serverError && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center space-x-2 text-destructive text-sm animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="name"
                {...register("name")}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-background text-foreground ${
                  errors.name
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-input focus:ring-ring"
                }`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="text-destructive text-xs flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" /> {errors.name.message}
              </p>
            )}
          </div>

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
                placeholder="name@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-xs flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" /> {errors.email.message}
              </p>
            )}
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              I want to...
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative">
                <input
                  type="radio"
                  value="CUSTOMER"
                  {...register("userType")}
                  className="peer sr-only"
                />
                <div className="cursor-pointer border-2 border-border rounded-lg p-3 text-center transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50">
                  <p className="font-medium text-sm text-foreground">
                    Buy Medicine
                  </p>
                </div>
              </label>
              <label className="relative">
                <input
                  type="radio"
                  value="SELLER"
                  {...register("userType")}
                  className="peer sr-only"
                />
                <div className="cursor-pointer border-2 border-border rounded-lg p-3 text-center transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50">
                  <p className="font-medium text-sm text-foreground">
                    Sell Medicine
                  </p>
                </div>
              </label>
            </div>
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
                placeholder="••••••••"
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

            {/* Password Strength UI */}
            {password && (
              <div className="mt-3 p-3 bg-muted/40 rounded-lg space-y-2 border border-border">
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  Requirements
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { check: passwordChecks.minLength, label: "8+ chars" },
                    { check: passwordChecks.hasUppercase, label: "Uppercase" },
                    { check: passwordChecks.hasLowercase, label: "Lowercase" },
                    { check: passwordChecks.hasNumber, label: "Number" },
                    { check: passwordChecks.hasSpecial, label: "Special" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      {item.check ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-muted-foreground/50" />
                      )}
                      <span
                        className={`text-[11px] ${item.check ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {errors.password && (
              <p className="text-destructive text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-foreground"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-background text-foreground ${
                  errors.confirmPassword
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-input focus:ring-ring"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium shadow-sm disabled:opacity-50 active:scale-[0.98]"
          >
            {isLoading ? "Creating account..." : "Create Account"}
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
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
