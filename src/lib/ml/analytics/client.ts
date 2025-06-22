import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { security } from "@/lib/core/security/security-service";
import { monitoring } from "@/lib/core/monitoring";
import {
  SalaryComparisonResult,
  MLResponse,
  SalaryTrendsData,
  SkillDemandData,
  UserEngagementData,
  UserPreferencesData,
  JobAvailabilityData,
} from "./types";

import { InternalAxiosRequestConfig } from "axios";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  endTracking?: () => void;
}

interface ExtendedAxiosResponse<T = any> extends AxiosResponse<T> {
  config: ExtendedAxiosRequestConfig;
}

interface ExtendedAxiosError<T = any> extends AxiosError<T> {
  config: ExtendedAxiosRequestConfig;
}

const setupMLAnalyticsInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use(
    async (config: ExtendedAxiosRequestConfig) => {
      const token = security.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      await security.refreshTokenIfNeeded();

      Object.assign(config.headers, security.getSecurityHeaders());
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const endTracking = monitoring.startPerformanceTracking(
        `ML_ANALYTICS_${config.method?.toUpperCase()} ${config.url}`
      );
      config.endTracking = endTracking;

      return config;
    },
    (error: AxiosError) => {
      monitoring.trackError({
        message: "ML Analytics API request error",
        error,
      });
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response: ExtendedAxiosResponse) => {
      if (response.config.endTracking) {
        response.config.endTracking();
      }

      validateSecurityHeaders(response.headers);

      monitoring.trackEvent({
        name: "ml_analytics_api_success",
        properties: {
          endpoint: response.config.url,
          method: response.config.method,
        },
      });

      return response;
    },
    (error: ExtendedAxiosError) => {
      if (error.config?.endTracking) {
        error.config.endTracking();
      }

      monitoring.trackError({
        message: "ML Analytics API response error",
        error,
        metadata: {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
        },
      });

      if (error.response?.status === 401) {
        security.clearAllTokens();
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );
};

function validateSecurityHeaders(headers: Record<string, unknown>) {
  const requiredHeaders = [
    "content-security-policy",
    "x-frame-options",
    "x-content-type-options",
  ];

  requiredHeaders.forEach((header) => {
    if (!headers[header]) {
      monitoring.trackError({
        message: "Missing security header in response",
        error: new Error(`Missing ${header} header`),
        metadata: { missingHeader: header },
      });
    }
  });
}

class MLAnalyticsClient {
  private static instance: MLAnalyticsClient;
  private readonly api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_ML_ANALYTICS_URL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        ...security.getSecurityHeaders(),
      },
    });

    setupMLAnalyticsInterceptors(this.api);
  }

  static getInstance(): MLAnalyticsClient {
    if (!MLAnalyticsClient.instance) {
      MLAnalyticsClient.instance = new MLAnalyticsClient();
    }
    return MLAnalyticsClient.instance;
  }

  private validateSecurityHeaders(headers: Record<string, unknown>) {
    const requiredHeaders = [
      "content-security-policy",
      "x-frame-options",
      "x-content-type-options",
    ];

    requiredHeaders.forEach((header) => {
      if (!headers[header]) {
        monitoring.trackError({
          message: "Missing security header in response",
          error: new Error(`Missing ${header} header`),
          metadata: { missingHeader: header },
        });
      }
    });
  }

  async getSalaryTrends(
    jobTitle?: string
  ): Promise<MLResponse<SalaryTrendsData>> {
    if (!security.isAuthenticated()) {
      throw new Error("Authentication required");
    }

    if (!security.hasPermission("admin")) {
      throw new Error("Insufficient permissions");
    }

    monitoring.trackEvent({
      name: "ml_analytics_salary_trends_request",
      properties: { jobTitle },
    });

    const response = await this.api.get<SalaryTrendsData>("/market/salaries", {
      params: jobTitle ? { job_title: jobTitle } : {},
      headers: {
        "X-Request-Validation": security.encrypt(
          JSON.stringify({
            action: "salary-trends",
            jobTitle: jobTitle ? security.sanitizeInput(jobTitle) : null,
          })
        ),
      },
    });

    if (!response.data?.overall_monthly) {
      throw new Error("Invalid salary trends response format");
    }

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(
        Object.entries(response.headers).map(([k, v]) => [k, String(v)])
      ),
    };
  }

  async getSkillDemand(
    days: number = 90
  ): Promise<MLResponse<SkillDemandData>> {
    if (!security.isAuthenticated()) {
      throw new Error("Authentication required");
    }

    if (!security.hasPermission("admin")) {
      throw new Error("Insufficient permissions");
    }

    monitoring.trackEvent({
      name: "ml_analytics_skill_demand_request",
      properties: { days },
    });

    const response = await this.api.get<SkillDemandData>("/market/skills", {
      params: { days },
      headers: {
        "X-Request-Validation": security.encrypt(
          JSON.stringify({
            action: "skill-demand",
            days,
          })
        ),
      },
    });

    if (!response.data?.top_skills || !response.data?.skill_categories) {
      throw new Error("Invalid skill demand response format");
    }

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(
        Object.entries(response.headers).map(([k, v]) => [k, String(v)])
      ),
    };
  }

  async getUserPreferences(
    userId: string
  ): Promise<MLResponse<UserPreferencesData>> {
    if (!security.isAuthenticated()) {
      throw new Error("Authentication required");
    }

    if (!security.hasPermission("admin")) {
      throw new Error("Insufficient permissions");
    }

    monitoring.trackEvent({
      name: "ml_analytics_user_preferences_request",
      properties: { userId: security.sanitizeOutput(userId) },
    });

    const response = await this.api.get<UserPreferencesData>(
      `/user/preferences/${userId}`,
      {
        headers: {
          "X-Request-Validation": security.encrypt(
            JSON.stringify({
              action: "user-preferences",
              userId: security.sanitizeInput(userId),
            })
          ),
        },
      }
    );

    if (
      !response.data?.preferred_job_types ||
      !response.data?.preferred_locations
    ) {
      throw new Error("Invalid user preferences response format");
    }

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(
        Object.entries(response.headers).map(([k, v]) => [k, String(v)])
      ),
    };
  }

  async getUserEngagement(
    days: number = 30
  ): Promise<MLResponse<UserEngagementData>> {
    if (!security.isAuthenticated()) {
      throw new Error("Authentication required");
    }

    monitoring.trackEvent({
      name: "ml_analytics_user_engagement_request",
      properties: { days },
    });

    const response = await this.api.get<UserEngagementData>(
      `/user/engagement`,
      {
        params: { days },
        headers: {
          "X-Request-Validation": security.encrypt(JSON.stringify({ days })),
        },
      }
    );

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(
        Object.entries(response.headers).map(([k, v]) => [k, String(v)])
      ),
    };
  }

  async compareSalary(
    currentSalary: number,
    jobTitle: string,
    location?: string
  ): Promise<MLResponse<SalaryComparisonResult>> {
    try {
      if (!security.isAuthenticated()) {
        throw new Error("Authentication required");
      }

      if (typeof currentSalary !== "number" || currentSalary <= 0) {
        throw new Error("Invalid salary value");
      }

      if (typeof jobTitle !== "string" || jobTitle.trim().length === 0) {
        throw new Error("Invalid job title");
      }

      const sanitizedJobTitle = security.sanitizeInput(jobTitle);
      const sanitizedLocation = location
        ? security.sanitizeInput(location)
        : undefined;

      const payload = {
        currentSalary,
        jobTitle: sanitizedJobTitle,
        location: sanitizedLocation,
        timestamp: Date.now(),
        csrfToken: security.generateCsrfToken(),
      };

      const encryptedPayload = {
        ...payload,
        currentSalary: security.encrypt(currentSalary.toString()),
      };

      const response = await this.api.post<SalaryComparisonResult>(
        "/salary/compare",
        encryptedPayload,
        {
          headers: {
            "X-Request-Validation": security.encrypt(
              JSON.stringify({
                action: "salary-comparison",
                timestamp: payload.timestamp,
              })
            ),
          },
        }
      );

      const responseData = response.data;
      if (
        !responseData ||
        typeof responseData.current_salary !== "number" ||
        typeof responseData.market_median !== "number"
      ) {
        throw new Error("Invalid response format");
      }

      return {
        data: {
          current_salary: responseData.current_salary,
          market_median: responseData.market_median,
          percentile: responseData.percentile,
          comparison: security.sanitizeOutput(responseData.comparison),
          location_adjusted: responseData.location_adjusted,
          location_adjustment_factor: responseData.location_adjustment_factor,
        },
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(
          Object.entries(response.headers).map(([k, v]) => [k, String(v)])
        ),
      };
    } catch (error) {
      monitoring.trackError({
        message: "Salary comparison failed",
        error: error instanceof Error ? error : new Error("Unknown error"),
        metadata: {
          currentSalary,
          jobTitle: security.sanitizeOutput(jobTitle),
          location: location ? security.sanitizeOutput(location) : undefined,
        },
      });
      throw error;
    }
  }

  async getJobAvailability(
    days: number = 90
  ): Promise<MLResponse<JobAvailabilityData>> {
    if (!security.isAuthenticated()) {
      throw new Error("Authentication required");
    }

    monitoring.trackEvent({
      name: "ml_analytics_job_availability_request",
      properties: { days },
    });

    const response = await this.api.get<JobAvailabilityData>(
      "/market/jobs/availability",
      {
        params: { days },
        headers: {
          "X-Request-Validation": security.encrypt(
            JSON.stringify({
              action: "job-availability",
              days,
            })
          ),
        },
      }
    );

    // Validate response structure
    if (!response.data?.trends) {
      throw new Error("Invalid job availability response format");
    }

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(
        Object.entries(response.headers).map(([k, v]) => [k, String(v)])
      ),
    };
  }
}

export const mlAnalyticsClient = MLAnalyticsClient.getInstance();
