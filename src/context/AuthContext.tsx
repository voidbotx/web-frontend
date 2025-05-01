"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    user: any; 
    error: string | null;
    register: (userData: any) => Promise<boolean>; 
    login: (userData: any) => Promise<boolean>; 
    logout: () => void;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null); // Replace with your user type
    const [token, setToken] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem("token") : null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = "http://localhost:5000/api";

    // Set axios default header
    if (token) {
        axios.defaults.headers.common["x-auth-token"] = token;
    } else {
        delete axios.defaults.headers.common["x-auth-token"];
    }

    // Load user
    const loadUser = async () => {
        if (token) {
            try {
                const res = await axios.get(`${API_URL}/users/me`);
                setUser(res.data);
                setIsAuthenticated(true);
            } catch (err) {
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
                const error = err as any; // Explicitly cast 'err' to 'any' or a specific error type
                setError(error.response?.data?.message || "Authentication failed");
            }
        }
        setIsLoading(false);
    };

    // Register user
    const register = async (userData: any) => {
        try {
            const res = await axios.post(`${API_URL}/auth/register`, userData);
            localStorage.setItem("token", res.data.token);
            setToken(res.data.token);
            await loadUser();
            return true;
        } catch (err) {
            setError((err as any).response?.data?.message || "Registration failed");
            return false;
        }
    };

    // Login user
    const login = async (userData: any) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, userData);
            localStorage.setItem("token", res.data.token);
            setToken(res.data.token);
            await loadUser();
            return true;
        } catch (err) {
            const error = err as any; // Explicitly cast 'err' to 'any' or a specific error type
            setError(error.response?.data?.message || "Login failed");
            return false;
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    // Clear errors
    const clearError = () => setError(null);

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated,
                isLoading,
                user,
                error,
                register,
                login,
                logout,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
