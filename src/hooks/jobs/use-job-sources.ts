import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobSourceService } from "@/lib/api";
import { toast } from "sonner";
import type {
  JobSource,
  JobSourceFormData,
  ApiError,
  JobSourceUpdateData,
  ScrapingConfig,
} from "@/types";

export function useJobSources() {
  const queryClient = useQueryClient();

  const { data: sources = [], isLoading } = useQuery<JobSource[]>({
    queryKey: ["jobSources"],
    queryFn: jobSourceService.getSources,
    // Add staleTime to prevent too frequent refetches
    staleTime: 10000 * 60, // 10 minute
  });

  const createMutation = useMutation<JobSource, ApiError, JobSourceFormData>({
    mutationFn: jobSourceService.createSource,
    onSuccess: () => {
      toast.success("Job source created successfully");
      queryClient.invalidateQueries({ queryKey: ["jobSources"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.detail || "Failed to create job source"
      );
    },
  });

  const updateMutation = useMutation<
    JobSource,
    ApiError,
    { id: number; data: JobSourceUpdateData }
  >({
    mutationFn: async ({ id, data }) => {
      // Create a properly typed update object
      const updateData: JobSourceUpdateData = {
        ...data,
        scraping_config: data.scraping_config && {
          ...(data.scraping_config as ScrapingConfig),
        },
      };

      // Type-safe way to remove undefined values
      const cleanedData = Object.entries(updateData).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) {
            acc[key as keyof JobSourceUpdateData] = value;
          }
          return acc;
        },
        {} as JobSourceUpdateData
      );

      return await jobSourceService.updateSource(id, cleanedData);
    },
    onSuccess: () => {
      toast.success("Job source updated successfully");
      queryClient.invalidateQueries({ queryKey: ["jobSources"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.detail || "Failed to update job source"
      );
    },
  });

  const deleteMutation = useMutation<void, ApiError, number>({
    mutationFn: async (id) => {
      const response = await jobSourceService.deleteSource(id);
      return response;
    },
    onSuccess: () => {
      toast.success("Job source deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["jobSources"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.detail || "Failed to delete job source"
      );
    },
  });

  const scrapeMutation = useMutation<void, ApiError, number | undefined>({
    mutationFn: async (sourceId) => {
      const response = await jobSourceService.triggerScrape(sourceId);
      return response;
    },
    onSuccess: () => {
      toast.success("Scraping job triggered successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Failed to trigger scraping");
    },
  });

  return {
    sources,
    isLoading,
    createSource: createMutation.mutate,
    updateSource: (id: number, data: Partial<JobSourceFormData>) =>
      updateMutation.mutate({ id, data }),
    deleteSource: deleteMutation.mutate,
    triggerScrape: scrapeMutation.mutate,
    isUpdating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      scrapeMutation.isPending,
  };
}
