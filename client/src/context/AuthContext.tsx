import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, LoginData, SignupData } from '../api/auth.api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginData) => Promise<void>;
    signup: (data: SignupData) => Promise<{ needsVerification: boolean; message: string }>;
    googleLogin: (token: string, role?: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setIsLoading(false);
    }, []);

    const login = async (data: LoginData) => {
        try {
            const response = await authAPI.login(data);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setToken(token);
            setUser(user);
        } catch (error: any) {
            const errorData = error.response?.data;
            if (errorData?.needsVerification) {
                const err = new Error(errorData.message || 'Please verify your email');
                (err as any).needsVerification = true;
                (err as any).email = errorData.email;
                throw err;
            }
            if (errorData?.pendingApproval) {
                const err = new Error(errorData.message || 'Account pending admin approval');
                (err as any).pendingApproval = true;
                throw err;
            }
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const signup = async (data: SignupData): Promise<{ needsVerification: boolean; message: string }> => {
        try {
            const response = await authAPI.signup(data);
            return {
                needsVerification: response.needsVerification || false,
                message: response.message
            };
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Signup failed');
        }
    };

    const googleLogin = async (token: string, role?: string) => {
        try {
            const response = await authAPI.googleLogin(token, role);
            const { token: jwtToken, user } = response.data;

            localStorage.setItem('token', jwtToken);
            localStorage.setItem('user', JSON.stringify(user));

            setToken(jwtToken);
            setUser(user);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Google login failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        signup,
        googleLogin,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
