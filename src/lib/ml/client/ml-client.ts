//lib/ml/client/ml-client.ts
import axios, { AxiosInstance } from "axios";
import { setupMLInterceptors } from "./interceptors";
import { MLResponse } from "./types";
import { handleMLError } from "../utils/error-handlers";
import { security } from "@/lib/core/security/security-service";
import { AnalysisResult } from "@/stores/analysis-store";

class MLApiClient {
  private static instance: MLApiClient;
  private readonly api: AxiosInstance;
  private readonly fileApi: AxiosInstance;

  private constructor() {
    const baseURL = process.env.NEXT_PUBLIC_ML_SERVICE_URL;
    if (!baseURL) {
      throw new Error("ML Service URL is not configured");
    }

    // JSON API client
    this.api = axios.create({
      baseURL,
      timeout: 90000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Multipart form data client
    this.fileApi = axios.create({
      baseURL,
      timeout: 90000,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Setup interceptors for both clients
    setupMLInterceptors(this.api);
    setupMLInterceptors(this.fileApi);
  }

  static getInstance(): MLApiClient {
    if (!MLApiClient.instance) {
      MLApiClient.instance = new MLApiClient();
    }
    return MLApiClient.instance;
  }

  async analyzeResume(
    resume: File,
    jobIds: number[]
  ): Promise<AnalysisResult[]> {
    try {
      const formData = new FormData();

      // Add resume file
      formData.append("resume_file", resume, resume.name);

      // Add job IDs as comma-separated string
      formData.append("job_ids", jobIds.join(","));

      // Add static preferences (you can modify these values as needed)
      const preferences = {
        preferred_job_types: ["Full Time"],
        preferred_locations: ["Remote"],
        salary_expectation: "500000 LPA",
        target_title: "Software Engineer",
        preferred_companies: ["Google", "Microsoft"],
        file_format: "pdf",
      };

      // Add preferences as JSON string
      formData.append("preferences", JSON.stringify(preferences));

      const response = await this.fileApi.post(
        "/matching/new-matchs",
        formData
      );

      // Debugging: Log the raw response
      console.log("Raw API response:", response);

      const responseData = response.data || response;

      if (!responseData) {
        throw new Error("Empty response from API");
      }

      // If the response is already an array, use it directly
      if (Array.isArray(responseData)) {
        return responseData;
      }

      // If the response has a 'data' property that's an array
      if (responseData.data && Array.isArray(responseData.data)) {
        return responseData.data;
      }

      throw new Error(
        `Unexpected API response format: ${JSON.stringify(responseData)}`
      );
    } catch (error) {
      console.error("Analysis error:", error);
      throw new Error("Failed to process analysis results");
    }
  }

  // async analyzeResume(
  //   resume: File,
  //   jobIds: number[]
  // ): Promise<MLResponse<any>> {
  //   try {
  //     const formData = new FormData();
  //     formData.append("resume_file", resume, resume.name);
  //     formData.append("job_ids", JSON.stringify(jobIds));

  //     // const response = await this.fileApi.post("/api/v1/ml/analyze", formData);
  //     const response = await this.fileApi.post(
  //       "/api/matching/new-matchs",
  //       formData
  //     );

  //     return response;
  //   } catch (error) {
  //     return handleMLError(error, "Resume analysis failed");
  //   }
  // }

  async processJobs(jobIds: number[]): Promise<MLResponse<any>> {
    try {
      if (!this.api) {
        throw new Error("API instance not initialized");
      }

      const token = security.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await this.api.post(
        "/process-jobs",
        { job_ids: jobIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      return handleMLError(error, "Process jobs failed");
    }
  }

  async getJobRecommendations(jobId: number): Promise<MLResponse<any>> {
    try {
      if (!this.api) {
        throw new Error("API instance not initialized");
      }

      return await this.api.get(`/recommendations/${jobId}`);
    } catch (error) {
      return handleMLError(error, "Get recommendations failed");
    }
  }
}

export const mlClient = MLApiClient.getInstance();
