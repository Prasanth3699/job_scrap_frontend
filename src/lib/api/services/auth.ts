import { coreApi } from "../gateway";
import { CORE_ENDPOINTS } from "../endpoints";
import {
  ApiResponse,
  User,
  AdminRegistrationData,
  UserManagement,
} from "@/types";

/**
 * Authentication and user management service
 */
export const authService = {
  /**
   * Set the authentication token in API requests
   */
  setAuthToken: (token: string | null) => {
    if (token) {
      coreApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete coreApi.defaults.headers.common["Authorization"];
    }
  },

  /**
   * Refresh the authentication token
   */
  refreshToken: async (): Promise<ApiResponse<{ access_token: string }>> => {
    return await coreApi.post(CORE_ENDPOINTS.REFRESH_TOKEN);
  },

  /**
   * Log in a user
   */
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ access_token: string; user: User }>> => {
    const response = await coreApi.post(CORE_ENDPOINTS.LOGIN, credentials);
    console.log("Login response:", response);

    // Set the auth token in axios instance
    if (response.access_token) {
      coreApi.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.access_token}`;
    }

    return response;
  },

  /**
   * Register an admin user
   */
  registerAdmin: async (
    data: AdminRegistrationData
  ): Promise<ApiResponse<User>> => {
    return await coreApi.post(CORE_ENDPOINTS.REGISTER_ADMIN, data);
  },

  /**
   * Register a regular user
   */
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{
    id: number;
    name: string;
    email: string;
    is_active: boolean;
  }> => {
    return await coreApi.post(CORE_ENDPOINTS.REGISTER, userData);
  },

  /**
   * Log out the current user
   */
  postLogout: async () => {
    return await coreApi.post(CORE_ENDPOINTS.LOGOUT);
  },

  /**
   * Get the current user's profile
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    return await coreApi.get(CORE_ENDPOINTS.PROFILE);
  },

  /**
   * Get all users (admin only)
   */
  getAllUsers: async (params: {
    page: number;
    limit: number;
  }): Promise<ApiResponse<UserManagement>> => {
    return await coreApi.get(CORE_ENDPOINTS.USERS, { params });
  },

  /**
   * Update a user's active status (admin only)
   */
  updateUserStatus: async (
    userId: string,
    isActive: boolean
  ): Promise<ApiResponse<User>> => {
    return await coreApi.put(CORE_ENDPOINTS.USER_STATUS(userId), {
      is_active: isActive,
    });
  },

  /**
   * Update the current user's profile
   */
  updateProfile: async (data: Partial<User>) => {
    return await coreApi.put(CORE_ENDPOINTS.UPDATE_PROFILE, data);
  },
};
