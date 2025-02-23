import { create } from "zustand";

interface ScrapingState {
  isRunning: boolean;
  lastRun: string | null;
  currentProgress: string | null;
  error: string | null;
  setStatus: (status: Partial<ScrapingState>) => void;
  reset: () => void;
}

export const useScrapingStore = create<ScrapingState>((set) => ({
  isRunning: false,
  lastRun: null,
  currentProgress: null,
  error: null,
  setStatus: (status) => set(status),
  reset: () =>
    set({
      isRunning: false,
      currentProgress: null,
      error: null,
    }),
}));
