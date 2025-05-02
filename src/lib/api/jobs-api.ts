import { api } from "./axios-instance";
import { Job } from "@/types";

export interface JobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  locations?: string[];
  jobTypes?: string[];
  experienceLevels?: string[];
  salaryRange?: {
    min: number;
    max: number;
  } | null;
}

// Maps FE params to BE params
function mapJobParams(params?: JobsQueryParams) {
  return {
    limit: params?.limit ?? 10,
    page: params?.page ?? 1,
    ...(params?.search && { search: params.search }),
    ...(params?.locations?.length && { location: params.locations }),
    ...(params?.jobTypes?.length && { job_type: params.jobTypes }),
    ...(params?.experienceLevels?.length && {
      experience: params.experienceLevels,
    }),
    ...(params?.salaryRange &&
      params.salaryRange.min != null && { salary_min: params.salaryRange.min }),
    ...(params?.salaryRange &&
      params.salaryRange.max != null && { salary_max: params.salaryRange.max }),
  };
}

export const jobsApi = {
  getJobs: async (params?: JobsQueryParams) => {
    const cleanParams = mapJobParams(params);
    return await api.get("/jobs", { params: cleanParams });
  },
  getJobsDashboard: async (params?: JobsQueryParams) => {
    return await api.get("/jobs/dashboard", { params: mapJobParams(params) });
  },
  getJobById: async (id: string) => {
    return await api.get(`/jobs/${id}`);
  },
  getRelatedJobs: async (jobId: string) => {
    return await api.get(`/jobs/${jobId}/related`);
  },
  getRecentJobs: async (days: number = 7) => {
    return await api.get<Job[]>("/jobs/recent", { params: { days } });
  },
  triggerScrape: async () => {
    return await api.post("/jobs/scrape");
  },
};
