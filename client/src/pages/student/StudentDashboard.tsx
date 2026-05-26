import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FolderOpen } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import ProjectCard from '../../components/common/ProjectCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { projectAPI, Project } from '../../api/project.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/toast';

const StudentDashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await projectAPI.getStudentProjects();
            setProjects(data);
        } catch (error: any) {
            showToast('error', 'Failed to load projects');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                            <p className="text-muted-foreground">Manage your project showcase</p>
                        </div>
                        <Link to="/dashboard/upload-project">
                            <Button className="shadow-glow">
                                <Plus className="mr-2 h-4 w-4" />
                                Upload Project
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Projects
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{projects.length}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-yellow-500/30">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-yellow-400">
                                    Pending Approval
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-yellow-400">
                                    {projects.filter((p) => p.status === 'pending').length}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-green-500/30">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-green-400">
                                    Approved
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-green-400">
                                    {projects.filter((p) => p.status === 'approved').length}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-red-500/30">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-red-400">
                                    Rejected
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-red-400">
                                    {projects.filter((p) => p.status === 'rejected').length}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Projects */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">My Projects</h2>
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <LoadingSpinner size="lg" />
                            </div>
                        ) : projects.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project, index) => (
                                    <motion.div
                                        key={project._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <ProjectCard project={project} showStatus />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={<FolderOpen className="h-16 w-16" />}
                                title="No projects yet"
                                description="Start by uploading your first project"
                                action={
                                    <Link to="/dashboard/upload-project">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Upload Project
                                        </Button>
                                    </Link>
                                }
                            />
                        )}
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default StudentDashboard;
