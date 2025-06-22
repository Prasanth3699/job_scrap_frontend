import { create } from "zustand";
import type { AnalysisResult } from "@/types/advanced-analysis";

interface SkillGap {
  skill: string;
  priority: "High" | "Medium" | "Low";
  current_level: string;
  required_level: string;
  improvement_suggestions: string[];
}

interface ATSAnalysis {
  score: number;
  keyword_match_rate: number;
  missing_keywords: string[];
  format_suggestions: string[];
  content_improvements: string[];
}

interface ImprovementPlan {
  skill: string;
  timeline_weeks: number;
  resources: string[];
  projects: string[];
  certifications: string[];
  estimated_cost: string;
}

interface Keywords {
  technical_skills: string[];
  soft_skills: string[];
  industry_terms: string[];
  action_verbs: string[];
}

interface AdvanceAnalysisState {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  setResult: (result: AnalysisResult) => void;
  setIsAnalyzing: (status: boolean) => void;
  clearResult: () => void;
}

export const useAdvanceAnalysisStore = create<AdvanceAnalysisState>((set) => ({
  result: null,
  isAnalyzing: false,
  setResult: (result) => set({ result, isAnalyzing: false }),
  setIsAnalyzing: (status) => set({ isAnalyzing: status }),
  clearResult: () => set({ result: null, isAnalyzing: false }),
}));
