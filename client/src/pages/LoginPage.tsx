import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import GoogleAuthButton from '../components/common/GoogleAuthButton';
import { authAPI } from '../api/auth.api';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleResendVerification = async () => {
        setIsResending(true);
        try {
            const result = await authAPI.resendVerification(email);
            showToast('success', result.message);
        } catch (error: any) {
            showToast('error', error.response?.data?.message || 'Failed to resend verification email');
        } finally {
            setIsResending(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setNeedsVerification(false);

        try {
            await login({ email, password });
            showToast('success', 'Login successful!');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            navigate(user.role === 'admin' ? '/admin/dashboard' : user.role === 'student' ? '/dashboard' : '/instructor/dashboard');
        } catch (error: any) {
            if ((error as any).needsVerification) {
                setNeedsVerification(true);
                showToast('error', 'Please verify your email before logging in');
            } else if ((error as any).pendingApproval) {
                showToast('error', error.message || 'Your instructor account is pending admin approval.');
            } else {
                showToast('error', error.message || 'Login failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="glass shadow-glow">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full w-fit">
                            <LogIn className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl">Welcome Back</CardTitle>
                        <CardDescription>Login to your account to continue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@iba-suk.edu.pk"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </Button>

                            {needsVerification && (
                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 p-4 text-center space-y-2">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        Your email is not verified yet. Please check your inbox.
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResendVerification}
                                        disabled={isResending}
                                    >
                                        {isResending ? (
                                            <>
                                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                                Resending...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="mr-2 h-3 w-3" />
                                                Resend Verification Email
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                            {/* <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div> */}

                            <div className="flex justify-center">
                                {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                                    <GoogleAuthButton text="Sign in with Google" />
                                )}
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary font-medium hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginPage;
