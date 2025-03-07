import { api } from "./axios-instance";
import { JobsQueryParams } from "@/types";

export const jobsApi = {
  getJobs: async (params?: JobsQueryParams) => {
    return await api.get("/jobs", { params });
  },

  triggerScrape: async () => {
    return await api.post("/jobs/scrape");
  },
};
