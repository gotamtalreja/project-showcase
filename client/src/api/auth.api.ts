import api from './api';

export interface SignupData {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'instructor';
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    };
}

export interface SignupResponse {
    success: boolean;
    message: string;
    needsVerification: boolean;
}

export interface VerifyEmailResponse {
    success: boolean;
    message: string;
}

export interface Instructor {
    _id: string;
    name: string;
    email: string;
}

export const authAPI = {
    signup: async (data: SignupData): Promise<SignupResponse> => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    googleLogin: async (token: string, role?: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/google', { token, role });
        return response.data;
    },

    getInstructors: async (): Promise<Instructor[]> => {
        const response = await api.get('/auth/instructors');
        return response.data.data;
    },

    verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
        const response = await api.get(`/auth/verify-email/${token}`);
        return response.data;
    },

    resendVerification: async (email: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.post('/auth/resend-verification', { email });
        return response.data;
    },

    forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token: string, password: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.post(`/auth/reset-password/${token}`, { password });
        return response.data;
    },

    // Admin: instructor approval
    getPendingInstructors: async (): Promise<{ _id: string; name: string; email: string; createdAt: string }[]> => {
        const response = await api.get('/auth/admin/pending-instructors');
        return response.data.data;
    },

    approveInstructor: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.put(`/auth/admin/approve-instructor/${id}`);
        return response.data;
    },

    rejectInstructor: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.delete(`/auth/admin/reject-instructor/${id}`);
        return response.data;
    },
};
