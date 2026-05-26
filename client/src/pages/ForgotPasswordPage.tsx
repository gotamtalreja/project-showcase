import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '../components/ui/toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { authAPI } from '../api/auth.api';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await authAPI.forgotPassword(email);
            setEmailSent(true);
            showToast('success', result.message);
        } catch (error: any) {
            showToast('error', error.response?.data?.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
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
                            <CardTitle className="text-2xl">Check Your Email</CardTitle>
                            <CardDescription className="mt-2">
                                We've sent a password reset link to
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="font-semibold text-primary text-lg">{email}</p>
                            <p className="text-sm text-muted-foreground">
                                Click the link in the email to reset your password. The link expires in 1 hour.
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Link to="/login" className="text-primary font-medium hover:underline text-sm">
                                ← Back to Login
                            </Link>
                        </CardFooter>
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
                            <KeyRound className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl">Forgot Password?</CardTitle>
                        <CardDescription>
                            Enter your email and we'll send you a link to reset your password
                        </CardDescription>
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

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link to="/login" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="h-3 w-3" />
                            Back to Login
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
