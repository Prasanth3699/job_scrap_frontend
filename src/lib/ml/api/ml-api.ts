import { mlClient } from "../client/ml-client";
import { MLProcessingResult } from "../client/types";
import { Job } from "@/types";
import { monitoring } from "@/lib/core/monitoring";

export const mlApi = {
  analyzeResume: async (resume: File, jobIds: number[]): Promise<any> => {
    try {
      monitoring.trackEvent({
        name: "ml_resume_analysis_started",
        properties: {
          job_count: jobIds.length,
          resume_name: resume.name,
        },
      });

      const response = await mlClient.analyzeResume(resume, jobIds);

      monitoring.trackEvent({
        name: "ml_resume_analysis_completed",
        properties: {
          success: true,
          job_count: jobIds.length,
        },
      });

      return response;
    } catch (error) {
      monitoring.trackError({
        message: "Resume analysis failed",
        error: error instanceof Error ? error : new Error("Unknown error"),
        metadata: {
          jobIds,
          resumeName: resume.name,
        },
      });
      throw error;
    }
  },

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
        error: error instanceof Error ? error : new Error("Unknown error"),
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
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
      throw error;
    }
  },
};
