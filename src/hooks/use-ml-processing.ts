// hooks/use-ml-processing.ts
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { mlClient } from "@/lib/ml-client";
import { toast } from "sonner";

export function useMLProcessing() {
  const [processingStatus, setProcessingStatus] = useState<string>("");

  const processJobsMutation = useMutation({
    mutationFn: async (jobIds: number[]) => {
      console.log("Starting job processing mutation");
      const response = await mlClient.processJobs(jobIds);
      console.log("Mutation response:", response);
      return response;
    },
    onMutate: () => {
      setProcessingStatus("processing");
      console.log("Processing started");
    },
    onSuccess: (data) => {
      setProcessingStatus("completed");
      console.log("Processing completed:", data);
      toast.success("Jobs processed successfully");
    },
    onError: (error: Error) => {
      setProcessingStatus("error");
      console.error("Processing error:", error);
      toast.error(`Failed to process jobs: ${error.message}`);
    },
  });

  return {
    processJobs: processJobsMutation.mutateAsync,
    isProcessing: processJobsMutation.isPending,
    processingStatus,
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
