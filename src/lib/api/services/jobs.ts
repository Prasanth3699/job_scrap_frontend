import { coreApi } from "../gateway";
import { CORE_ENDPOINTS } from "../endpoints";
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

/**
 * Maps frontend parameters to backend parameters
 */
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

/**
 * Job listing and management service
 */
export const jobsService = {
  /**
   * Get jobs with optional filtering
   */
  getJobs: async (params?: JobsQueryParams) => {
    const cleanParams = mapJobParams(params);
    return await coreApi.get(CORE_ENDPOINTS.JOBS, { params: cleanParams });
  },

  /**
   * Get jobs for dashboard view
   */
  getJobsDashboard: async (params?: JobsQueryParams) => {
    return await coreApi.get(CORE_ENDPOINTS.JOBS_DASHBOARD, {
      params: mapJobParams(params),
    });
  },

  /**
   * Get a job by ID
   */
  getJobById: async (id: string) => {
    return await coreApi.get(CORE_ENDPOINTS.JOB_BY_ID(id));
  },

  /**
   * Get related jobs for a specific job
   */
  getRelatedJobs: async (jobId: string) => {
    return await coreApi.get(CORE_ENDPOINTS.RELATED_JOBS(jobId));
  },

  /**
   * Get recent jobs within a time period
   */
  getRecentJobs: async (days: number = 7) => {
    return await coreApi.get<Job[]>(CORE_ENDPOINTS.RECENT_JOBS, {
      params: { days },
    });
  },

  /**
   * Trigger job scraping
   */
  triggerScrape: async () => {
    return await coreApi.post(CORE_ENDPOINTS.TRIGGER_SCRAPE);
  },
};
