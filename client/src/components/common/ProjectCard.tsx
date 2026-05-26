import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Project, projectAPI } from '../../api/project.api';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../lib/utils';

interface ProjectCardProps {
    project: Project;
    to?: string;
    showStatus?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, to, showStatus = false }) => {
    const { isAuthenticated, user } = useAuth();
    const [likes, setLikes] = useState<string[]>(project.likes || []);
    const [isLiking, setIsLiking] = useState(false);

    const hasLiked = isAuthenticated && user ? likes.includes(user.id) : false;

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        approved: 'bg-green-500/20 text-green-400 border-green-500/30',
        rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) return;
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
            console.error('Failed to toggle like:', error);
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <Card className="overflow-hidden hover:shadow-glow-sm transition-all duration-300 group">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="group-hover:text-primary transition-colors">
                        {project.projectName}
                    </CardTitle>
                    {showStatus && project.status && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${statusColors[project.status] || ''}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                    )}
                </div>
                <CardDescription className="flex items-center gap-2 mt-2">
                    <User className="h-3 w-3" />
                    {project.studentId?.name || 'Unknown Student'}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-3">
                    <div>
                        <p className="text-sm font-medium mb-1">Subject</p>
                        <p className="text-sm text-muted-foreground">{project.subject}</p>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-2 flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            Technologies
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {project.technologies.slice(0, 3).map((tech, index) => (
                                <Badge key={index} variant="secondary">
                                    {tech}
                                </Badge>
                            ))}
                            {project.technologies.length > 3 && (
                                <Badge variant="outline">+{project.technologies.length - 3} more</Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(project.createdAt)}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex items-center gap-2">
                <Link to={to || `/projects/${project._id}`} className="flex-1">
                    <Button className="w-full">View Details</Button>
                </Link>
                <Button
                    variant={hasLiked ? 'default' : 'outline'}
                    size="icon"
                    onClick={handleLike}
                    disabled={!isAuthenticated || isLiking}
                    title={!isAuthenticated ? 'Login to like' : hasLiked ? 'Unlike' : 'Like'}
                    className={`shrink-0 transition-all duration-200 ${hasLiked
                        ? 'bg-pink-500 hover:bg-pink-600 border-pink-500 text-white'
                        : 'hover:border-pink-500 hover:text-pink-500'
                        }`}
                >
                    <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                </Button>
                <span className="text-sm font-medium text-muted-foreground min-w-[1.5rem] text-center">
                    {likes.length}
                </span>
            </CardFooter>
        </Card>
    );
};

export default ProjectCard;
