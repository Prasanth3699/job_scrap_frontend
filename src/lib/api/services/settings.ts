import { coreApi } from "../gateway";
import { CORE_ENDPOINTS } from "../endpoints";
import { EmailConfig, SchedulerConfig } from "@/types";

/**
 * Application settings service
 */
export const settingsService = {
  /**
   * Get all application settings
   */
  getSettings: async () => {
    return await coreApi.get(CORE_ENDPOINTS.SETTINGS);
  },

  /**
   * Update email configuration
   */
  updateEmailConfig: async (emailConfig: EmailConfig) => {
    return await coreApi.put(CORE_ENDPOINTS.EMAIL_CONFIG, emailConfig);
  },

  /**
   * Update scheduler configuration
   */
  updateCronConfig: async (schedulerConfig: SchedulerConfig) => {
    return await coreApi.put(CORE_ENDPOINTS.SCHEDULER_CONFIG, schedulerConfig);
  },
};
