import apiClient, { getErrorMessage } from './api';
import { AuthResponse, User } from './types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  uid: string;
  token: string;
  new_password: string;
  new_password2: string;
}

// Authentication API
export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register/', data);
      // Store tokens
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
      }
      // Store user data
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<any>('/auth/login/', credentials);
      const data = response.data;
      
      // Handle both response formats: {access, refresh, user} or {tokens: {access, refresh}, user}
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      let userData: User | null = null;

      if (data.tokens) {
        // Format: {tokens: {access, refresh}, user}
        accessToken = data.tokens.access;
        refreshToken = data.tokens.refresh;
        userData = data.user;
      } else if (data.access && data.refresh) {
        // Format: {access, refresh, user}
        accessToken = data.access;
        refreshToken = data.refresh;
        userData = data.user;
      }

      // Store tokens
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      
      // Store user data
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }

      // Return in consistent format
      return {
        user: userData!,
        tokens: {
          access: accessToken!,
          refresh: refreshToken!,
        },
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout/');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get<User>('/auth/user/');
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    try {
      const response = await apiClient.put<User>('/auth/user/', data);
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    try {
      const response = await apiClient.post<{ access: string }>('/auth/token/refresh/', {
        refresh: refreshToken,
      });
      localStorage.setItem('access_token', response.data.access);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  // Get stored user
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Request password reset
  requestPasswordReset: async (data: PasswordResetRequest): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/password/reset/', {
        email: data.email,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Confirm password reset
  confirmPasswordReset: async (data: PasswordResetConfirm): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/password/reset/confirm/', {
        uid: data.uid,
        token: data.token,
        new_password: data.new_password,
        new_password2: data.new_password2,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};



