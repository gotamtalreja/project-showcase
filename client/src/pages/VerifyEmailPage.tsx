import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, LogIn } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { authAPI } from '../api/auth.api';

const VerifyEmailPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const hasVerified = useRef(false);

    useEffect(() => {
        const verifyEmail = async () => {
            // Prevent double-call from React Strict Mode
            if (hasVerified.current) return;
            hasVerified.current = true;

            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link');
                return;
            }

            try {
                const response = await authAPI.verifyEmail(token);
                setStatus('success');
                setMessage(response.message);
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link may be expired.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="glass shadow-glow">
                    {status === 'loading' && (
                        <>
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full w-fit">
                                    <Loader2 className="h-10 w-10 text-white animate-spin" />
                                </div>
                                <CardTitle className="text-2xl">Verifying Your Email</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-muted-foreground">Please wait while we verify your email address...</p>
                            </CardContent>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full w-fit">
                                    <CheckCircle className="h-10 w-10 text-white" />
                                </div>
                                <CardTitle className="text-2xl">Email Verified! 🎉</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center space-y-4">
                                <p className="text-muted-foreground">{message}</p>
                                <Link to="/login">
                                    <Button className="w-full mt-4">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Go to Login
                                    </Button>
                                </Link>
                            </CardContent>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-full w-fit">
                                    <XCircle className="h-10 w-10 text-white" />
                                </div>
                                <CardTitle className="text-2xl">Verification Failed</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center space-y-4">
                                <p className="text-muted-foreground">{message}</p>
                            </CardContent>
                            <CardFooter className="flex justify-center gap-4">
                                <Link to="/signup">
                                    <Button variant="outline">Sign Up Again</Button>
                                </Link>
                                <Link to="/login">
                                    <Button>Go to Login</Button>
                                </Link>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default VerifyEmailPage;
