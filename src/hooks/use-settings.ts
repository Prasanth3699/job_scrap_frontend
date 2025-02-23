import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api";
import { toast } from "sonner";
import type { EmailConfig, SchedulerConfig } from "@/types";
import type { ApiError, Settings } from "@/types";

export function useSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await settingsApi.getSettings();
      // Type assertion after checking the structure
      if (
        response &&
        "email_config" in response &&
        "scheduler_config" in response
      ) {
        return response as unknown as Settings;
      }
      throw new Error("Invalid settings data structure");
    },
  });

  const updateEmailMutation = useMutation<void, ApiError, EmailConfig>({
    mutationFn: async (data: EmailConfig) => {
      await settingsApi.updateEmailConfig(data);
      // Return void explicitly
      return;
    },
    onSuccess: () => {
      toast.success("Email configuration updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.detail || "Failed to update email configuration"
      );
    },
  });

  const updateCronMutation = useMutation<void, ApiError, SchedulerConfig>({
    mutationFn: async (data: SchedulerConfig) => {
      await settingsApi.updateCronConfig(data);
      // Return void explicitly
      return;
    },
    onSuccess: () => {
      toast.success("Schedule configuration updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.detail ||
          "Failed to update schedule configuration"
      );
    },
  });

  return {
    emailConfig: settings?.email_config,
    schedulerConfig: settings?.scheduler_config,
    isLoading,
    updateEmailConfig: (data: EmailConfig) => updateEmailMutation.mutate(data),
    updateSchedulerConfig: (data: SchedulerConfig) =>
      updateCronMutation.mutate(data),
    isUpdating: updateEmailMutation.isPending || updateCronMutation.isPending,
  };
}
