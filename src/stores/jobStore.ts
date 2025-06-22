import { create } from "zustand";
import { Job, JobFilters } from "@/types";

interface JobState {
  jobs: Job[];
  filters: JobFilters;
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
  totalPages: number; // Add this
  setJobs: (jobs: Job[]) => void;
  appendJobs: (newJobs: Job[]) => void;
  setFilters: (filters: JobFilters) => void;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void; // Add this
  resetStore: () => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  filters: {
    locations: [],
    jobTypes: [],
    experienceLevels: [],
    salaryRange: null,
    searchQuery: "",
  },
  loading: false,
  hasMore: true,
  currentPage: 1,
  totalPages: 1,

  setJobs: (jobs) => set({ jobs }),
  appendJobs: (newJobs) =>
    set((state) => {
      const existingIds = new Set(state.jobs.map((job) => job.id));
      const uniqueNewJobs = newJobs.filter((job) => !existingIds.has(job.id));
      return {
        jobs: [...state.jobs, ...uniqueNewJobs],
      };
    }),
  setFilters: (filters) => set({ filters }),
  setLoading: (loading) => set({ loading }),
  setHasMore: (hasMore) => set({ hasMore }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (total) => set({ totalPages: total }),
  resetStore: () =>
    set({
      jobs: [],
      filters: {
        locations: [],
        jobTypes: [],
        experienceLevels: [],
        salaryRange: null,
        searchQuery: "",
      },
      loading: false,
      hasMore: true,
      currentPage: 1,
      totalPages: 1,
    }),
}));
