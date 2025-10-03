"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, LogIn } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      // Auto sign in after successful registration
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError(
          "Registration successful but sign in failed. Please try logging in."
        );
        setIsLogin(true);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setRole("buyer");
    setError("");
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Auctra
            </h1>
          </Link>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {isLogin
              ? "Sign in to your auction account"
              : "Join our auction community"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={isLogin ? handleSignIn : handleRegister}
            className="space-y-6"
          >
            {/* Username field (only for registration) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    placeholder="Enter your username"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Role selection (only for registration) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-colors ${
                      role === "buyer"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 hover:border-slate-300 dark:border-slate-600 dark:hover:border-slate-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="buyer"
                      checked={role === "buyer"}
                      onChange={(e) =>
                        setRole(e.target.value as "buyer" | "seller")
                      }
                      className="sr-only"
                    />
                    <UserPlus className="mx-auto mb-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      Buyer
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Bid on auctions
                    </div>
                  </label>

                  <label
                    className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-colors ${
                      role === "seller"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 hover:border-slate-300 dark:border-slate-600 dark:hover:border-slate-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="seller"
                      checked={role === "seller"}
                      onChange={(e) =>
                        setRole(e.target.value as "buyer" | "seller")
                      }
                      className="sr-only"
                    />
                    <User className="mx-auto mb-2 h-6 w-6 text-green-600 dark:text-green-400" />
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      Seller
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Create auctions
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <LogIn className="h-5 w-5" />
                      Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      Create Account
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              type="button"
              onClick={switchMode}
              className="mt-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>By continuing, you agree to our</p>
          <div className="flex justify-center gap-4 mt-1">
            <Link
              href="/terms"
              className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
