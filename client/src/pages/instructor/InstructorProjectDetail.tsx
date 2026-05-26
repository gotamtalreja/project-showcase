import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag, Youtube, ExternalLink, MessageSquare, Loader2, Save } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { projectAPI, Project } from '../../api/project.api';
import { useToast } from '../../components/ui/toast';
import { formatDate, getYouTubeEmbedUrl } from '../../lib/utils';

const InstructorProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [feedback, setFeedback] = useState('');
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchProject(id);
        }
    }, [id]);

    const fetchProject = async (projectId: string) => {
        try {
            const data = await projectAPI.getProjectById(projectId);
            setProject(data);
            setFeedback(data.instructorFeedback || '');
        } catch (error: any) {
            showToast('error', 'Failed to load project details');
            navigate('/instructor/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveFeedback = async () => {
        if (!id || !feedback.trim()) {
            showToast('error', 'Please enter feedback');
            return;
        }

        setIsSaving(true);

        try {
            await projectAPI.addFeedback(id, feedback);
            showToast('success', 'Feedback saved successfully!');
            await fetchProject(id);
            setShowFeedbackForm(false);
        } catch (error: any) {
            showToast('error', error.response?.data?.message || 'Failed to save feedback');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            </Layout>
        );
    }

    if (!project) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
                        <Link to="/instructor/dashboard">
                            <Button>Back to Dashboard</Button>
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/instructor/dashboard">
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold mb-4">{project.projectName}</h1>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        {project.studentId?.name || 'Unknown Student'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(project.createdAt)}
                                    </div>
                                </div>
                            </div>

                            {/* YouTube Video */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Youtube className="h-5 w-5 text-red-500" />
                                        Project Demo
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="aspect-video">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={getYouTubeEmbedUrl(project.youtubeLink)}
                                            title="Project Demo"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="rounded-lg"
                                        ></iframe>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Project Links */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Project Resources</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <a
                                        href={project.descriptionLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-primary hover:underline"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        Project Description / Repository
                                    </a>
                                    <a
                                        href={project.youtubeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-primary hover:underline"
                                    >
                                        <Youtube className="h-4 w-4" />
                                        Watch on YouTube
                                    </a>
                                </CardContent>
                            </Card>

                            {/* Feedback Section */}
                            {!showFeedbackForm ? (
                                <Card className="border-primary/50">
                                    <CardContent className="py-6">
                                        {project.instructorFeedback ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                                        <MessageSquare className="h-5 w-5 text-primary" />
                                                        Your Feedback
                                                    </h3>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setShowFeedbackForm(true)}
                                                    >
                                                        Edit Feedback
                                                    </Button>
                                                </div>
                                                <p className="text-muted-foreground whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                                                    {project.instructorFeedback}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold mb-2">No Feedback Yet</h3>
                                                <p className="text-muted-foreground mb-4">
                                                    Help the student by providing constructive feedback
                                                </p>
                                                <Button
                                                    onClick={() => setShowFeedbackForm(true)}
                                                    className="shadow-glow"
                                                >
                                                    <MessageSquare className="mr-2 h-4 w-4" />
                                                    Give Feedback
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-primary/50">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <MessageSquare className="h-5 w-5" />
                                                {project.instructorFeedback ? 'Edit Feedback' : 'Provide Feedback'}
                                            </CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setShowFeedbackForm(false);
                                                    setFeedback(project.instructorFeedback || '');
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Textarea
                                            placeholder="Enter your feedback here (visible to everyone)..."
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            rows={6}
                                            className="resize-none"
                                        />
                                        <Button onClick={handleSaveFeedback} disabled={isSaving} className="w-full">
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Feedback
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Project Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium mb-1">Subject</p>
                                        <p className="text-muted-foreground">{project.subject}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium mb-2 flex items-center gap-1">
                                            <Tag className="h-3 w-3" />
                                            Technologies Used
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium mb-2">Group Members</p>
                                        <ul className="space-y-1">
                                            {project.groupMembers.map((member, index) => (
                                                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <User className="h-3 w-3" />
                                                    {member}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default InstructorProjectDetail;
