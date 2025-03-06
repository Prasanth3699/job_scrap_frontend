// lib/ml-client.ts
import axios, { AxiosInstance } from "axios";
import { security } from "@/lib/security";
import { monitoring } from "@/lib/monitoring";

interface MLResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class MLApiClient {
  private static instance: MLApiClient;
  private readonly api: AxiosInstance; // Make it readonly

  private constructor() {
    // Check if the URL is available
    const baseURL = process.env.NEXT_PUBLIC_ML_SERVICE_URL;
    if (!baseURL) {
      throw new Error("ML Service URL is not configured");
    }

    console.log("Initializing ML API Client with URL:", baseURL);

    // Create the axios instance
    this.api = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  static getInstance(): MLApiClient {
    if (!MLApiClient.instance) {
      MLApiClient.instance = new MLApiClient();
    }
    return MLApiClient.instance;
  }

  private setupInterceptors(): void {
    if (!this.api) {
      throw new Error("API instance not initialized");
    }

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(
          "Making request to:",
          config.url,
          "with method:",
          config.method
        );
        return config;
      },
      (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log("Response received:", response.status);
        return response.data;
      },
      (error) => {
        console.error("Response interceptor error:", error);
        return Promise.reject(error);
      }
    );
  }

  async processJobs(jobIds: number[]): Promise<MLResponse<any>> {
    try {
      console.log("Processing jobs with IDs:", jobIds);
      if (!this.api) {
        throw new Error("API instance not initialized");
      }

      const response = await this.api.post("/process-jobs", {
        job_ids: jobIds,
      });

      console.log("Process jobs response:", response);
      return response;
    } catch (error) {
      console.error("Process jobs error:", error);
      throw error;
    }
  }
}

// Export a pre-initialized instance
export const mlClient = MLApiClient.getInstance();
