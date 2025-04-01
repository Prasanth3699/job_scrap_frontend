// app/dashboard/analytics/page.tsx
"use client";

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserEngagementCard } from "@/components/ml/analytics/UserEngagementCard";
import { SkillDemandCard } from "@/components/ml/analytics/SkillDemandCard";
import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/header";
import { security } from "@/lib/core/security/security-service";
import { redirect } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/spinner";
import { ConversionFunnel } from "@/components/ml/analytics/ConversionFunnel";
import { SalaryTrendsCard } from "@/components/ml/analytics/SalaryTrendsCard";
import { UserPreferencesChart } from "@/components/ml/analytics/UserPreferencesChart";
import { SalaryComparisonTool } from "@/components/ml/analytics/SalaryComparisonTool";
import { JobAvailabilityChart } from "@/components/ml/analytics/JobAvailabilityChart";

export default function AnalyticsDashboard() {
  // Server-side security check
  if (!security.isAuthenticated()) {
    redirect("/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Analytics Dashboard"
        text="Comprehensive insights with enterprise-grade security"
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="user" disabled={!security.hasPermission("admin")}>
            User
          </TabsTrigger>
          <TabsTrigger
            value="market"
            disabled={!security.hasPermission("admin")}
          >
            Market
          </TabsTrigger>
          <TabsTrigger
            value="salary"
            disabled={!security.hasPermission("admin")}
          >
            Salary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<LoadingSpinner />}>
              <UserEngagementCard />
              <SkillDemandCard />
            </Suspense>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Suspense fallback={<LoadingSpinner />}>
              <ConversionFunnel />
              <SalaryTrendsCard />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="user" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Suspense fallback={<LoadingSpinner />}>
              <UserEngagementCard />
              <UserPreferencesChart />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Suspense fallback={<LoadingSpinner />}>
              <SkillDemandCard />
              <JobAvailabilityChart />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="salary" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Suspense fallback={<LoadingSpinner />}>
              <SalaryTrendsCard />
              <SalaryComparisonTool />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
