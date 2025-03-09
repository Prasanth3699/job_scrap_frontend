import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { jobsApi } from "@/lib/api/jobs-api";
import { JobFilters } from "@/types";

export function useJobQueries(filters?: JobFilters) {
  // Jobs infinite query
  const jobsQuery = useInfiniteQuery({
    queryKey: ["jobs", filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return await jobsApi.getJobs({
        page: pageParam as number,
        ...filters,
      });
    },
    getNextPageParam: (lastPage: any) =>
      lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
  });

  // Job details query
  const useJobDetails = (jobId: string) => {
    return useQuery({
      queryKey: ["job", jobId],
      queryFn: () => jobsApi.getJobById(jobId),
      enabled: !!jobId,
    });
  };

  // Related jobs query
  const useRelatedJobs = (jobId: string) => {
    return useQuery({
      queryKey: ["relatedJobs", jobId],
      queryFn: () => jobsApi.getRelatedJobs(jobId),
      enabled: !!jobId,
    });
  };

  return {
    jobsQuery,
    useJobDetails,
    useRelatedJobs,
  };
}
