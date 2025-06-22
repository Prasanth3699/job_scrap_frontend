import { toast } from "sonner";
import { monitoring } from "@/lib/core/monitoring";

export const handleMLError = (error: any, context: string) => {
  monitoring.trackError({
    message: context,
    error,
    metadata: {
      status: error.response?.status,
      data: error.response?.data,
    },
  });

  if (error.response?.status === 401) {
    toast.error("Authentication failed. Please log in again.");
    // Handle unauthorized access
    window.location.href = "/login";
  } else if (error.response?.status === 429) {
    toast.error("Too many requests. Please try again later.");
  } else {
    toast.error(error.response?.data?.detail || "An error occurred");
  }

  throw error;
};
