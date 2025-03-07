import axios, { AxiosInstance } from "axios";
import { setupMLInterceptors } from "./interceptors";
import { MLResponse } from "./types";
import { handleMLError } from "../utils/error-handlers";
import { security } from "@/lib/core/security/security-service";

class MLApiClient {
  private static instance: MLApiClient;
  private readonly api: AxiosInstance;

  private constructor() {
    const baseURL = process.env.NEXT_PUBLIC_ML_SERVICE_URL;
    if (!baseURL) {
      throw new Error("ML Service URL is not configured");
    }

    this.api = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    setupMLInterceptors(this.api);
  }

  static getInstance(): MLApiClient {
    if (!MLApiClient.instance) {
      MLApiClient.instance = new MLApiClient();
    }
    return MLApiClient.instance;
  }

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

  // async processJobs(jobIds: number[]): Promise<MLResponse<any>> {
  //   try {
  //     if (!this.api) {
  //       throw new Error("API instance not initialized");
  //     }

  //     return await this.api.post("/process-jobs", {
  //       job_ids: jobIds,
  //     });
  //   } catch (error) {
  //     return handleMLError(error, "Process jobs failed");
  //   }
  // }

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
