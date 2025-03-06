"use client";

import { useQuery } from "@tanstack/react-query";
import { jobsApi } from "@/lib/api";
import { Job } from "@/types";
import { Cover } from "@/components/ui/cover";
import { JobCard } from "@/components/jobs/job-card";

export function UserDashboard() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobsApi.getJobs(),
    refetchInterval: 30000,
  }) as { data: Job[] | undefined; isLoading: boolean };

  return (
    <div className="w-full p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          <Cover>Available Jobs</Cover>
        </h2>
        <p className="text-muted-foreground mt-1">
          Browse and apply for available positions
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
