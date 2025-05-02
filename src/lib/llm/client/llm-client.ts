// lib/llm/client/llm-client.ts
import axios, { AxiosInstance } from "axios";
import { setupLLMInterceptors } from "./interceptors";
import {
  ResumeJobRequest,
  JobAnalysisResult,
  SkillGap,
  ATSAnalysis,
} from "./types";
import { handleLLMError } from "@/lib/llm/utils/error-handlers";

class LLMApiClient {
  private static instance: LLMApiClient;
  private readonly api: AxiosInstance;

  private constructor() {
    const baseURL = process.env.NEXT_PUBLIC_LLM_SERVICE_URL;
    if (!baseURL) throw new Error("LLM Service URL is not configured");

    this.api = axios.create({
      baseURL,
      timeout: 90000,
      headers: { "Content-Type": "application/json" },
    });

    setupLLMInterceptors(this.api);
  }

  static getInstance(): LLMApiClient {
    if (!LLMApiClient.instance) {
      LLMApiClient.instance = new LLMApiClient();
    }
    return LLMApiClient.instance;
  }

  // ───────────────────────────────────────────
  // MAIN ENDPOINTS
  // ───────────────────────────────────────────

  async analyze(req: ResumeJobRequest): Promise<JobAnalysisResult> {
    try {
      const { data } = await this.api.post<JobAnalysisResult>(
        "advanced-analysis/analyze",
        req
      );
      return data; // ✔ JobAnalysisResult
    } catch (error) {
      handleLLMError(error, "Analyze failed"); // throws → never returns
      throw error as never; // satisfies TS
    }
  }

  async skillGaps(req: ResumeJobRequest): Promise<SkillGap[]> {
    try {
      const { data } = await this.api.post<SkillGap[]>(
        "/analyze/skill-gaps",
        req
      );
      return data;
    } catch (error) {
      handleLLMError(error, "Skill-gaps failed");
      throw error as never;
    }
  }

  async atsScore(req: ResumeJobRequest): Promise<ATSAnalysis> {
    try {
      const { data } = await this.api.post<ATSAnalysis>("/analyze/ats", req);
      return data;
    } catch (error) {
      handleLLMError(error, "ATS-score failed");
      throw error as never;
    }
  }

  async extractKeywords(
    req: ResumeJobRequest
  ): Promise<Record<string, string[]>> {
    try {
      const { data } = await this.api.post<Record<string, string[]>>(
        "/analyze/keywords",
        req
      );
      return data;
    } catch (error) {
      handleLLMError(error, "Extract-keywords failed");
      throw error as never;
    }
  }
}

export const llmClient = LLMApiClient.getInstance();
