import { api } from "./axios-instance";
import { JobSource, JobSourceFormData, JobSourceUpdateData } from "@/types";

export const jobSourceApi = {
  getSources: async (): Promise<JobSource[]> => {
    return await api.get("/job-sources");
  },

  createSource: async (data: JobSourceFormData): Promise<JobSource> => {
    return await api.post("/job-sources", data);
  },

  updateSource: async (
    id: number,
    data: JobSourceUpdateData
  ): Promise<JobSource> => {
    return await api.put(`/job-sources/${id}`, data);
  },

  deleteSource: async (id: number) => {
    return await api.delete(`/job-sources/${id}`);
  },

  triggerScrape: async (sourceId?: number) => {
    return await api.post("/jobs/scrape", { source_id: sourceId });
  },
};
