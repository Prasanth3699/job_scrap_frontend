// hooks/ml/use-resume-analysis.ts
import { useMutation } from "@tanstack/react-query";
import { mlApi } from "@/lib/ml/api/ml-api";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { monitoring } from "@/lib/core/monitoring";
import { security } from "@/lib/core/security/security-service";
import { AnalysisResultSchema } from "@/stores/analysis-store";
import { z } from "zod";

export function useResumeAnalysis() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const analysisMutation = useMutation({
    mutationFn: async ({
      resume,
      jobIds,
    }: {
      resume: File;
      jobIds: number[];
    }) => {
      const token = security.getToken();
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      if (!resume || jobIds.length === 0) {
        throw new Error("Please upload a resume and select jobs");
      }

      try {
        const response = await mlApi.analyzeResume(resume, jobIds);
        console.log("Analysis response:", response);
        return response;
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },

    onSuccess: (data) => {
      monitoring.trackEvent({
        name: "resume_analysis_success",
        properties: {
          job_count: data.length || 0,
        },
      });

      // Store results in localStorage as fallback
      localStorage.setItem("analysisResults", JSON.stringify(data));

      toast.success("Resume analysis completed");
    },

    onError: (error: Error & { response?: any }) => {
      monitoring.trackError({
        message: "Resume analysis failed",
        error,
        metadata: {
          errorType: error.name,
          errorMessage: error.message,
        },
      });

      if (error.response) {
        const errorMessage =
          error.response.data?.detail ||
          error.response.data?.message ||
          "An error occurred during resume analysis";
        toast.error(errorMessage);
      } else {
        toast.error(error.message || "Failed to analyze resume");
      }
    },

    onMutate: () => {
      monitoring.trackEvent({
        name: "resume_analysis_started",
        properties: {},
      });
    },
  });

  return {
    analyzeResume: analysisMutation.mutateAsync,
    isAnalyzing: analysisMutation.isPending,
    isSuccess: analysisMutation.isSuccess,
    isError: analysisMutation.isError,
    error: analysisMutation.error,
    analysisResults: analysisMutation.data,
  };
}
