import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mlAnalyticsService } from "@/lib/api";
import { security } from "@/lib/core/security/security-service";
import { monitoring } from "@/lib/core/monitoring";

export function useSalaryComparison() {
  const [currentSalary, setCurrentSalary] = useState<number>(0);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const { data, refetch, isLoading, error } = useQuery({
    queryKey: [
      "ml-analytics",
      "salary-comparison",
      currentSalary,
      jobTitle,
      location,
    ],
    queryFn: async () => {
      try {
        // Validate session
        if (!security.isAuthenticated()) {
          throw new Error("Authentication required");
        }

        if (!security.hasPermission("compare_salaries")) {
          throw new Error("Insufficient permissions");
        }

        // Validate inputs
        if (!currentSalary || currentSalary <= 0) {
          throw new Error("Please enter a valid salary");
        }

        if (!jobTitle || typeof jobTitle !== "string") {
          throw new Error("Please enter a valid job title");
        }

        // Use the implemented compareSalary method
        const response = await mlAnalyticsService.compareSalary(
          currentSalary,
          jobTitle,
          location
        );

        // Additional validation - access the data property
        if (response.data.current_salary !== currentSalary) {
          monitoring.trackError({
            message: "Salary comparison mismatch",
            error: new Error("Salary comparison mismatch"),
            metadata: {
              inputSalary: currentSalary,
              returnedSalary: response.data.current_salary,
            },
          });
          throw new Error("Validation error in salary comparison");
        }

        return response; // Return just the data part
      } catch (error) {
        monitoring.trackError({
          message: "Salary comparison failed",
          error: error instanceof Error ? error : new Error("Unknown error"),
          metadata: { currentSalary, jobTitle, location },
        });

        throw new Error(
          error instanceof Error
            ? security.sanitizeOutput(error.message)
            : "Failed to compare salary"
        );
      }
    },
    enabled: false,
    retry: false,
  });

  const compare = () => {
    if (currentSalary > 0 && jobTitle) {
      // Generate new CSRF token for each comparison
      security.generateCsrfToken();
      refetch();
    }
  };

  return {
    currentSalary,
    setCurrentSalary: (value: number) => {
      if (value >= 0 && value <= 10000000) {
        setCurrentSalary(value);
      }
    },
    jobTitle,
    setJobTitle: (value: string) => {
      setJobTitle(security.sanitizeInput(value));
    },
    location,
    setLocation: (value: string) => {
      setLocation(security.sanitizeInput(value));
    },
    result: data, // Now this is just the SalaryComparisonResult
    compare,
    isLoading,
    error: error ? security.sanitizeOutput(error.message) : null,
  };
}
