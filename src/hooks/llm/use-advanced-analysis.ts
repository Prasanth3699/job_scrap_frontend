// hooks/llm/use-advanced-analysis.ts
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { llmService } from "@/lib/api";
import {
  ResumeJobRequest,
  SkillGap,
  ATSAnalysis,
} from "@/lib/llm/client/types";

import { toast } from "sonner";
import { monitoring } from "@/lib/core/monitoring/monitoring-service";
import { security } from "@/lib/core/security/security-service";
import { useAdvanceAnalysisStore } from "@/stores/advance-analysis-store";
import { AnalysisResult } from "@/types/advanced-analysis";

/* ------------------------------------------------------------ */
/*  Shared helpers                                              */
/* ------------------------------------------------------------ */
type APIError = AxiosError<unknown>;

const buildErrorHandler =
  (msg: string) =>
  (error: APIError, variables?: ResumeJobRequest, context?: unknown): void => {
    /* mark the two parameters as intentionally unused */
    void variables;
    void context;

    monitoring.trackError({ message: msg, error });

    const payload =
      (error.response?.data as
        | { detail?: string; message?: string }
        | undefined) ?? {};
    const errMsg = payload.detail ?? payload.message ?? error.message;

    toast.error(errMsg);
  };

const requireAuth = () => {
  const token = security.getToken();
  if (!token) throw new Error("Authentication required. Please log in.");
};

/* ────────────────────────────────────────────────────────── */
/*  1. Comprehensive analysis                                 */
/* ────────────────────────────────────────────────────────── */
export function useLLMComprehensiveAnalysis() {
  return useMutation<AnalysisResult, APIError, ResumeJobRequest>({
    mutationFn: async (payload) => {
      requireAuth();
      const result = await llmService.analyze(payload);
      return result;
    },
    onMutate: () => {
      useAdvanceAnalysisStore.getState().setIsAnalyzing(true);
    },
    onSuccess: (data) => {
      useAdvanceAnalysisStore.getState().setResult(data);
      toast.success("Analysis completed");
    },
    onError: (error) => {
      useAdvanceAnalysisStore.getState().setIsAnalyzing(false);
      buildErrorHandler("LLM analysis failed")(error);
    },
  });
}

/* ────────────────────────────────────────────────────────── */
/*  2. Skill-gap analysis                                     */
/* ────────────────────────────────────────────────────────── */
export function useLLMSkillGaps() {
  return useMutation<SkillGap[], APIError, ResumeJobRequest>({
    mutationFn: async (payload) => {
      requireAuth();
      return llmService.skillGaps(payload);
    },
    onSuccess: () => toast.success("Skill-gap analysis completed"),
    onError: buildErrorHandler("LLM skill gaps failed"),
  });
}

/* ────────────────────────────────────────────────────────── */
/*  3. ATS score                                              */
/* ────────────────────────────────────────────────────────── */
export function useLLMATSScore() {
  return useMutation<ATSAnalysis, APIError, ResumeJobRequest>({
    mutationFn: async (payload) => {
      requireAuth();
      return llmService.atsScore(payload);
    },
    onSuccess: () => toast.success("ATS evaluation completed"),
    onError: buildErrorHandler("LLM ATS evaluation failed"),
  });
}

/* ────────────────────────────────────────────────────────── */
/*  4. Keyword extraction                                     */
/* ────────────────────────────────────────────────────────── */
export function useLLMExtractKeywords() {
  return useMutation<Record<string, string[]>, APIError, ResumeJobRequest>({
    mutationFn: async (payload) => {
      requireAuth();
      return llmService.extractKeywords(payload);
    },
    onSuccess: () => toast.success("Keyword extraction completed"),
    onError: buildErrorHandler("LLM extract keywords failed"),
  });
}
