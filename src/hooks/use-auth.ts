import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { User } from "@/types";

interface AuthResponse {
  access_token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
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
          const data: AuthResponse = response.data;
          if (data?.access_token) {
            const authState = {
              user: data.user,
              token: data.access_token,
              isAuthenticated: true,
            };
            set(authState);

            // Set token in multiple places for security
            localStorage.setItem("token", data.access_token);
            Cookies.set("token", data.access_token, { expires: 7 });

            toast.success("Account created successfully! 🎉");
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

          const data = response.data || response;

          if (data?.access_token) {
            // Match the API response format
            const token = data.access_token;

            set({
              token,
              isAuthenticated: true,
              isInitialized: true,
            });

            // Set token in multiple places
            localStorage.setItem("token", token);
            Cookies.set("token", token, { expires: 7 });

            // Update API headers
            authApi.setAuthToken(token);

            toast.success("Login successful! ✅");
            return true;
          }
          return false;
        } catch (error) {
          console.error("Login error:", error);
          toast.error("Login failed ❌");
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
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
