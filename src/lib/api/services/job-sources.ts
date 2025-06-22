import { coreApi } from "../gateway";
import { CORE_ENDPOINTS } from "../endpoints";
import { JobSource, JobSourceFormData, JobSourceUpdateData } from "@/types";

/**
 * Job source management service
 */
export const jobSourceService = {
  /**
   * Get all job sources
   */
  getSources: async (): Promise<JobSource[]> => {
    return await coreApi.get(CORE_ENDPOINTS.JOB_SOURCES);
  },

  /**
   * Create a new job source
   */
  createSource: async (data: JobSourceFormData): Promise<JobSource> => {
    return await coreApi.post(CORE_ENDPOINTS.JOB_SOURCES, data);
  },

  /**
   * Update an existing job source
   */
  updateSource: async (
    id: number,
    data: JobSourceUpdateData
  ): Promise<JobSource> => {
    return await coreApi.put(CORE_ENDPOINTS.JOB_SOURCE_BY_ID(id), data);
  },

  /**
   * Delete a job source
   */
  deleteSource: async (id: number) => {
    return await coreApi.delete(CORE_ENDPOINTS.JOB_SOURCE_BY_ID(id));
  },

  /**
   * Trigger scraping for a specific source
   */
  triggerScrape: async (sourceId?: number) => {
    return await coreApi.post(CORE_ENDPOINTS.TRIGGER_SCRAPE, {
      source_id: sourceId,
    });
  },
};
