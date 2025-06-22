import { mlApi } from "../gateway";
import { ML_ENDPOINTS } from "../endpoints";
import { makeWebSocketUrl } from "../gateway";
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
} from "@/lib/ml/analytics/types";

/**
 * ML Analytics service for market insights and data analysis
 */
export const mlAnalyticsService = {
  /**
   * Get salary trends for a specific job title or overall market
   */
  getSalaryTrends: async (
    jobTitle?: string
  ): Promise<MLResponse<SalaryTrendsData>> => {
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

    const response = await mlApi.get(ML_ENDPOINTS.MARKET_SALARIES, {
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

    if (!response?.overall_monthly) {
      throw new Error("Invalid salary trends response format");
    }

    return {
      data: response,
      status: 200,
      statusText: "OK",
      headers: {},
    };
  },

  /**
   * Get skill demand data for market analysis
   */
  getSkillDemand: async (
    days: number = 90
  ): Promise<MLResponse<SkillDemandData>> => {
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

    const response = await mlApi.get(ML_ENDPOINTS.MARKET_SKILLS, {
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

    // Validate response structure
    if (!response?.top_skills || !response?.skill_categories) {
      throw new Error("Invalid skill demand response format");
    }

    return {
      data: response,
      status: 200,
      statusText: "OK",
      headers: {},
    };
  },

  /**
   * Get user preferences for personalization
   */
  getUserPreferences: async (
    userId: string
  ): Promise<MLResponse<UserPreferencesData>> => {
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

    const response = await mlApi.get(ML_ENDPOINTS.USER_PREFERENCES(userId), {
      headers: {
        "X-Request-Validation": security.encrypt(
          JSON.stringify({
            action: "user-preferences",
            userId: security.sanitizeInput(userId),
          })
        ),
      },
    });

    if (!response?.preferred_job_types || !response?.preferred_locations) {
      throw new Error("Invalid user preferences response format");
    }

    return {
      data: response,
      status: 200,
      statusText: "OK",
      headers: {},
    };
  },

  /**
   * Get user engagement analytics
   */
  getUserEngagement: async (
    days: number = 30
  ): Promise<MLResponse<UserEngagementData>> => {
    if (!security.isAuthenticated()) {
      throw new Error("Authentication required");
    }

    monitoring.trackEvent({
      name: "ml_analytics_user_engagement_request",
      properties: { days },
    });

    const response = await mlApi.get(ML_ENDPOINTS.USER_ENGAGEMENT, {
      params: { days },
      headers: {
        "X-Request-Validation": security.encrypt(JSON.stringify({ days })),
      },
    });

    return {
      data: response,
      status: 200,
      statusText: "OK",
      headers: {},
    };
  },

  /**
   * Compare salary with market data
   */
  compareSalary: async (
    currentSalary: number,
    jobTitle: string,
    location?: string
  ): Promise<MLResponse<SalaryComparisonResult>> => {
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

      const response = await mlApi.post(
        ML_ENDPOINTS.SALARY_COMPARE,
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

      if (
        !response ||
        typeof response.current_salary !== "number" ||
        typeof response.market_median !== "number"
      ) {
        throw new Error("Invalid response format");
      }

      return {
        data: {
          current_salary: response.current_salary,
          market_median: response.market_median,
          percentile: response.percentile,
          comparison: security.sanitizeOutput(response.comparison),
          location_adjusted: response.location_adjusted,
          location_adjustment_factor: response.location_adjustment_factor,
        },
        status: 200,
        statusText: "OK",
        headers: {},
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
  },

  /**
   * Get job availability data in the market
   */
  getJobAvailability: async (
    days: number = 90
  ): Promise<MLResponse<JobAvailabilityData>> => {
    if (!security.isAuthenticated()) {
      throw new Error("Authentication required");
    }

    monitoring.trackEvent({
      name: "ml_analytics_job_availability_request",
      properties: { days },
    });

    const response = await mlApi.get(ML_ENDPOINTS.JOB_AVAILABILITY, {
      params: { days },
      headers: {
        "X-Request-Validation": security.encrypt(
          JSON.stringify({
            action: "job-availability",
            days,
          })
        ),
      },
    });

    // Validate response structure
    if (!response?.trends) {
      throw new Error("Invalid job availability response format");
    }

    return {
      data: response,
      status: 200,
      statusText: "OK",
      headers: {},
    };
  },

  /**
   * Connect to realtime analytics websocket
   */
  connectRealtime: (callback: (data: any) => void) => {
    const token = security.getToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    // Create WebSocket URL through gateway
    const wsUrl = makeWebSocketUrl(SERVICE_PATHS.ML, ML_ENDPOINTS.WS_REALTIME);
    const url = new URL(wsUrl);
    url.searchParams.set("token", token);

    const socket = new WebSocket(url.toString());
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    socket.onopen = () => {
      reconnectAttempts = 0;
      monitoring.trackEvent({
        name: "realtime_connection_established",
      });
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Validate message signature if present
        if (data.signature && !security.validateMessageSignature?.(data)) {
          monitoring.trackError({
            message: "Invalid message signature",
            error: new Error("Invalid message signature"),
            metadata: { data },
          });
          return;
        }

        callback(data);
      } catch (error) {
        monitoring.trackError({
          message: "Failed to parse WebSocket message",
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      }
    };

    socket.onclose = () => {
      if (reconnectAttempts < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts++;
          mlAnalyticsService.connectRealtime(callback);
        }, 1000 * reconnectAttempts);
      }
    };

    socket.onerror = (error) => {
      monitoring.trackError({
        message: "WebSocket error",
        error: new Error("WebSocket error occurred"),
      });
    };

    return {
      disconnect: () => {
        socket.close();
      },
    };
  },
};
