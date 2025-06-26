"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  authAPI,
  User,
  LoginCredentials,
  SignupCredentials,
  UpdateUserData,
} from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateUserData) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const isAuthenticated = !!user;

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authAPI.isAuthenticated()) {
          // Try to get stored user first
          const storedUser = authAPI.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          }

          // Fetch fresh user data
          try {
            const currentUser = await authAPI.getCurrentUser();
            setUser(currentUser);
            authAPI.setStoredUser(currentUser);
          } catch (error) {
            console.error("Failed to fetch current user:", error);
            // If fetching user fails, clear everything and redirect to login
            authAPI.clearStoredUser();
            await authAPI.logout();
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear invalid tokens
        authAPI.clearStoredUser();
        await authAPI.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [router]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(credentials);
      const currentUser = await authAPI.getCurrentUser();

      setUser(currentUser);
      authAPI.setStoredUser(currentUser);

      toast({
        variant: "success",
        title: "Login successful",
        description: "Welcome back! You have been successfully logged in.",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description:
          error instanceof Error
            ? error.message
            : "Invalid credentials. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      setIsLoading(true);
      await authAPI.signup(credentials);

      toast({
        variant: "success",
        title: "Account created",
        description:
          "Your account has been successfully created. Please log in.",
      });

      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create account. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authAPI.logout();
      setUser(null);
      authAPI.clearStoredUser();

      toast({
        variant: "default",
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Clear state even if logout fails
      setUser(null);
      authAPI.clearStoredUser();
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateUserData) => {
    try {
      setIsLoading(true);
      const updatedUser = await authAPI.updateProfile(data);
      setUser(updatedUser);
      authAPI.setStoredUser(updatedUser);

      toast({
        variant: "success",
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (authAPI.isAuthenticated()) {
        const currentUser = await authAPI.getCurrentUser();
        setUser(currentUser);
        authAPI.setStoredUser(currentUser);
      }
    } catch (error) {
      console.error("User refresh error:", error);
      // If refresh fails, user might be logged out
      setUser(null);
      authAPI.clearStoredUser();
      await authAPI.logout();
      router.push("/login");
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
