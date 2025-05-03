// stores/analysis-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AnalysisResult } from "@/stores/analysis-schema";

interface AnalysisStore {
  results: AnalysisResult[];
  jobIds: string;
  setResults: (results: AnalysisResult[]) => void;
  setJobIds: (jobIds: string) => void;
}

export const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set) => ({
      results: [],
      jobIds: "",
      setResults: (results) => set({ results }),
      setJobIds: (jobIds) => set({ jobIds }),
    }),
    {
      name: "analysis-storage",
    }
  )
);

export type { AnalysisResult };
