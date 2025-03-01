import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
  initialize: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isInitialized: false,

      initialize: () => {
        const token = localStorage.getItem("token") || Cookies.get("token");
        if (token) {
          authApi.setAuthToken(token);
          set({ token, isAuthenticated: true, isInitialized: true });
        } else {
          set({ isInitialized: true });
        }
      },

      register: async (name, email, password) => {
        try {
          set({ isLoading: true });

          const response = await authApi.register({ name, email, password });
          if (response.id) {
            return true;
          }

          return false;
        } catch (error) {
          console.error("Registration error:", error);
          toast.error("Registration failed ❌");
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true });

          const response = await authApi.login({ email, password });

          if (response?.access_token) {
            set({
              token: response.access_token,
              isAuthenticated: true,
              isInitialized: true,
            });

            localStorage.setItem("token", response.access_token);
            Cookies.set("token", response.access_token, { expires: 7 });

            authApi.setAuthToken(response.access_token);

            toast.success("Login successful! ✅");
            return true;
          }

          return false;
        } catch (error: unknown) {
          console.error("Login error:", error);

          if (
            (error as { response?: { status: number } }).response?.status ===
            401
          ) {
            toast.error("Incorrect email or password ❌");
          } else {
            toast.error("Something went wrong, please try again.");
          }

          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        Cookies.remove("token");
        authApi.setAuthToken(null);
        set({
          token: null,
          isAuthenticated: false,
        });
        window.location.href = "/login";
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true });
          const updatedUser = await authApi.updateProfile(data);
          set({ user: updatedUser.data });
          toast.success("Profile updated successfully!");
        } catch (error) {
          console.error("Profile update error:", error);
          toast.error("Failed to update profile");
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
