import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, CheckCircle2, XCircle, ExternalLink, ChevronDown, ChevronUp, Search, UserPlus, Users, Eye } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { projectAPI, Project } from '../../api/project.api';
import { authAPI } from '../../api/auth.api';
import { useToast } from '../../components/ui/toast';

type TabType = 'pending' | 'all' | 'instructors';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedProject, setExpandedProject] = useState<string | null>(null);
    const [remarks, setRemarks] = useState('');
    const [reviewingId, setReviewingId] = useState<string | null>(null);
    const [pendingInstructors, setPendingInstructors] = useState<{ _id: string; name: string; email: string; createdAt: string }[]>([]);
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const { showToast } = useToast();

    // Always fetch all projects for stats on mount
    useEffect(() => {
        fetchAllProjectsForStats();
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [activeTab]);

    const fetchAllProjectsForStats = async () => {
        try {
            const data = await projectAPI.getAllProjectsAdmin();
            setAllProjects(data);
        } catch (error: any) {
            console.error('Failed to fetch all projects for stats:', error);
        }
    };

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'instructors') {
                const data = await authAPI.getPendingInstructors();
                setPendingInstructors(data);
            } else {
                const data = activeTab === 'pending'
                    ? await projectAPI.getPendingProjects()
                    : await projectAPI.getAllProjectsAdmin();
                setProjects(data);
                // Keep allProjects in sync
                if (activeTab === 'all') {
                    setAllProjects(data);
                }
            }
        } catch (error: any) {
            showToast('error', activeTab === 'instructors' ? 'Failed to load instructors' : 'Failed to load projects');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReview = async (id: string, status: 'approved' | 'rejected') => {
        if (status === 'rejected' && !remarks.trim()) {
            showToast('error', 'Please provide remarks for rejection');
            return;
        }

        setReviewingId(id);
        try {
            await projectAPI.reviewProject(id, status, remarks || undefined);
            showToast('success', `Project ${status} successfully!`);
            setRemarks('');
            setExpandedProject(null);
            fetchProjects();
            fetchAllProjectsForStats();
        } catch (error: any) {
            showToast('error', error.response?.data?.message || `Failed to ${status} project`);
        } finally {
            setReviewingId(null);
        }
    };

    const handleApproveInstructor = async (id: string) => {
        setApprovingId(id);
        try {
            const result = await authAPI.approveInstructor(id);
            showToast('success', result.message);
            setPendingInstructors((prev) => prev.filter((i) => i._id !== id));
        } catch (error: any) {
            showToast('error', error.response?.data?.message || 'Failed to approve instructor');
        } finally {
            setApprovingId(null);
        }
    };

    const handleRejectInstructor = async (id: string) => {
        setRejectingId(id);
        try {
            const result = await authAPI.rejectInstructor(id);
            showToast('success', result.message);
            setPendingInstructors((prev) => prev.filter((i) => i._id !== id));
        } catch (error: any) {
            showToast('error', error.response?.data?.message || 'Failed to reject instructor');
        } finally {
            setRejectingId(null);
        }
    };

    const filteredProjects = projects.filter(
        (p) =>
            p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.studentId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: allProjects.length,
        pending: allProjects.filter((p) => p.status === 'pending').length,
        approved: allProjects.filter((p) => p.status === 'approved').length,
        rejected: allProjects.filter((p) => p.status === 'rejected').length,
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            approved: 'bg-green-500/20 text-green-400 border-green-500/30',
            rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
        };
        const icons: Record<string, React.ReactNode> = {
            pending: <Clock className="h-3 w-3" />,
            approved: <CheckCircle2 className="h-3 w-3" />,
            rejected: <XCircle className="h-3 w-3" />,
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
                {icons[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    </div>
                    <p className="text-muted-foreground mb-8">Manage and review student project submissions</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle></CardHeader>
                            <CardContent><p className="text-3xl font-bold">{stats.total}</p></CardContent>
                        </Card>
                        <Card className="border-yellow-500/30">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-yellow-400">Pending</CardTitle></CardHeader>
                            <CardContent><p className="text-3xl font-bold text-yellow-400">{stats.pending}</p></CardContent>
                        </Card>
                        <Card className="border-green-500/30">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-400">Approved</CardTitle></CardHeader>
                            <CardContent><p className="text-3xl font-bold text-green-400">{stats.approved}</p></CardContent>
                        </Card>
                        <Card className="border-red-500/30">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-red-400">Rejected</CardTitle></CardHeader>
                            <CardContent><p className="text-3xl font-bold text-red-400">{stats.rejected}</p></CardContent>
                        </Card>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <Button
                            variant={activeTab === 'pending' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('pending')}
                        >
                            <Clock className="mr-2 h-4 w-4" />
                            Pending Review
                        </Button>
                        <Button
                            variant={activeTab === 'all' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('all')}
                        >
                            All Projects
                        </Button>
                        <Button
                            variant={activeTab === 'instructors' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('instructors')}
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Pending Instructors
                            {pendingInstructors.length > 0 && activeTab !== 'instructors' && (
                                <span className="ml-2 h-5 w-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
                                    {pendingInstructors.length}
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by name, student, or subject..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    {isLoading ? (
                        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
                    ) : activeTab === 'instructors' ? (
                        /* Pending Instructors List */
                        pendingInstructors.length > 0 ? (
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {pendingInstructors.map((instructor, index) => (
                                        <motion.div
                                            key={instructor._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2, delay: index * 0.03 }}
                                        >
                                            <Card>
                                                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                            <Users className="h-5 w-5 text-purple-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{instructor.name}</p>
                                                            <p className="text-sm text-muted-foreground">{instructor.email}</p>
                                                            <p className="text-xs text-muted-foreground">Registered: {new Date(instructor.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            className="bg-green-600 hover:bg-green-700"
                                                            disabled={approvingId === instructor._id || rejectingId === instructor._id}
                                                            onClick={() => handleApproveInstructor(instructor._id)}
                                                        >
                                                            {approvingId === instructor._id ? (
                                                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                            ) : (
                                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                            )}
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            disabled={approvingId === instructor._id || rejectingId === instructor._id}
                                                            onClick={() => handleRejectInstructor(instructor._id)}
                                                        >
                                                            {rejectingId === instructor._id ? (
                                                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                            ) : (
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                            )}
                                                            Reject
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <EmptyState
                                title="No pending instructors"
                                description="All instructor accounts have been approved!"
                            />
                        )
                    ) : filteredProjects.length > 0 ? (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {filteredProjects.map((project, index) => (
                                    <motion.div
                                        key={project._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2, delay: index * 0.03 }}
                                    >
                                        <Card className="overflow-hidden">
                                            <div
                                                className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                                                onClick={() => setExpandedProject(expandedProject === project._id ? null : project._id)}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-lg">{project.projectName}</h3>
                                                            {getStatusBadge(project.status)}
                                                        </div>
                                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                            <span>By: <strong>{project.studentId?.name || 'Unknown'}</strong></span>
                                                            <span>Subject: {project.subject}</span>
                                                            <span>Instructor: {project.instructorId?.name || 'Unknown'}</span>
                                                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {project.status === 'pending' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-green-600 hover:bg-green-700"
                                                                    disabled={reviewingId === project._id}
                                                                    onClick={(e) => { e.stopPropagation(); handleReview(project._id, 'approved'); }}
                                                                >
                                                                    <CheckCircle2 className="mr-1 h-4 w-4" />
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    disabled={reviewingId === project._id}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setExpandedProject(project._id);
                                                                    }}
                                                                >
                                                                    <XCircle className="mr-1 h-4 w-4" />
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                        {expandedProject === project._id ? (
                                                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                                        ) : (
                                                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {expandedProject === project._id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-4 pb-4 border-t pt-4 space-y-4">
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-sm font-medium mb-1">Group Members</p>
                                                                    <p className="text-sm text-muted-foreground">{project.groupMembers.join(', ')}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium mb-1">Technologies</p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {project.technologies.map((tech) => (
                                                                            <span key={tech} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{tech}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-wrap gap-3">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project._id}`); }}
                                                                >
                                                                    <Eye className="mr-1 h-4 w-4" /> View Project
                                                                </Button>
                                                                <a href={project.youtubeLink} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                                                                    <ExternalLink className="h-3 w-3" /> YouTube Video
                                                                </a>
                                                                <a href={project.descriptionLink} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                                                                    <ExternalLink className="h-3 w-3" /> Description
                                                                </a>
                                                            </div>

                                                            {project.adminRemarks && (
                                                                <div className="bg-secondary/50 rounded-lg p-3">
                                                                    <p className="text-sm font-medium mb-1">Admin Remarks</p>
                                                                    <p className="text-sm text-muted-foreground">{project.adminRemarks}</p>
                                                                </div>
                                                            )}

                                                            {project.status === 'pending' && (
                                                                <div className="space-y-2 bg-secondary/30 rounded-lg p-4">
                                                                    <label className="text-sm font-medium">Rejection Remarks (required for rejection)</label>
                                                                    <Input
                                                                        placeholder="Enter reason for rejection..."
                                                                        value={remarks}
                                                                        onChange={(e) => setRemarks(e.target.value)}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                    <div className="flex gap-2 pt-2">
                                                                        <Button
                                                                            className="bg-green-600 hover:bg-green-700"
                                                                            disabled={reviewingId === project._id}
                                                                            onClick={(e) => { e.stopPropagation(); handleReview(project._id, 'approved'); }}
                                                                        >
                                                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                                                                        </Button>
                                                                        <Button
                                                                            variant="destructive"
                                                                            disabled={reviewingId === project._id}
                                                                            onClick={(e) => { e.stopPropagation(); handleReview(project._id, 'rejected'); }}
                                                                        >
                                                                            <XCircle className="mr-2 h-4 w-4" /> Reject
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <EmptyState
                            title={activeTab === 'pending' ? 'No pending projects' : 'No projects found'}
                            description={activeTab === 'pending' ? 'All projects have been reviewed!' : 'No projects match your search'}
                        />
                    )}
                </motion.div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
