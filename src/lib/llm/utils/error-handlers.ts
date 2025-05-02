import { monitoring } from "@/lib/core/monitoring/monitoring-service";

export function handleLLMError(error: any, context = "") {
  monitoring.trackError({
    message: `LLM API Error${context ? ` (${context})` : ""}`,
    error,
  });

  if (error?.response) {
    throw new Error(
      error.response.data?.detail ||
        error.response.data?.message ||
        error.message ||
        "An error occurred"
    );
  }
  throw new Error(error.message || "An error occurred");
}
