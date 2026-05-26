import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { authAPI } from '../api/auth.api';

const SignupPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student' as 'student' | 'instructor',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const { signup } = useAuth();
    const { showToast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            showToast('error', 'Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            showToast('error', 'Password must be at least 6 characters');
            return;
        }

        if (!formData.email.toLowerCase().endsWith('@iba-suk.edu.pk')) {
            showToast('error', 'Only IBA-SUK university emails (@iba-suk.edu.pk) are allowed');
            return;
        }

        setIsLoading(true);

        try {
            const result = await signup({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });

            if (result.needsVerification) {
                setEmailSent(true);
                showToast('success', result.message);
            }
        } catch (error: any) {
            showToast('error', error.message || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setIsResending(true);
        try {
            const result = await authAPI.resendVerification(formData.email);
            showToast('success', result.message);
        } catch (error: any) {
            showToast('error', error.response?.data?.message || 'Failed to resend verification email');
        } finally {
            setIsResending(false);
        }
    };

    // Show success state after signup
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
                                We've sent a verification link to
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="font-semibold text-primary text-lg">{formData.email}</p>
                            <p className="text-sm text-muted-foreground">
                                Click the link in the email to verify your account. The link expires in 24 hours.
                            </p>
                            <div className="pt-4 space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleResendVerification}
                                    disabled={isResending}
                                >
                                    {isResending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Resending...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Resend Verification Email
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <p className="text-sm text-muted-foreground">
                                Already verified?{' '}
                                <Link to="/login" className="text-primary font-medium hover:underline">
                                    Login
                                </Link>
                            </p>
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
                            <UserPlus className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl">Create Account</CardTitle>
                        <CardDescription>Join our community of students and instructors</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@iba-suk.edu.pk"
                                        value={formData.email}
                                        onChange={handleChange}
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
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="role" className="text-sm font-medium">
                                    I am a
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="student">Student</option>
                                    <option value="instructor">Instructor</option>
                                </select>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    'Sign Up'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
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

export default SignupPage;
