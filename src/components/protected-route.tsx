"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/use-auth";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminRequired?: boolean;
}

export function ProtectedRoute({
  children,
  adminRequired = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isInitialized, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isInitialized) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (adminRequired && !isAdmin) {
        router.push("/user-dashboard");
        toast.error("Admin access required");
      }
    }
  }, [
    isInitialized,
    isAuthenticated,
    isAdmin,
    isLoading,
    router,
    adminRequired,
  ]);

  if (isLoading || !isInitialized) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  if (!isAuthenticated || (adminRequired && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
