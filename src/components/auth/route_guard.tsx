// components/auth/route-guard.tsx
"use client";

import { useAuth } from "@/hooks/auth/use-auth";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

export function RouteGuard({
  children,
  requireAuth = true,
  adminOnly = false,
}: RouteGuardProps) {
  const { isAuthenticated, isAdmin, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized) return;

    // Handle unauthenticated users
    if (requireAuth && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Handle already authenticated users trying to access auth pages
    if (!requireAuth && isAuthenticated) {
      router.replace(isAdmin ? "/dashboard" : "/landing-page");
      return;
    }

    // Handle non-admin users trying to access admin pages
    if (adminOnly && !isAdmin) {
      router.replace("/landing-page");
      return;
    }

    // Handle admin users on user-only pages (if needed)
    const isUserOnlyPage = pathname.startsWith("/landing-page");
    if (isUserOnlyPage && isAdmin) {
      router.replace("/dashboard");
      return;
    }
  }, [
    isInitialized,
    isAuthenticated,
    isAdmin,
    pathname,
    requireAuth,
    adminOnly,
    router,
  ]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
