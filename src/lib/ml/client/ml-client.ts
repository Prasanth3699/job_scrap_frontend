// lib/ml/client/ml-client.ts

import axios, { AxiosInstance } from "axios";
import { setupMLInterceptors } from "./interceptors";
import { MatchResponse, MatchResponseSchema } from "@/stores/analysis-schema";

class MLApiClient {
  private static instance: MLApiClient;
  private readonly api: AxiosInstance;
  private readonly fileApi: AxiosInstance;
  private readonly baseURL: string;

  private constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_ML_SERVICE_URL || "";
    if (!this.baseURL) {
      throw new Error(
        "ML Service URL is not configured in environment variables"
      );
    }

    // Initialize JSON API client
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 90000, // 90 seconds timeout
      headers: { "Content-Type": "application/json" },
    });

    // Initialize multipart form data client
    this.fileApi = axios.create({
      baseURL: this.baseURL,
      timeout: 90000,
      // Let Axios set Content-Type for FormData automatically
      withCredentials: true, // Important for sending cookies/auth tokens if needed by CORS
    });

    // Setup interceptors for both instances
    setupMLInterceptors(this.api);
    setupMLInterceptors(this.fileApi);
  }

  // Get singleton instance
  static getInstance(): MLApiClient {
    if (!MLApiClient.instance) {
      MLApiClient.instance = new MLApiClient();
    }
    return MLApiClient.instance;
  }

  // Helper function to safely parse JSON if data is a string
  private parseIfNeeded(data: unknown): unknown {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return parsed;
      } catch (e) {
        console.error(
          "[MLApiClient] Failed to parse response string as JSON:",
          e
        );
        // Return the original string if parsing failed, maybe it's plain text?
        return data;
      }
    }
    // Return data as-is if it's not a string (already parsed or other type)
    return data;
  }

  /**
   * Analyzes a resume against selected jobs using the ML service.
   * Assumes interceptors are set up to handle Auth and return response.data.
   */
  async analyzeResume(resume: File, jobIds: number[]): Promise<MatchResponse> {
    try {
      // --- Input Validation ---
      if (!(resume instanceof File))
        throw new Error("Invalid resume file provided.");
      if (!Array.isArray(jobIds) || jobIds.length === 0)
        throw new Error("At least one job ID is required.");
      if (jobIds.some((id) => typeof id !== "number" || isNaN(id)))
        throw new Error("Job IDs must be valid numbers.");

      // --- Prepare FormData ---
      const formData = new FormData();
      formData.append("resume_file", resume, resume.name);
      formData.append("job_ids", jobIds.join(","));
      const preferences = {
        // Example preferences - make dynamic if needed
        preferred_job_types: ["Full Time", "Contract"],
        preferred_locations: ["Remote", "New York, NY"],
        salary_expectation: "competitive",
        target_title: "Software Engineer",
        preferred_companies: ["Google", "Microsoft", "Startup"],
      };
      formData.append("preferences", JSON.stringify(preferences));

      // --- API Call ---
      // Headers (like Authorization) are handled by the request interceptor.
      // We only pass extra headers here if needed for *this specific request*.
      const headers: Record<string, string> = {};
      const apiUrl = "/matching/new-matchs"; // Ensure this path is correct relative to baseURL

      // The 'await' here resolves with the value RETURNED BY THE RESPONSE INTERCEPTOR,
      // which we configured to be `response.data`. We type it as `unknown` for safety first.
      const responseData: unknown = await this.fileApi.post(apiUrl, formData, {
        headers,
      });

      // Check if the interceptor returned undefined/null (could happen if response body was empty)
      if (responseData === undefined || responseData === null) {
        console.error(
          "[analyzeResume] Data received from interceptor is missing."
        );
        throw new Error("Received empty or invalid data from API response.");
      }

      // Parse if necessary (e.g., if server sent plain text)
      const parsedData = this.parseIfNeeded(responseData);

      // Validate structure
      if (typeof parsedData !== "object" || parsedData === null) {
        throw new Error(
          "Invalid response format: Expected an object after parsing."
        );
      }

      // Validate with Zod schema
      const validationResult = MatchResponseSchema.safeParse(parsedData);
      if (!validationResult.success) {
        console.error(
          "[analyzeResume] Zod Validation failed:",
          validationResult.error.errors
        );
        console.error(
          "[analyzeResume] Data that failed validation:",
          parsedData
        );
        // Provide a more specific error message based on Zod's output
        const issues = validationResult.error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join("; ");
        throw new Error(`Invalid API response format: ${issues}`);
      }

      return validationResult.data; // Return the strongly-typed, validated data
    } catch (error) {
      // Log the error that reached this top-level catch block
      console.error("[analyzeResume] Final catch block:", error);

      // Check if it's an error passed through from the interceptor or a new one
      if (axios.isAxiosError(error)) {
        // This catches network errors or errors rejected by the response interceptor
        console.error("[analyzeResume] Axios Error Details:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          config_url: error.config?.url,
          response_data: error.response?.data,
        });
        const errorMsg =
          error.response?.data?.detail || error.message || "API request failed";
        // Throw a new error with a user-friendly prefix
        throw new Error(`Analysis API Error: ${errorMsg}`);
      } else if (error instanceof Error) {
        // Catches validation errors, parsing errors, or errors from request interceptor
        // Rethrow the original error message
        throw error;
      } else {
        // Fallback for non-standard errors
        console.error("[analyzeResume] Non-standard error caught:", error);
        throw new Error("An unexpected error occurred during resume analysis.");
      }
    }
  }

  // Placeholder for other API methods if needed
  // async processJobs(...) { /* ... */ }
  // async getJobRecommendations(...) { /* ... */ }
}

// Export the singleton instance for use elsewhere
export const mlClient = MLApiClient.getInstance();
