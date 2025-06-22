// hooks/use-resume-analysis.ts

import { useMutation } from "@tanstack/react-query";
import { mlService } from "@/lib/api";
import { MatchResponse } from "@/stores/analysis-schema";
import { monitoring } from "@/lib/core/monitoring";
import { toast } from "sonner";
import { ZodError } from "zod";

interface AnalysisInput {
  resume: File;
  jobIds: number[];
}

export function useResumeAnalysis() {
  const analysisMutation = useMutation<MatchResponse, Error, AnalysisInput>({
    mutationFn: async ({ resume, jobIds }) => {
      try {
        const response = await mlService.analyzeResume(resume, jobIds);
        return response;
      } catch (error) {
        // Handle specific error types
        if (error instanceof ZodError) {
          console.error("Validation error:", error.errors);
          throw new Error("Invalid response format from server");
        }
        throw error;
      }
    },

    onSuccess: (data) => {
      monitoring.trackEvent({
        name: "resume_analysis_success",
        properties: {
          job_count: data.matches.length,
          parsed_resume_id: data.parsed_resume_id,
        },
      });

      // Store results
      try {
        localStorage.setItem("analysisResults", JSON.stringify(data.matches));
      } catch (storageError) {
        console.warn("Failed to store results in localStorage:", storageError);
      }

      toast.success(`Analysis complete. Found ${data.matches.length} matches.`);
    },

    onError: (error: Error) => {
      console.error("Analysis failed:", {
        error,
        name: error.name,
        message: error.message,
      });

      monitoring.trackError({
        message: "Resume analysis failed",
        error,
        metadata: {
          errorType: error.name,
          errorMessage: error.message,
        },
      });

      // Show user-friendly error message
      const errorMessage =
        error instanceof ZodError
          ? "Server returned invalid data format"
          : error.message || "Failed to analyze resume";

      toast.error(errorMessage);
    },

    onMutate: (variables) => {
      monitoring.trackEvent({
        name: "resume_analysis_started",
        properties: {
          file_name: variables.resume.name,
          job_count: variables.jobIds.length,
        },
      });
    },
  });

  return {
    analyzeResume: analysisMutation.mutateAsync,
    isAnalyzing: analysisMutation.isPending,
    isSuccess: analysisMutation.isSuccess,
    isError: analysisMutation.isError,
    error: analysisMutation.error,
    analysisResponse: analysisMutation.data,
    analysisResults: analysisMutation.data?.matches,
  };
}
