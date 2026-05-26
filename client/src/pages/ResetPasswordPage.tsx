import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';
import { useToast } from '../components/ui/toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { authAPI } from '../api/auth.api';

const ResetPasswordPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showToast('error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            showToast('error', 'Password must be at least 6 characters');
            return;
        }

        if (!token) {
            showToast('error', 'Invalid reset token');
            return;
        }

        setIsLoading(true);

        try {
            const result = await authAPI.resetPassword(token, password);
            setResetSuccess(true);
            showToast('success', result.message);
        } catch (error: any) {
            showToast('error', error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    if (resetSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Card className="glass shadow-glow">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full w-fit">
                                <CheckCircle className="h-10 w-10 text-white" />
                            </div>
                            <CardTitle className="text-2xl">Password Reset Successful!</CardTitle>
                            <CardDescription className="mt-2">
                                Your password has been updated successfully.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button className="w-full" onClick={() => navigate('/login')}>
                                Go to Login
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

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
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl">Reset Password</CardTitle>
                        <CardDescription>Enter your new password below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    New Password
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

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-muted-foreground">
                            Remember your password?{' '}
                            <Link to="/login" className="text-primary font-medium hover:underline">
                                Login
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
