import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "@/lib/api/jobs-api";
import { toast } from "sonner";

export function useJobs() {
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobsApi.getJobs(),
  });

  const triggerScrapeMutation = useMutation({
    mutationFn: jobsApi.triggerScrape,

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
