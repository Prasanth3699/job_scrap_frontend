// components/protected-route.tsx
"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/use-auth";

interface ProtectedRouteProps {
  children: ReactNode;
  adminRequired?: boolean;
}

export function ProtectedRoute({
  children,
  adminRequired = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (adminRequired && !isAdmin) {
      router.replace("/landing-page");
    }
  }, [isAuthenticated, isAdmin, adminRequired, isInitialized, router]);

  // Don't render anything until auth is initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render until we're sure this user should see this content
  if (!isAuthenticated || (adminRequired && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
