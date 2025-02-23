"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Bell } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 border-b bg-white dark:bg-black flex items-center justify-between px-6 shadow-md fixed top-0 left-0 w-full z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white whitespace-nowrap">
          Job Scraper
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-800">
          <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </Button>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          {user?.email && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
              {user.email}
            </span>
          )}
          <Button
            className="border border-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 px-4"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
