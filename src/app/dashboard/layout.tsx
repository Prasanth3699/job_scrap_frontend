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
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      <Navbar />
      <SidebarProvider>
        <div className="flex flex-1">
          <DesktopSidebar />
          <MobileSidebar />
          <main className="flex-1 md:ml-[70px] pt-16  overflow-y-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
