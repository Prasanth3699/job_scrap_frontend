"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/use-auth";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated) {
        if (isAdmin) {
          router.push("/dashboard");
        } else {
          router.push("/user-dashboard");
        }
      } else {
        router.push("/login");
      }
    }
  }, [isInitialized, isAuthenticated, isAdmin, router]);

  return null;
}
