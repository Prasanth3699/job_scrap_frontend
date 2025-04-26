import { api } from "./axios-instance";
import { Job } from "@/types";

export interface JobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string[];
  jobType?: string[];
  experience?: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
}
export const jobsApi = {
  getJobs: async (params?: JobsQueryParams) => {
    const cleanParams = {
      limit: 10, // Set default limit
      ...params,
      // Clean up empty arrays and null values
      ...(params?.location?.length ? { location: params.location } : {}),
      ...(params?.jobType?.length ? { jobType: params.jobType } : {}),
      ...(params?.experience?.length ? { experience: params.experience } : {}),
      ...(params?.search ? { search: params.search } : {}),
    };

    return await api.get("/jobs", { params: cleanParams });
  },
  getJobsDashboard: async (params?: JobsQueryParams) => {
    return await api.get("/jobs/dashboard", { params });
  },
  // Get single job details
  getJobById: async (id: string) => {
    return await api.get(`/jobs/${id}`);
  },

  getRelatedJobs: async (jobId: string) => {
    return await api.get(`/jobs/${jobId}/related`);
  },

  // Get recent jobs
  getRecentJobs: async (days: number = 7) => {
    return await api.get<Job[]>("/jobs/recent", {
      params: { days },
    });
  },

  // Trigger job scraping
  triggerScrape: async () => {
    return await api.post("/jobs/scrape");
  },
};
