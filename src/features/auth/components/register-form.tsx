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

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void> | void;
  onNavigateToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onNavigateToLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      userType: "CUSTOMER",
      status: "ACTIVE",
    },
  });

  const password = watch("password");

  // Password strength indicators
  const passwordChecks = {
    minLength: password?.length >= 8,
    hasUppercase: /[A-Z]/.test(password || ""),
    hasLowercase: /[a-z]/.test(password || ""),
    hasNumber: /[0-9]/.test(password || ""),
    hasSpecial: /[^A-Za-z0-9]/.test(password || ""),
  };

  const onFormSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Registration error:", error);
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
                type="text"
                autoComplete="name"
                {...register("name")}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.name
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-input focus:ring-ring"
                } bg-background text-foreground`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && (
              <div className="flex items-center space-x-1 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.name.message}</span>
              </div>
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
                autoComplete="email"
                {...register("email")}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.email
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-input focus:ring-ring"
                } bg-background text-foreground`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <div className="flex items-center space-x-1 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.email.message}</span>
              </div>
            )}
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative">
                <input
                  type="radio"
                  value="CUSTOMER"
                  {...register("userType")}
                  className="peer sr-only"
                />
                <div className="cursor-pointer border-2 border-border rounded-lg p-4 text-center transition-all peer-checked:border-primary peer-checked:bg-primary/5">
                  <p className="font-medium text-foreground">Customer</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Buy medicines
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
                <div className="cursor-pointer border-2 border-border rounded-lg p-4 text-center transition-all peer-checked:border-primary peer-checked:bg-primary/5">
                  <p className="font-medium text-foreground">Seller</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sell medicines
                  </p>
                </div>
              </label>
            </div>
            {errors.userType && (
              <div className="flex items-center space-x-1 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.userType.message}</span>
              </div>
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
                autoComplete="new-password"
                {...register("password")}
                className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.password
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-input focus:ring-ring"
                } bg-background text-foreground`}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Password Strength Indicators */}
            {password && (
              <div className="space-y-1 mt-2 p-3 bg-muted/30 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Password must contain:
                </p>
                <div className="space-y-1">
                  {[
                    {
                      check: passwordChecks.minLength,
                      label: "At least 8 characters",
                    },
                    {
                      check: passwordChecks.hasUppercase,
                      label: "One uppercase letter",
                    },
                    {
                      check: passwordChecks.hasLowercase,
                      label: "One lowercase letter",
                    },
                    { check: passwordChecks.hasNumber, label: "One number" },
                    {
                      check: passwordChecks.hasSpecial,
                      label: "One special character",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {item.check ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span
                        className={`text-xs ${
                          item.check
                            ? "text-green-600 dark:text-green-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.password && (
              <div className="flex items-center space-x-1 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.password.message}</span>
              </div>
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
                autoComplete="new-password"
                {...register("confirmPassword")}
                className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.confirmPassword
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-input focus:ring-ring"
                } bg-background text-foreground`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center space-x-1 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.confirmPassword.message}</span>
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="text-xs text-muted-foreground text-center">
            By creating an account, you agree to our{" "}
            <a
              href="/terms"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Privacy Policy
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
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
                <span>Creating account...</span>
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">Or</span>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
