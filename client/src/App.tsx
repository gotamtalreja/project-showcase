import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/toast';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import StudentDashboard from './pages/student/StudentDashboard';
import UploadProject from './pages/student/UploadProject';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorProjectDetail from './pages/instructor/InstructorProjectDetail';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboard from './pages/admin/AdminDashboard';

const AppRoutes: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />

            {/* Auth Routes */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'student' ? '/dashboard' : '/instructor/dashboard'} replace /> : <LoginPage />}
            />
            <Route
                path="/signup"
                element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'student' ? '/dashboard' : '/instructor/dashboard'} replace /> : <SignupPage />}
            />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* Student Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/upload-project"
                element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <UploadProject />
                    </ProtectedRoute>
                }
            />

            {/* Instructor Routes */}
            <Route
                path="/instructor/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['instructor']}>
                        <InstructorDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/instructor/projects/:id"
                element={
                    <ProtectedRoute allowedRoles={['instructor']}>
                        <InstructorProjectDetail />
                    </ProtectedRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <ToastProvider>
                        <AppRoutes />
                    </ToastProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
