import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// API Base URL - defaults to localhost:8000 for development
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session-based cart (guest users)
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to extract error message
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ 
      error?: string; 
      message?: string; 
      detail?: string;
      [key: string]: any; // For field-specific errors
    }>;
    
    const responseData = axiosError.response?.data;
    
    // Handle field-specific validation errors (e.g., {email: ["This field is required."]})
    if (responseData && typeof responseData === 'object') {
      const fieldErrors: string[] = [];
      for (const [key, value] of Object.entries(responseData)) {
        if (key !== 'error' && key !== 'message' && key !== 'detail') {
          if (Array.isArray(value)) {
            fieldErrors.push(`${key}: ${value.join(', ')}`);
          } else if (typeof value === 'string') {
            fieldErrors.push(`${key}: ${value}`);
          } else if (Array.isArray(value) && value.length > 0) {
            fieldErrors.push(`${key}: ${value[0]}`);
          }
        }
      }
      if (fieldErrors.length > 0) {
        return fieldErrors.join('; ');
      }
    }
    
    return (
      responseData?.error ||
      responseData?.message ||
      responseData?.detail ||
      axiosError.message ||
      'An error occurred'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

