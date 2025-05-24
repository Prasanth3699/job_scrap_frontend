import { api } from "./axios-instance";
import {
  ApiResponse,
  User,
  AdminRegistrationData,
  UserManagement,
} from "@/types";

// interface LoginResponse {
//   access_token: string;
//   token_type: string;
// }

interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
}

export const authApi = {
  setAuthToken: (token: string | null) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  },

  refreshToken: async (): Promise<ApiResponse<{ access_token: string }>> => {
    // no body required – cookie is sent automatically
    return await api.post("/auth/refresh");
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ access_token: string; user: User }>> => {
    const response = await api.post("/auth/login", credentials);

    // Set the auth token in axios instance
    if (response.access_token) {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.access_token}`;
    }

    return response;
  },

  registerAdmin: async (
    data: AdminRegistrationData
  ): Promise<ApiResponse<User>> => {
    return await api.post("/auth/admin/register", data);
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<RegisterResponse> => {
    return await api.post("/auth/register", userData);
  },

  postLogout: async () => {
    return await api.post("/auth/logout");
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    return await api.get("/auth/me");
  },

  getAllUsers: async (params: {
    page: number;
    limit: number;
  }): Promise<ApiResponse<UserManagement>> => {
    return await api.get("/admin/users", { params });
  },

  updateUserStatus: async (
    userId: string,
    isActive: boolean
  ): Promise<ApiResponse<User>> => {
    return await api.put(`/admin/users/${userId}/status`, {
      is_active: isActive,
    });
  },

  updateProfile: async (data: Partial<User>) => {
    return await api.put("/auth/profile", data);
  },
};
