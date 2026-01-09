import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { User } from "../services/types";
import {
  authApi,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
} from "../services/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  refreshUser: () => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authApi.getStoredUser();
        if (storedUser && authApi.isAuthenticated()) {
          // Verify token is still valid by fetching profile
          try {
            const currentUser = await authApi.getProfile();
            setUser(currentUser);
          } catch (error) {
            // Token invalid, clear auth
            await authApi.logout();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await authApi.register(data);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (error) {
      // Clear local state even if API call fails
      setUser(null);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    try {
      const updatedUser = await authApi.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      if (authApi.isAuthenticated()) {
        const currentUser = await authApi.getProfile();
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, []);

  const googleLogin = useCallback(async (credential: string) => {
    try {
      const response = await authApi.googleLogin({ credential });
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  }, []);

  const sendOTP = useCallback(async (email: string) => {
    try {
      await authApi.sendOTP({ email });
    } catch (error) {
      throw error;
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user && authApi.isAuthenticated(),
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    googleLogin,
    sendOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
