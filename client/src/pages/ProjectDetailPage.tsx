import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, GraduationCap, Tag, Youtube, ExternalLink, MessageSquare, Heart } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { projectAPI, Project } from '../api/project.api';
import { useToast } from '../components/ui/toast';
import { useAuth } from '../context/AuthContext';
import { formatDate, getYouTubeEmbedUrl } from '../lib/utils';

const ProjectDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [likes, setLikes] = useState<string[]>([]);
    const [isLiking, setIsLiking] = useState(false);
    const { showToast } = useToast();
    const { isAuthenticated, user } = useAuth();

    const hasLiked = isAuthenticated && user ? likes.includes(user.id) : false;

    useEffect(() => {
        if (id) {
            fetchProject(id);
        }
    }, [id]);

    const fetchProject = async (projectId: string) => {
        try {
            const data = await projectAPI.getProjectById(projectId);
            setProject(data);
            setLikes(data.likes || []);
        } catch (error: any) {
            showToast('error', 'Failed to load project details');
        } finally {
            setIsLoading(false);
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
                        <Link to="/projects">
                            <Button>Back to Projects</Button>
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
                    <Link to="/projects">
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Projects
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
                                    <button
                                        onClick={async () => {
                                            if (!isAuthenticated) {
                                                showToast('error', 'Please login to like projects');
                                                return;
                                            }
                                            if (isLiking) return;
                                            setIsLiking(true);
                                            try {
                                                const result = await projectAPI.toggleLike(project._id);
                                                if (result.hasLiked) {
                                                    setLikes((prev) => [...prev, user!.id]);
                                                } else {
                                                    setLikes((prev) => prev.filter((id) => id !== user!.id));
                                                }
                                            } catch (error) {
                                                showToast('error', 'Failed to toggle like');
                                            } finally {
                                                setIsLiking(false);
                                            }
                                        }}
                                        disabled={isLiking}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${hasLiked
                                            ? 'bg-pink-500 text-white border-pink-500 hover:bg-pink-600'
                                            : 'bg-transparent border-input hover:border-pink-500 hover:text-pink-500'
                                            }`}
                                    >
                                        <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                                        {likes.length}
                                    </button>
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

                            {/* Instructor Feedback */}
                            {project.instructorFeedback && (
                                <Card className="border-primary/50 bg-primary/5">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MessageSquare className="h-5 w-5" />
                                            Instructor Feedback
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground whitespace-pre-wrap">{project.instructorFeedback}</p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            — {project.instructorId?.name || 'Unknown Instructor'}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

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

                                    <div>
                                        <p className="text-sm font-medium mb-1 flex items-center gap-1">
                                            <GraduationCap className="h-3 w-3" />
                                            Instructor
                                        </p>
                                        <p className="text-muted-foreground">{project.instructorId?.name || 'Unknown Instructor'}</p>
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

export default ProjectDetailPage;
