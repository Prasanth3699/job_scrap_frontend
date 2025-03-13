import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authApi } from "@/lib/api/auth-api";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { ApiError, User } from "@/types";
import { security } from "@/lib/core/security/security-service";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isAdmin: boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
  initialize: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  registerAdmin: (
    name: string,
    email: string,
    password: string,
    adminSecretKey: string
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isInitialized: false,
      isAdmin: false,

      initialize: async () => {
        const token =
          security.getToken() ||
          localStorage.getItem("token") ||
          Cookies.get("token");

        if (token) {
          try {
            authApi.setAuthToken(token);
            const user = await authApi.getProfile();
            set({
              token,
              user,
              isAuthenticated: true,
              isInitialized: true,
              isAdmin: user.is_admin,
            });
          } catch (error) {
            console.error("Failed to initialize auth:", error);
            set({ isInitialized: true });
            get().logout();
          }
        } else {
          set({ isInitialized: true });
        }
      },

      // register: async (name, email, password) => {
      //   try {
      //     set({ isLoading: true });
      //     const response = await authApi.register({ name, email, password });
      //     if (response.id) {
      //       toast.success("Registration successful! Please login.");
      //       return true;
      //     }
      //     return false;
      //   } catch (error) {
      //     handleAuthError(error);
      //     return false;
      //   } finally {
      //     set({ isLoading: false });
      //   }
      // },

      register: async (name, email, password) => {
        try {
          set({ isLoading: true });
          const response = await authApi.register({ name, email, password });
          if (response.id) {
            // Automatically log in the user after registration
            const loginResponse = await authApi.login({ email, password });

            if (loginResponse.access_token) {
              const token = loginResponse.access_token;
              const user = loginResponse.user;

              // Use security service to store token
              security.setToken(token);

              Cookies.set("token", token, { expires: 7 });
              authApi.setAuthToken(token);

              set({
                token,
                user,
                isAuthenticated: true,
                isInitialized: true,
                isAdmin: user.is_admin,
              });

              toast.success("Registration successful!");
              return true;
            }
          }
          return false;
        } catch (error) {
          handleAuthError(error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      registerAdmin: async (name, email, password, adminSecretKey) => {
        try {
          set({ isLoading: true });
          const response = await authApi.registerAdmin({
            name,
            email,
            password,
            admin_secret_key: adminSecretKey,
          });

          if (response.id) {
            toast.success("Admin registration successful! Please login.");
            return true;
          }
          return false;
        } catch (error) {
          handleAuthError(error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      login: async (email, password) => {
        try {
          set({ isLoading: true });
          const response = await authApi.login({ email, password });

          if (response.access_token) {
            const token = response.access_token;
            const user = response.user;

            // Use security service to store token
            security.setToken(token); // Changed this line

            Cookies.set("token", token, { expires: 7 });
            authApi.setAuthToken(token);

            set({
              token,
              user,
              isAuthenticated: true,
              isInitialized: true,
              isAdmin: user.is_admin,
            });

            toast.success("Login successful!");
            return true;
          }
          return false;
        } catch (error) {
          handleAuthError(error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        security.clearAllTokens();
        Cookies.remove("token");
        authApi.setAuthToken(null);
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
        window.location.href = "/login";
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true });
          const updatedUser = await authApi.updateProfile(data);
          set({ user: updatedUser });
          toast.success("Profile updated successfully!");
        } catch (error) {
          handleAuthError(error);
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

// Helper function to handle auth errors
const handleAuthError = (error: unknown) => {
  console.error("Auth error:", error);
  if ((error as ApiError).response?.data?.detail) {
    toast.error((error as ApiError).response!.data!.detail);
  } else if ((error as ApiError).message) {
    toast.error((error as ApiError).message);
  } else {
    toast.error("An unexpected error occurred");
  }
};
