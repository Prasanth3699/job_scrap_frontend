"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default function DashboardPage() {
  return (
    <ProtectedRoute adminRequired>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
