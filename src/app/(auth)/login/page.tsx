"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import { LoginForm } from "@/components/forms/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-gray-100 dark:bg-black px-4">
      {/* Spotlights Background */}
      <div className="absolute inset-0 overflow-hidden">
        <Spotlight />
      </div>

      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-800" />
          )}
        </button>
      </div>

      {/* Login Card Wrapper */}
      <div className="w-full max-w-md mx-auto z-10">
        <Card className="shadow-lg border border-gray-200 bg-white dark:bg-opacity-10 dark:backdrop-blur-lg dark:border-gray-800 transition-all">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
              Login to{" "}
              <span className="text-primary-600 dark:text-primary-400">
                Job Scraper
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-4 text-center text-sm text-gray-700 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary-600 dark:text-primary-400 hover:underline transition"
              >
                Register here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
