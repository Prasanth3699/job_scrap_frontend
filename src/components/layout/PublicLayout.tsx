"use client";

import { forwardRef } from "react";
import Navbar from "@/components/landing/Navbar";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = forwardRef<HTMLDivElement, PublicLayoutProps>(
  function PublicLayout({ children }, ref) {
    return (
      <div
        ref={ref}
        className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300"
      >
        <Navbar />
        <main className="pt-24">{children}</main>
      </div>
    );
  }
);

export default PublicLayout;
