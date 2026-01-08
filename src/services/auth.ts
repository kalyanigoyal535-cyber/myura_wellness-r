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

export interface GoogleLoginData {
  credential: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/user/register/', data);
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<any>('/user/login/', credentials);
      const data = response.data;

      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      let userData: User | null = null;

      if (data.tokens) {
        accessToken = data.tokens.access;
        refreshToken = data.tokens.refresh;
        userData = data.user;
      } else if (data.access && data.refresh) {
        accessToken = data.access;
        refreshToken = data.refresh;
        userData = data.user;
      }

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }

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

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/user/logout/');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get<User>('/user/profile/');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    try {
      const response = await apiClient.put<User>('/user/profile/', data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

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

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

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

  requestPasswordReset: async (data: PasswordResetRequest): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/user/password/reset/', {
        email: data.email,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  confirmPasswordReset: async (data: PasswordResetConfirm): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/user/password/reset/confirm/', {
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

  googleLogin: async (data: GoogleLoginData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/user/google-login/', data);
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};



