import { llmApi } from "../gateway";
import { LLM_ENDPOINTS } from "../endpoints";
import { monitoring } from "@/lib/core/monitoring";
import {
  ResumeJobRequest,
  JobAnalysisResult,
  SkillGap,
  ATSAnalysis,
} from "@/lib/llm/client/types";

/**
 * Language Learning Model service for text-based analysis
 */
export const llmService = {
  /**
   * Perform a comprehensive analysis of resume against job
   */
  analyze: async (req: ResumeJobRequest): Promise<JobAnalysisResult> => {
    try {
      monitoring.trackEvent({
        name: "llm_analyze_started",
        properties: {
          has_job_id: !!req.original_job_id,
          has_resume_id: !!req.parsed_resume_id,
        },
      });

      const response = await llmApi.post(LLM_ENDPOINTS.ANALYZE, req);

      monitoring.trackEvent({
        name: "llm_analyze_completed",
        properties: { success: true },
      });

      return response;
    } catch (error) {
      monitoring.trackError({
        message: "LLM analysis failed",
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
      throw error;
    }
  },

  /**
   * Identify skill gaps between resume and job requirements
   */
  skillGaps: async (req: ResumeJobRequest): Promise<SkillGap[]> => {
    try {
      monitoring.trackEvent({
        name: "llm_skill_gaps_started",
        properties: {
          has_job_id: !!req.original_job_id,
          has_resume_id: !!req.parsed_resume_id,
        },
      });

      const response = await llmApi.post(LLM_ENDPOINTS.SKILL_GAPS, req);

      monitoring.trackEvent({
        name: "llm_skill_gaps_completed",
        properties: { success: true },
      });

      return response;
    } catch (error) {
      monitoring.trackError({
        message: "LLM skill gaps analysis failed",
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
      throw error;
    }
  },

  /**
   * Generate ATS compatibility score and suggestions
   */
  atsScore: async (req: ResumeJobRequest): Promise<ATSAnalysis> => {
    try {
      monitoring.trackEvent({
        name: "llm_ats_score_started",
        properties: {
          has_job_id: !!req.original_job_id,
          has_resume_id: !!req.parsed_resume_id,
        },
      });

      const response = await llmApi.post(LLM_ENDPOINTS.ATS_SCORE, req);

      monitoring.trackEvent({
        name: "llm_ats_score_completed",
        properties: { success: true },
      });

      return response;
    } catch (error) {
      monitoring.trackError({
        message: "LLM ATS analysis failed",
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
      throw error;
    }
  },

  /**
   * Extract keywords from resume and job description
   */
  extractKeywords: async (
    req: ResumeJobRequest
  ): Promise<Record<string, string[]>> => {
    try {
      monitoring.trackEvent({
        name: "llm_extract_keywords_started",
        properties: {
          has_job_id: !!req.original_job_id,
          has_resume_id: !!req.parsed_resume_id,
        },
      });

      const response = await llmApi.post(LLM_ENDPOINTS.EXTRACT_KEYWORDS, req);

      monitoring.trackEvent({
        name: "llm_extract_keywords_completed",
        properties: { success: true },
      });

      return response;
    } catch (error) {
      monitoring.trackError({
        message: "LLM keyword extraction failed",
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
      throw error;
    }
  },
};
