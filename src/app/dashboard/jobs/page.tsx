"use client";

import { JobsTable } from "@/components/dashboard/jobs-table";
import { useJobs } from "@/hooks/use-jobs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function JobsPage() {
  const { jobs = [], isLoading, triggerScrape, isScrapingLoading } = useJobs();

  // Ensure jobs is always an array
  const safeJobs = Array.isArray(jobs) ? jobs : [];

  // Define job categories dynamically
  const jobCategories = [
    { label: "Total Jobs", value: safeJobs.length },
    {
      label: "Internships",
      value: safeJobs.filter(
        (job: { job_type: string }) => job.job_type === "Internship"
      ).length,
    },
    {
      label: "Full Time",
      value: safeJobs.filter(
        (job: { job_type: string }) => job.job_type === "Full Time"
      ).length,
    },
  ];

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Jobs
            </h1>

            <Button
              className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
              onClick={() => triggerScrape()}
              disabled={isScrapingLoading}
            >
              {isScrapingLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Scraping...
                </>
              ) : (
                "Trigger Scrape"
              )}
            </Button>
          </div>

          {/* Job Statistics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {jobCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {category.label}
                </h3>
                <p className="text-3xl font-bold mt-2 text-blue-600 dark:text-blue-400">
                  {category.value}
                </p>
              </div>
            ))}
          </div>

          {/* Job Listings Table */}
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
          ) : (
            <JobsTable />
          )}
        </div>
      </div>
    </>
  );
}
