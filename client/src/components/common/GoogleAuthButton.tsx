import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/toast';
import { useNavigate } from 'react-router-dom';

interface GoogleAuthButtonProps {
    text: string;
    role?: 'student' | 'instructor';
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ text, role }) => {
    const { googleLogin } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);

    const googleLoginFlow = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setIsLoading(true);
                // If role is provided (signup), pass it. If not (login), it's undefined.
                await googleLogin(tokenResponse.access_token, role);
                showToast('success', role ? 'Account created successfully!' : 'Login successful!');

                // Get updated user from local storage or wait for context? 
                // Context update is usually fast enough, but let's check localStorage for safety or just redirect
                // Ideally prompt user or check context, but for now redirecting based on role
                // We don't know the role for LOGIN here easily unless we parse the token or response
                // But the googleLogin function in context should handle setting the user.

                // Hack: We need to know where to navigate. 
                // The context `googleLogin` function should probably return the user.
                // But for now, let's assume successful login updates localStorage.
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;

                if (user) {
                    navigate(user.role === 'student' ? '/dashboard' : '/instructor/dashboard');
                } else {
                    // Fallback if local storage isn't ready immediately (rare but possible)
                    navigate('/dashboard');
                }

            } catch (error: any) {
                showToast('error', error.message || 'Google authentication failed');
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            showToast('error', 'Google Authentication Failed');
            setIsLoading(false);
        }
    });

    return (
        <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => googleLoginFlow()}
            disabled={isLoading}
        >
            <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                <path
                    d="M12.0003 20.41c1.65 0 3.3-.42 4.67-1.18 1.34-.73 2.45-1.92 3.23-3.32l-1.98-1.14c-.58 1.05-1.4 1.94-2.4 2.49-1.02.56-2.22.88-3.52.88-2.6 0-4.83-1.63-5.64-3.92H4.17028v1.89c1.67 3.32 5.12 5.59 9.15002 5.59z"
                    fill="#34A853"
                />
                <path
                    d="M6.36029 14.22c-.22-.66-.34-1.37-.34-2.11 0-.74.12-1.45.34-2.11V8.11003h-2.18c-.89 1.76-1.39 3.73-1.39 5.8 0 2.07.5 4.04 1.39 5.8l2.18-1.9z"
                    fill="#FBBC05"
                />
                <path
                    d="M12.0003 7.37996c1.37 0 2.6.46 3.58 1.22l1.9-1.9c-1.52-1.41-3.51-2.2-5.48-2.2-3.83002 0-7.14002 2.1-8.79002 5.18l2.18 1.89c.81-2.28 3.03-3.91 5.61-3.91z"
                    fill="#EA4335"
                />
                <path
                    d="M21.5703 11.23c.12.72.19 1.47.19 2.25 0 .78-.07 1.53-.19 2.25h-9.57v-4.5h9.57z"
                    fill="#4285F4"
                />
            </svg>
            {text}
        </Button>
    );
};

export default GoogleAuthButton;
