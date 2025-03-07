import { mlClient } from "../client/ml-client";
import { MLProcessingResult } from "../client/types";
import { Job } from "@/types";
import { monitoring } from "@/lib/core/monitoring";

export const mlApi = {
  processJobs: async (jobIds: number[]): Promise<MLProcessingResult> => {
    try {
      monitoring.trackEvent({
        name: "ml_process_jobs_started",
        properties: { job_count: jobIds.length },
      });

      const response = await mlClient.processJobs(jobIds);

      monitoring.trackEvent({
        name: "ml_process_jobs_completed",
        properties: { success: true },
      });

      return response.data;
    } catch (error) {
      monitoring.trackError({
        message: "Process jobs failed",
        error,
      });
      throw error;
    }
  },

  getRecommendations: async (jobId: number): Promise<Job[]> => {
    try {
      monitoring.trackEvent({
        name: "ml_get_recommendations_started",
        properties: { job_id: jobId },
      });

      const response = await mlClient.getJobRecommendations(jobId);

      monitoring.trackEvent({
        name: "ml_get_recommendations_completed",
        properties: { success: true },
      });

      return response.data;
    } catch (error) {
      monitoring.trackError({
        message: "Get recommendations failed",
        error,
      });
      throw error;
    }
  },
};
