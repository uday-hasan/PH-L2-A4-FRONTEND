"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Heart } from "lucide-react";
import { RegisterFormData } from "../schemas/auth-schema";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: RegisterFormData) => {
    // Mock API call - simulating network request
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Registration attempt with:", {
      name: data.name,
      email: data.email,
      userType: data.userType,
      status: data.status,
      // password is intentionally not logged for security
    });

    // Mock successful response
    const mockResponse = {
      success: true,
      message:
        "Registration successful! Please check your email for verification.",
      user: {
        id: "new-user-123",
        name: data.name,
        email: data.email,
        userType: data.userType,
        status: data.status,
      },
    };

    // Show success message (in real app, use toast notification)
    alert(mockResponse.message);

    // Redirect to login page
    router.push("/login");
  };

  const handleNavigateToLogin = () => {
    router.push("/login");
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
                Join MediCare <br />
                <span className="text-primary">Community</span>
              </h1>

              <p className="text-lg text-muted-foreground">
                Create your account to access authentic medicines and healthcare
                products from trusted sellers. Join thousands of satisfied
                customers today.
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
                      100% Authentic Products
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      All medicines are verified and genuine
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
                      Fast & Secure Delivery
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get your orders within 24-48 hours
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
                      24/7 Expert Support
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Professional assistance whenever you need
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
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

            <RegisterForm
              onSubmit={handleRegister}
              onNavigateToLogin={handleNavigateToLogin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
