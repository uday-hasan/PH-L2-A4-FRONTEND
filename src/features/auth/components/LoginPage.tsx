"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Heart } from "lucide-react";
import { LoginFormData } from "../schemas/auth-schema";
import LoginForm from "./login-form";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: LoginFormData) => {
    // Mock API call - simulating network request
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Login attempt with:", data);

    // Mock successful response
    const mockResponse = {
      success: true,
      user: {
        id: "123",
        name: "John Doe",
        email: data.email,
        userType: "CUSTOMER",
      },
      token: "mock-jwt-token-123456789",
    };

    // Store token in localStorage (in real app, use httpOnly cookies)
    localStorage.setItem("authToken", mockResponse.token);
    localStorage.setItem("user", JSON.stringify(mockResponse.user));

    // Redirect based on user type
    if (mockResponse.user.userType === "ADMIN") {
      router.push("/admin/dashboard");
    } else if (mockResponse.user.userType === "SELLER") {
      router.push("/seller/dashboard");
    } else {
      router.push("/");
    }
  };

  const handleNavigateToRegister = () => {
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-primary text-primary-foreground p-3 rounded-xl">
                  <Heart className="h-10 w-10" fill="currentColor" />
                </div>
                <span className="text-4xl font-bold text-primary">
                  MediCare
                </span>
              </div>

              <h1 className="text-4xl font-bold text-foreground leading-tight">
                Welcome Back to <br />
                <span className="text-primary">MediCare</span>
              </h1>

              <p className="text-lg text-muted-foreground">
                Access your account to manage orders, track deliveries, and
                explore our wide range of authentic medicines and healthcare
                products.
              </p>

              <div className="space-y-4 pt-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg mt-1">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Secure Authentication
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your data is protected with encryption
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg mt-1">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Easy Order Management
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Track and manage all your orders in one place
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg mt-1">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Personalized Experience
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get recommendations based on your needs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div>
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <Heart className="h-8 w-8" fill="currentColor" />
                </div>
                <span className="text-3xl font-bold text-primary">
                  MediCare
                </span>
              </div>
            </div>

            <LoginForm
              onSubmit={handleLogin}
              onNavigateToRegister={handleNavigateToRegister}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
