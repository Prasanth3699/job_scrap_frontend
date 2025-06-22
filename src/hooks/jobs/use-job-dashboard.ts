// src/hooks/use-job-dashboard.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService } from "@/lib/api/";
import { toast } from "sonner";

export function useJobsForDashboard() {
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobsService.getJobsDashboard(), // Fetch jobs for dashboard
  });

  const triggerScrapeMutation = useMutation({
    mutationFn: jobsService.triggerScrape,

    onSuccess: () => {
      toast.success("Scraping started successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => {
      toast.error("Failed to start scraping");
    },
  });

  return {
    jobs, // Return the entire jobs array
    isLoading,
    triggerScrape: triggerScrapeMutation.mutate,
    isScrapingLoading: triggerScrapeMutation.isPending,
  };
}
