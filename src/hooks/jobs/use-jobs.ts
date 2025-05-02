import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi, JobsQueryParams } from "@/lib/api/jobs-api";
import { toast } from "sonner";
interface JobFilters {
  page?: number;
  limit?: number;
  searchQuery?: string;
  locations?: string[];
  jobTypes?: string[];
  experienceLevels?: string[];
  salaryRange?: {
    min: number;
    max: number;
  } | null;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  postedAt: string;
  url: string;
}

interface JobsResponse {
  jobs: Job[];
  total: number;
  hasMore: boolean;
}

// Convert FE filters to BE parameter keys
function mapToQueryParams(filters?: JobFilters): JobsQueryParams {
  return {
    page: filters?.page ?? 1,
    limit: filters?.limit ?? 10,
    search: filters?.searchQuery,
    locations: filters?.locations,
    jobTypes: filters?.jobTypes,
    experienceLevels: filters?.experienceLevels,
    salaryRange: filters?.salaryRange || null,
  };
}

export function useJobs(filters?: JobFilters) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: async (): Promise<JobsResponse> => {
      const response = await jobsApi.getJobs(mapToQueryParams(filters));
      return response.data;
    },
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
    jobs: data?.jobs ?? [],
    total: data?.total ?? 0,
    hasMore: data?.hasMore ?? false,
    isLoading,
    error,
    triggerScrape: triggerScrapeMutation.mutate,
    isScrapingLoading: triggerScrapeMutation.isPending,
  };
}

// Separate hook for job details
export function useJobDetails(jobId: string) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => jobsApi.getJobById(jobId), // No .data needed
    enabled: !!jobId,
  });
}

// Separate hook for related jobs
export function useRelatedJobs(jobId: string) {
  return useQuery({
    queryKey: ["relatedJobs", jobId],
    queryFn: () => jobsApi.getRelatedJobs(jobId),
    enabled: !!jobId,
  });
}
