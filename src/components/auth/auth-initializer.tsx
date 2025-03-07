"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/auth/use-auth";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initialize, isInitialized } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
