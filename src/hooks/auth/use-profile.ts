import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { profileApi } from "@/lib/api/profile-api";
import { toast } from "sonner";
import { UserProfile } from "@/types";

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  isProfileComplete: boolean;

  // Actions
  createProfile: (profileData: UserProfile) => Promise<boolean>;
  uploadResume: (file: File) => Promise<boolean>;
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  resetProfile: () => void;
}

export const useProfile = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      isProfileComplete: false,

      createProfile: async (profileData) => {
        try {
          set({ isLoading: true });
          const updatedProfile = await profileApi.createProfile(profileData);

          set({
            profile: updatedProfile,
            isLoading: false,
            isProfileComplete: false,
          });

          toast.success("Profile created successfully!");
          return true;
        } catch (error) {
          console.error("Profile creation error:", error);
          handleProfileError(error);
          set({ isLoading: false });
          return false;
        }
      },

      uploadResume: async (file) => {
        try {
          set({ isLoading: true });
          const response = await profileApi.uploadResume(file);

          // Refetch profile to update resume status
          await get().fetchProfile();

          toast.success("Resume uploaded successfully!");
          return true;
        } catch (error) {
          console.error("Resume upload error:", error);
          handleProfileError(error);
          set({ isLoading: false });
          return false;
        }
      },

      fetchProfile: async () => {
        try {
          set({ isLoading: true });
          const profile = await profileApi.getProfile();

          set({
            profile,
            isLoading: false,
            isProfileComplete: !!(
              profile.career_stage && profile.resume_uploaded
            ),
          });
        } catch (error) {
          console.error("Fetch profile error:", error);
          set({
            profile: null,
            isLoading: false,
            isProfileComplete: false,
          });
        }
      },

      updateProfile: async (profileData) => {
        try {
          set({ isLoading: true });
          const updatedProfile = await profileApi.updateProfile(profileData);

          set({
            profile: updatedProfile,
            isLoading: false,
            isProfileComplete: !!(
              updatedProfile.career_stage && updatedProfile.resume_uploaded
            ),
          });

          toast.success("Profile updated successfully!");
          return true;
        } catch (error) {
          console.error("Profile update error:", error);
          handleProfileError(error);
          set({ isLoading: false });
          return false;
        }
      },

      resetProfile: () => {
        set({
          profile: null,
          isLoading: false,
          isProfileComplete: false,
        });
      },
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

// Helper function to handle profile errors
const handleProfileError = (error: unknown) => {
  console.error("Profile error:", error);
  if ((error as any).response?.data?.detail) {
    toast.error((error as any).response.data.detail);
  } else if ((error as any).message) {
    toast.error((error as any).message);
  } else {
    toast.error("An unexpected error occurred");
  }
};
