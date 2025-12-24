import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import api from "../services/api";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const tokenRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if JWT token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp;
    } catch {
      return true; // If we can't parse, consider it expired
    }
  };

  // Refresh token if needed (before expiration)
  const refreshTokenIfNeeded = async () => {
    const token = sessionStorage.getItem("access_token");
    const refreshToken = sessionStorage.getItem("refresh_token");

    if (!token || !refreshToken) {
      return;
    }

    // Check if token expires in less than 1 hour
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      const timeUntilExpiry = exp - Date.now();

      // If token expires in less than 1 hour, refresh it
      if (timeUntilExpiry < 60 * 60 * 1000) {
        try {
          const response = await api.post<{ access: string }>(
            "/auth/token/refresh",
            {
              refresh: refreshToken,
            }
          );
          sessionStorage.setItem("access_token", response.data.access);
        } catch (error) {
          // Refresh failed, clear session
          sessionStorage.removeItem("access_token");
          sessionStorage.removeItem("refresh_token");
          setUser(null);
          window.location.href = "/login";
        }
      }
    } catch {
      // Token parsing failed, clear session
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      setUser(null);
    }
  };

  const checkAuth = async (retryCount = 0) => {
    const token = sessionStorage.getItem("access_token");
    const refreshToken = sessionStorage.getItem("refresh_token");

    if (!token) {
      setLoading(false);
      return;
    }

    // Prevent infinite recursion
    if (retryCount > 1) {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      setUser(null);
      setLoading(false);
      return;
    }

    // Check if token is expired - try to refresh first
    if (isTokenExpired(token)) {
      // Try to refresh the token
      if (refreshToken) {
        try {
          const response = await api.post<{ access: string }>(
            "/auth/token/refresh",
            { refresh: refreshToken }
          );
          sessionStorage.setItem("access_token", response.data.access);
          // Retry with new token (increment retry count)
          return checkAuth(retryCount + 1);
        } catch (refreshError) {
          // Refresh failed, clear session
          sessionStorage.removeItem("access_token");
          sessionStorage.removeItem("refresh_token");
          setUser(null);
          setLoading(false);
          return;
        }
      } else {
        // No refresh token, clear session
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        setUser(null);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await api.get<User>("/auth/user");
      if (response.data) {
        const userData = response.data;
        // Only allow admins
        const isAdmin =
          userData.is_staff === true || userData.is_superuser === true;

        if (isAdmin) {
          setUser(userData);
        } else {
          sessionStorage.removeItem("access_token");
          sessionStorage.removeItem("refresh_token");
          setUser(null);
        }
      } else {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        setUser(null);
      }
    } catch (error: any) {
      // If 401, try to refresh token
      if (error.response?.status === 401 && refreshToken && retryCount === 0) {
        try {
          const response = await api.post<{ access: string }>(
            "/auth/token/refresh",
            { refresh: refreshToken }
          );
          sessionStorage.setItem("access_token", response.data.access);
          // Retry with new token (increment retry count)
          return checkAuth(retryCount + 1);
        } catch (refreshError) {
          // Refresh failed, clear session
          sessionStorage.removeItem("access_token");
          sessionStorage.removeItem("refresh_token");
          setUser(null);
        }
      } else {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Set up token refresh interval (check every 30 minutes)
    tokenRefreshIntervalRef.current = setInterval(() => {
      refreshTokenIfNeeded();
    }, 30 * 60 * 1000); // 30 minutes

    // Handle page visibility change (when user switches tabs or minimizes)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away
      } else {
        // User came back, verify token is still valid
        checkAuth();
      }
    };

    // Use pagehide event to detect actual tab close (not refresh)
    // sessionStorage persists on refresh but we can detect tab close
    const handlePageHide = (e: PageTransitionEvent) => {
      // Only clear if it's a page unload (not a page transition/refresh)
      // persisted property indicates if page is being cached (refresh) or unloaded (close)
      if (e.persisted === false) {
        // This might be a tab close, but we'll keep sessionStorage
        // sessionStorage will automatically clear when tab closes
        // We don't manually clear here to allow refresh to work
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      if (tokenRefreshIntervalRef.current) {
        clearInterval(tokenRefreshIntervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{
        access: string;
        refresh: string;
        user: User;
      }>("/auth/login", { email, password });

      const { access, refresh, user: userData } = response.data;

      // Only allow admins to login
      const isAdmin =
        userData.is_staff === true || userData.is_superuser === true;

      if (!isAdmin) {
        throw new Error("Access denied. Admin privileges required.");
      }

      sessionStorage.setItem("access_token", access);
      sessionStorage.setItem("refresh_token", refresh);
      setUser(userData);

      // Schedule token refresh check
      if (tokenRefreshIntervalRef.current) {
        clearInterval(tokenRefreshIntervalRef.current);
      }
      tokenRefreshIntervalRef.current = setInterval(() => {
        refreshTokenIfNeeded();
      }, 30 * 60 * 1000); // Check every 30 minutes

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.detail ||
          error.message ||
          "Login failed",
      };
    }
  };

  const logout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    setUser(null);

    // Clear token refresh interval
    if (tokenRefreshIntervalRef.current) {
      clearInterval(tokenRefreshIntervalRef.current);
      tokenRefreshIntervalRef.current = null;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
