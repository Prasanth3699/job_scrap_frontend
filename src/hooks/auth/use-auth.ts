import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "@/lib/api/";
import { toast } from "sonner";
import { ApiError, User } from "@/types";
import { security } from "@/lib/core/security/security-service";

/**
 * The Zustand auth store
 * ------------------------------------------------------------------
 * - Access‐token is stored (encrypted) in localStorage via SecurityService
 * - Refresh‐token lives in a secure http-only cookie => JS cannot touch it
 * - No js-cookie dependency any more
 */
interface AuthState {
  /* ------------- state ------------- */
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isAdmin: boolean;

  /* ------------- actions ------------- */
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
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      /* ------------------------------------------------------- */
      /* state                                                  */
      /* ------------------------------------------------------- */
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isInitialized: false,
      isAdmin: false,

      /* ------------------------------------------------------- */
      /* actions                                                */
      /* ------------------------------------------------------- */

      /**
       * Runs once on app start.
       * 1. Restores access-token from SecurityService
       * 2. Fetches current user from the API
       * 3. Tries to refresh the token if it is about to expire
       */
      initialize: async () => {
        const token = security.getToken();

        if (token) {
          try {
            authService.setAuthToken(token);
            const user = await authService.getProfile();

            set({
              token,
              user,
              isAuthenticated: true,
              isInitialized: true,
              isAdmin: user.is_admin,
            });

            // Make sure the token is fresh right after boot
            await security.refreshTokenIfNeeded();
          } catch (error) {
            console.error("Failed to initialize auth:", error);
            set({ isInitialized: true });
            get().logout();
          }
        } else {
          set({ isInitialized: true });
        }
      },

      /**
       * Register a regular user and log in immediately afterwards.
       */
      register: async (name, email, password) => {
        try {
          set({ isLoading: true });

          const { id } = await authService.register({ name, email, password });
          if (!id) return false;

          const { access_token, user } = await authService.login({
            email,
            password,
          });

          if (access_token) {
            security.setToken(access_token);
            authService.setAuthToken(access_token);

            // helper cookie visible to middleware
            document.cookie =
              "access_token=" +
              access_token +
              "; Path=/; SameSite=Strict; Secure";
            set({
              token: access_token,
              user,
              isAuthenticated: true,
              isInitialized: true,
              isAdmin: user.is_admin,
            });

            toast.success("Registration successful!");
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

      /**
       * Register an admin (no auto-login for security reasons).
       */
      registerAdmin: async (name, email, password, adminSecretKey) => {
        try {
          set({ isLoading: true });

          const { id } = await authService.registerAdmin({
            name,
            email,
            password,
            admin_secret_key: adminSecretKey,
          });

          if (id) {
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

      /**
       * Log in and store the access-token.
       */
      login: async (email, password) => {
        try {
          set({ isLoading: true });

          const { access_token, user } = await authService.login({
            email,
            password,
          });

          if (access_token) {
            // Store token in security service
            security.setToken(access_token);

            // Set the token in auth API
            authService.setAuthToken(access_token);

            // Store a helper cookie for middleware
            document.cookie = `access_token=${access_token}; Path=/; SameSite=Strict; Secure; Max-Age=${
              60 * 15
            }`; // 15 minutes

            set({
              token: access_token,
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

      /**
       * Clears stored token and redirects to the login page.
       */
      logout: async () => {
        try {
          await authService.postLogout();
        } catch (_) {
          /* ignore network errors – still remove local data */
        }

        /* clear local / session storage */
        security.clearAllTokens();
        authService.setAuthToken(null);

        /* remove helper cookie that middleware reads */
        document.cookie =
          "access_token=; Path=/; Max-Age=0; SameSite=Strict; Secure";

        /* reset Zustand state */
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });

        /* redirect AFTER cookies are gone */
        window.location.href = "/login";
      },
      /**
       * Update user profile (name / email etc.).
       */
      updateProfile: async (data) => {
        try {
          set({ isLoading: true });
          const updatedUser = await authService.updateProfile(data);
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
      skipHydration: true, // hydration done manually in initialize()
    }
  )
);

/* -----------------------------------------------------------
   Helper: display API errors in a toast
----------------------------------------------------------- */
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
