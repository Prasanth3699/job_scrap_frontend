import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { mlClient } from "@/lib/ml/client/ml-client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/use-auth";
import { security } from "@/lib/core/security/security-service";

export function useMLProcessing() {
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const { isAuthenticated, token } = useAuth();

  const processJobsMutation = useMutation({
    mutationFn: async (jobIds: number[]) => {
      const token = security.getToken();
      if (!isAuthenticated || !token) {
        throw new Error("Authentication required");
      }

      const response = await mlClient.processJobs(jobIds);
      return response;
    },
    onMutate: () => {
      setProcessingStatus("processing");
    },
    onSuccess: (data) => {
      setProcessingStatus("completed");
      toast.success("Jobs processed successfully");
      return data;
    },
    onError: (error: any) => {
      setProcessingStatus("error");
      if (error.message === "Authentication required") {
        toast.error("Please login to process jobs");
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(`Failed to process jobs: ${error.message}`);
      }
    },
  });

  return {
    processJobs: processJobsMutation.mutateAsync,
    isProcessing: processJobsMutation.isPending,
    processingStatus,
    isAuthenticated,
  };
}

// import { useState } from "react";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { mlClient } from "@/lib/ml-client";
// import { useAnalytics } from "./use-analytics";
// import { toast } from "sonner";

// export function useMLProcessing(jobId?: number) {
//   const { trackEvent } = useAnalytics();
//   const [processingStatus, setProcessingStatus] = useState<string>("");

//   const processJobsMutation = useMutation({
//     mutationFn: mlClient.processJobs,
//     onMutate: (jobIds) => {
//       setProcessingStatus("processing");
//       trackEvent({
//         name: "ml_processing_started",
//         properties: { job_count: jobIds.length },
//       });
//     },
//     onSuccess: (data) => {
//       setProcessingStatus("completed");
//       trackEvent({
//         name: "ml_processing_completed",
//         properties: { success: true },
//       });
//       toast.success("Jobs processed successfully");
//       return data;
//     },
//     onError: (error) => {
//       setProcessingStatus("error");
//       trackEvent({
//         name: "ml_processing_error",
//         properties: { error: error.message },
//       });
//       toast.error("Failed to process jobs");
//     },
//   });

//   const { data: recommendations, isLoading: isLoadingRecommendations } =
//     useQuery({
//       queryKey: ["ml_recommendations", jobId],
//       queryFn: () => mlClient.getJobRecommendations(jobId!),
//       enabled: !!jobId,
//       staleTime: 5 * 60 * 1000,
//     });

//   return {
//     processJobs: processJobsMutation.mutateAsync,
//     isProcessing: processJobsMutation.isPending,
//     processingStatus,
//     recommendations: recommendations?.data,
//     isLoadingRecommendations,
//   };
// }
