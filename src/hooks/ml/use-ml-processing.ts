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
    onError: (error: Error & { response?: { status: number } }) => {
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
