import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import ProjectCard from '../../components/common/ProjectCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { projectAPI, Project } from '../../api/project.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/toast';

const InstructorDashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await projectAPI.getInstructorProjects();
            setProjects(data);
        } catch (error: any) {
            showToast('error', 'Failed to load assigned projects');
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
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">Welcome back, Professor {user?.name}!</h1>
                        <p className="text-muted-foreground">Review and provide feedback on assigned projects</p>
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Assigned Projects
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{projects.length}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Feedback Provided
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">
                                    {projects.filter((p) => p.instructorFeedback).length}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Pending Review
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">
                                    {projects.filter((p) => !p.instructorFeedback).length}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Projects */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Assigned Projects</h2>
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
                                        <ProjectCard
                                            project={project}
                                            to={`/instructor/projects/${project._id}`}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={<FolderOpen className="h-16 w-16" />}
                                title="No assigned projects"
                                description="No projects have been assigned to you yet"
                            />
                        )}
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default InstructorDashboard;
