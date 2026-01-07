import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "warehouse" | "operations";
  location: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithSSO: () => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "@mobile_grn_auth";

const MOCK_USER: User = {
  id: "usr_001",
  name: "John Smith",
  email: "john.smith@company.com",
  role: "warehouse",
  location: "Warehouse A - Building 1",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (email && password.length >= 4) {
        const loggedInUser: User = {
          ...MOCK_USER,
          email: email,
        };
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const loginWithSSO = async (): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(MOCK_USER));
      setUser(MOCK_USER);
      return true;
    } catch (error) {
      console.error("SSO login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithSSO,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
