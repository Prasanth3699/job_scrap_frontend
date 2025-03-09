import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "@/lib/api/jobs-api";
import { toast } from "sonner";
import type { JobFilters } from "@/types";

export function useJobs(filters?: JobFilters) {
  const queryClient = useQueryClient();

  // Regular query for jobs list
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const response = await jobsApi.getJobs(filters);
      return response.jobs || [];
    },
  });

  // Mutation for triggering job scraping
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
    jobs,
    isLoading,
    triggerScrape: triggerScrapeMutation.mutate,
    isScrapingLoading: triggerScrapeMutation.isPending,
  };
}

// Separate hook for job details
export function useJobDetails(jobId: string) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => jobsApi.getJobById(jobId),
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
// wroking code ---------------------------------------------------------
// import {
//   useQuery,
//   useMutation,
//   useQueryClient,
//   useInfiniteQuery,
// } from "@tanstack/react-query";
// import { jobsApi } from "@/lib/api/jobs-api";
// import { toast } from "sonner";
// import { JobFilters } from "@/types";

// export function useJobs(filters?: JobFilters) {
//   const queryClient = useQueryClient();

//   // Infinite query for paginated jobs
//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     isError,
//     error,
//   } = useInfiniteQuery({
//     queryKey: ["jobs", filters],
//     queryFn: async ({ pageParam = 1 }) => {
//       const response = await jobsApi.getJobs({
//         page: pageParam,
//         limit: 10,
//         ...filters,
//       });
//       return response.data;
//     },
//     getNextPageParam: (lastPage, pages) => {
//       return lastPage.hasMore ? pages.length + 1 : undefined;
//     },
//     initialPageParam: 1,
//   });

//   // Mutation for triggering job scraping
//   const triggerScrapeMutation = useMutation({
//     mutationFn: jobsApi.triggerScrape,
//     onSuccess: () => {
//       toast.success("Scraping started successfully");
//       queryClient.invalidateQueries({ queryKey: ["jobs"] });
//     },
//     onError: () => {
//       toast.error("Failed to start scraping");
//     },
//   });

//   // Get single job details
//   const useJobDetails = (jobId: string) => {
//     return useQuery({
//       queryKey: ["job", jobId],
//       queryFn: () => jobsApi.getJobById(jobId),
//       enabled: !!jobId,
//     });
//   };

//   // Get related jobs
//   const useRelatedJobs = (jobId: string) => {
//     return useQuery({
//       queryKey: ["relatedJobs", jobId],
//       queryFn: () => jobsApi.getRelatedJobs(jobId),
//       enabled: !!jobId,
//     });
//   };

//   return {
//     jobs: data?.pages.flatMap((page) => page.jobs) ?? [],
//     totalJobs: data?.pages[0]?.total ?? 0,
//     isLoading,
//     isError,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     triggerScrape: triggerScrapeMutation.mutate,
//     isScrapingLoading: triggerScrapeMutation.isPending,
//     useJobDetails,
//     useRelatedJobs,
//   };
// }
// ---------------------------------------------------------
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { jobsApi } from "@/lib/api/jobs-api";
// import { toast } from "sonner";

// export function useJobs() {
//   const queryClient = useQueryClient();

//   const { data: jobs, isLoading } = useQuery({
//     queryKey: ["jobs"],
//     queryFn: () => jobsApi.getJobs(),
//   });

//   const triggerScrapeMutation = useMutation({
//     mutationFn: jobsApi.triggerScrape,

//     onSuccess: () => {
//       toast.success("Scraping started successfully");
//       queryClient.invalidateQueries({ queryKey: ["jobs"] });
//     },
//     onError: () => {
//       toast.error("Failed to start scraping");
//     },
//   });

//   return {
//     jobs, // Return the entire jobs array
//     isLoading,
//     triggerScrape: triggerScrapeMutation.mutate,
//     isScrapingLoading: triggerScrapeMutation.isPending,
//   };
// }
