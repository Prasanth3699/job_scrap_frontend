// hooks/ml/use-resume-analysis.ts
import { useMutation } from "@tanstack/react-query";
import { mlApi } from "@/lib/ml/api/ml-api";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { monitoring } from "@/lib/core/monitoring";
import { security } from "@/lib/core/security/security-service";

export function useResumeAnalysis() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const analysisMutation = useMutation({
    // Use the existing mlApi method
    mutationFn: async ({
      resume,
      jobIds,
    }: {
      resume: File;
      jobIds: number[];
    }) => {
      // Validate inputs using existing security checks
      const token = security.getToken();
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      if (!resume || jobIds.length === 0) {
        throw new Error("Please upload a resume and select jobs");
      }

      // Use the existing mlApi method
      return await mlApi.analyzeResume(resume, jobIds);
    },

    // Success handler integrated with monitoring
    onSuccess: (data) => {
      // Use existing monitoring service
      monitoring.trackEvent({
        name: "resume_analysis_success",
        properties: {
          job_count: data?.job_count || 0,
        },
      });

      console.log(data);

      // Store results using existing pattern
      localStorage.setItem("analysisResults", JSON.stringify(data));

      // Show success toast
      toast.success("Resume analysis completed");

      // Navigate to results page with existing job parameters
      //   router.push(`/match-results?jobs=${searchParams.get("jobs")}`);
    },

    // Error handler integrated with monitoring
    onError: (error: Error & { response?: any }) => {
      // Use existing monitoring service for error tracking
      monitoring.trackError({
        message: "Resume analysis failed",
        error,
        metadata: {
          errorType: error.name,
          errorMessage: error.message,
        },
      });

      // Detailed error handling
      if (error.response) {
        // Handle API-specific errors
        const errorMessage =
          error.response.data?.detail ||
          error.response.data?.message ||
          "An error occurred during resume analysis";
        toast.error(errorMessage);
      } else {
        // Generic error handling
        toast.error(error.message || "Failed to analyze resume");
      }
    },

    // Mutation lifecycle tracking
    onMutate: () => {
      // Track analysis start
      monitoring.trackEvent({
        name: "resume_analysis_started",
        properties: {},
      });
    },
  });

  return {
    // Mutation method
    analyzeResume: analysisMutation.mutateAsync,

    // Mutation states
    isAnalyzing: analysisMutation.isPending,
    isSuccess: analysisMutation.isSuccess,
    isError: analysisMutation.isError,

    // Error and data
    error: analysisMutation.error,
    analysisResults: analysisMutation.data,
  };
}
