import { mlApi } from "../gateway";
import { ML_ENDPOINTS } from "../endpoints";
import { monitoring } from "@/lib/core/monitoring";
import { Job } from "@/types";
import { MLProcessingResult } from "@/types";
import { MatchResponse, MatchResponseSchema } from "@/stores/analysis-schema";

/**
 * Machine Learning service for job matching and analysis
 */
export const mlService = {
  /**
   * Analyze a resume against selected jobs
   */
  analyzeResume: async (
    resume: File,
    jobIds: number[]
  ): Promise<MatchResponse> => {
    try {
      monitoring.trackEvent({
        name: "ml_resume_analysis_started",
        properties: {
          job_count: jobIds.length,
          resume_name: resume.name,
        },
      });

      // Input validation
      if (!(resume instanceof File)) {
        throw new Error("Invalid resume file provided.");
      }
      if (!Array.isArray(jobIds) || jobIds.length === 0) {
        throw new Error("At least one job ID is required.");
      }
      if (jobIds.some((id) => typeof id !== "number" || isNaN(id))) {
        throw new Error("Job IDs must be valid numbers.");
      }

      // Create form data
      const formData = new FormData();
      formData.append("resume_file", resume, resume.name);
      formData.append("job_ids", jobIds.join(","));

      // Add user preferences
      const preferences = {
        preferred_job_types: ["Full Time", "Contract"],
        preferred_locations: ["Remote", "New York, NY"],
        salary_expectation: "competitive",
        target_title: "Software Engineer",
        preferred_companies: ["Google", "Microsoft", "Startup"],
      };
      formData.append("preferences", JSON.stringify(preferences));

      // Make API call
      const response = await mlApi.post(ML_ENDPOINTS.NEW_MATCHES, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Validate response with schema
      const validationResult = MatchResponseSchema.safeParse(response);
      if (!validationResult.success) {
        const issues = validationResult.error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join("; ");
        throw new Error(`Invalid API response format: ${issues}`);
      }

      monitoring.trackEvent({
        name: "ml_resume_analysis_completed",
        properties: {
          success: true,
          job_count: jobIds.length,
        },
      });

      return validationResult.data;
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

  /**
   * Process a batch of jobs for similarity analysis
   */
  processJobs: async (jobIds: number[]): Promise<MLProcessingResult> => {
    try {
      monitoring.trackEvent({
        name: "ml_process_jobs_started",
        properties: { job_count: jobIds.length },
      });

      const response = await mlApi.post(ML_ENDPOINTS.PROCESS_JOBS, {
        job_ids: jobIds,
      });

      monitoring.trackEvent({
        name: "ml_process_jobs_completed",
        properties: { success: true },
      });

      return response;
    } catch (error) {
      monitoring.trackError({
        message: "Process jobs failed",
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
      throw error;
    }
  },

  /**
   * Get job recommendations based on a specific job
   */
  getRecommendations: async (jobId: number): Promise<Job[]> => {
    try {
      monitoring.trackEvent({
        name: "ml_get_recommendations_started",
        properties: { job_id: jobId },
      });

      const response = await mlApi.get(ML_ENDPOINTS.JOB_RECOMMENDATIONS(jobId));

      monitoring.trackEvent({
        name: "ml_get_recommendations_completed",
        properties: { success: true },
      });

      return response;
    } catch (error) {
      monitoring.trackError({
        message: "Get recommendations failed",
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
      throw error;
    }
  },
};
