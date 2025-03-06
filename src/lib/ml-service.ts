import { mlClient } from "./ml-client"; // Import the MLApiClient
import { Job } from "@/types";

export interface MLProcessingResult {
  success: boolean;
  data: {
    similarity_scores: number[][];
    processed_jobs: number[];
    recommendations: Record<number, Array<{ job_id: number; score: number }>>;
  };
}

export const mlApi = {
  processJobs: async (jobIds: number[]): Promise<MLProcessingResult> => {
    try {
      const response = await mlClient.processJobs(jobIds); // Use MLApiClient
      return response.data; // Ensure correct response format
    } catch (error) {
      console.error("Error processing jobs:", error);
      throw error;
    }
  },

  getRecommendations: async (jobId: number): Promise<Job[]> => {
    try {
      const response = await mlClient.getJobRecommendations(jobId); // Use MLApiClient
      return response.data; // Ensure correct response format
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      throw error;
    }
  },
};
