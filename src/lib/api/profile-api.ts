import { api } from "./axios-instance";
import { UserProfile } from "@/types";

export const profileApi = {
  createProfile: async (profileData: {
    career_stage: string;
    current_role?: string;
    professional_title?: string;
    domains?: string[];
    experience_level?: string;
  }): Promise<UserProfile> => {
    try {
      const processedData = {
        ...profileData,
        domains: Array.isArray(profileData.domains)
          ? profileData.domains
          : profileData.domains
          ? [profileData.domains]
          : [],
      };

      const response = await api.post("/profile/onboarding", processedData);
      return response;
    } catch (error: any) {
      console.error("Profile creation error:", error);
      if (error.response) {
        // Handle validation errors
        if (error.response.status === 422) {
          const validationErrors = error.response.data.detail;
          const errorMessages = validationErrors
            .map((err: any) => `${err.loc.join(".")} : ${err.msg}`)
            .join(", ");

          throw new Error(`Validation Error: ${errorMessages}`);
        }

        throw new Error(
          error.response.data.detail ||
            "Failed to create profile. Please try again."
        );
      } else if (error.request) {
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        throw new Error("Error creating profile. Please try again.");
      }
    }
  },

  uploadResume: async (
    file: File
  ): Promise<{
    message: string;
    profile: UserProfile;
  }> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/profile/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    } catch (error) {
      console.error("Resume upload error:", error);
      throw error;
    }
  },

  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get("/profile");
      return response;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },
};
