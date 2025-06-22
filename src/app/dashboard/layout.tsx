"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/use-auth";
import { Navbar } from "@/components/layout/navbar";
import {
  SidebarProvider,
  DesktopSidebar,
  MobileSidebar,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading, isInitialized } = useAuth();

  useEffect(() => {
    // Only run the redirect check when auth is fully initialized and not loading
    if (isInitialized && !isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // If authenticated but not admin, redirect to landing page
      if (!isAdmin) {
        router.push("/landing-page");
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, isInitialized, router]);

  // Show loading state while authentication is being initialized
  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render anything until we're sure we should show this layout
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      <Navbar />
      <SidebarProvider>
        <div className="flex flex-1">
          <DesktopSidebar />
          <MobileSidebar />
          <main className="flex-1 md:ml-[70px] pt-16 overflow-y-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
