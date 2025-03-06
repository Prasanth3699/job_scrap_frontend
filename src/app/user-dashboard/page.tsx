"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { UserDashboard } from "@/components/dashboard/user-dashboard";

export default function UserDashboardPage() {
  return (
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  );
}
