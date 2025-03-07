import { api } from "./axios-instance";
import { EmailConfig, SchedulerConfig } from "@/types";

export const settingsApi = {
  getSettings: async () => {
    return await api.get("/settings");
  },

  updateEmailConfig: async (emailConfig: EmailConfig) => {
    return await api.put("/settings/email", emailConfig);
  },

  updateCronConfig: async (schedulerConfig: SchedulerConfig) => {
    return await api.put("/settings/scheduler", schedulerConfig);
  },
};
