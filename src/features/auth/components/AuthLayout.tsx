"use client";
import React, { useState } from "react";
import { Heart } from "lucide-react";

import type { LoginFormData, RegisterFormData } from "../schemas/auth-schema";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

type AuthView = "login" | "register";

interface AuthLayoutProps {
  defaultView?: AuthView;
  onLoginSuccess?: (data: LoginFormData) => void;
  onRegisterSuccess?: (data: RegisterFormData) => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  defaultView = "login",
  onLoginSuccess,
  onRegisterSuccess,
}) => {
  const [currentView, setCurrentView] = useState<AuthView>(defaultView);

  const handleLogin = async (data: LoginFormData) => {
    console.log("Login data:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Call success callback
    if (onLoginSuccess) {
      onLoginSuccess(data);
    }

    // You would typically make an API call here:
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // const result = await response.json();
    // Handle response...
  };

  const handleRegister = async (data: RegisterFormData) => {
    console.log("Register data:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Call success callback
    if (onRegisterSuccess) {
      onRegisterSuccess(data);
    }

    // You would typically make an API call here:
    // const response = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // const result = await response.json();
    // Handle response...
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
                Your Health, <br />
                <span className="text-primary">Our Priority</span>
              </h1>

              <p className="text-lg text-muted-foreground">
                Access authentic medicines and healthcare products from trusted
                sellers. Join thousands of satisfied customers today.
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
                      Expert Support
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      24/7 customer service assistance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
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

            {/* Forms */}
            {currentView === "login" ? (
              <LoginForm
                onSubmit={handleLogin}
                onNavigateToRegister={() => setCurrentView("register")}
              />
            ) : (
              <RegisterForm
                onSubmit={handleRegister}
                onNavigateToLogin={() => setCurrentView("login")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
