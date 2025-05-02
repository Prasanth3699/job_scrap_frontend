// stores/analysis-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MatchResponse } from "@/stores/analysis-schema"; // Import MatchResponse type

interface AnalysisStore {
  results: MatchResponse | null; // Store the whole response object or null
  jobIds: string;
  setResults: (results: MatchResponse | null) => void; // Update setter type
  setJobIds: (jobIds: string) => void;
}

export const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set) => ({
      results: null, // Initialize results to null
      jobIds: "",
      setResults: (results) => set({ results }), // Setter remains the same logic
      setJobIds: (jobIds) => set({ jobIds }),
    }),
    {
      name: "analysis-storage",
    }
  )
);

// Export relevant types if needed elsewhere (AnalysisResult might still be useful)
export type { MatchResponse };
