import { Request, Response } from 'express';
import Project from '../models/Project';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendProjectSubmittedEmail, sendProjectApprovalEmail, sendProjectAssignedEmail } from '../services/email.service';
import { createNotification } from './notification.controller';

// @desc    Get all projects (public - only approved)
// @route   GET /api/projects
// @access  Public
export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const projects = await Project.find({ status: 'approved' })
            .populate('studentId', 'name email')
            .populate('instructorId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error: any) {
        console.error('Get all projects error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching projects'
        });
    }
};

// @desc    Get project by ID (public)
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id)
            .populate('studentId', 'name email')
            .populate('instructorId', 'name email');

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Project not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error: any) {
        console.error('Get project by ID error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching project'
        });
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Student)
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            projectName,
            groupMembers,
            subject,
            technologies,
            youtubeLink,
            descriptionLink,
            instructorId
        } = req.body;

        const project = await Project.create({
            projectName,
            groupMembers,
            subject,
            technologies,
            youtubeLink,
            descriptionLink,
            studentId: req.user!.id,
            instructorId,
            status: 'pending'
        });

        const populatedProject = await Project.findById(project._id)
            .populate('studentId', 'name email')
            .populate('instructorId', 'name email');

        // Send email notification to admin
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
            try {
                const student = await User.findById(req.user!.id);
                await sendProjectSubmittedEmail(adminEmail, student?.name || 'Unknown', projectName);
            } catch (emailError) {
                console.error('Failed to send admin notification email:', emailError);
            }
        }

        // Create in-app notifications for all admins
        try {
            const admins = await User.find({ role: 'admin' });
            const student = await User.findById(req.user!.id);
            for (const admin of admins) {
                await createNotification(
                    admin._id.toString(),
                    'new_project',
                    'New Project Submitted',
                    `${student?.name || 'A student'} submitted "${projectName}" for review.`,
                    project._id.toString()
                );
            }
        } catch (notifError) {
            console.error('Failed to create admin notifications:', notifError);
        }

        res.status(201).json({
            success: true,
            message: 'Project submitted successfully! It will be visible after admin approval.',
            data: populatedProject
        });
    } catch (error: any) {
        console.error('Create project error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error creating project'
        });
    }
};

// @desc    Get student's own projects
// @route   GET /api/projects/student/my-projects
// @access  Private (Student)
export const getStudentProjects = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const projects = await Project.find({ studentId: req.user!.id })
            .populate('instructorId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error: any) {
        console.error('Get student projects error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching student projects'
        });
    }
};

// @desc    Get instructor's assigned projects
// @route   GET /api/projects/instructor/assigned
// @access  Private (Instructor)
export const getInstructorProjects = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const projects = await Project.find({ instructorId: req.user!.id, status: 'approved' })
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error: any) {
        console.error('Get instructor projects error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching instructor projects'
        });
    }
};

// @desc    Add/update feedback to project
// @route   PUT /api/projects/:id/feedback
// @access  Private (Instructor)
export const addFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { feedback } = req.body;

        const project = await Project.findById(id);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Project not found'
            });
            return;
        }

        if (project.instructorId.toString() !== req.user!.id) {
            res.status(403).json({
                success: false,
                message: 'You are not authorized to add feedback to this project'
            });
            return;
        }

        project.instructorFeedback = feedback;
        await project.save();

        const updatedProject = await Project.findById(id)
            .populate('studentId', 'name email')
            .populate('instructorId', 'name email');

        res.status(200).json({
            success: true,
            message: 'Feedback added successfully',
            data: updatedProject
        });
    } catch (error: any) {
        console.error('Add feedback error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error adding feedback'
        });
    }
};

// @desc    Toggle like on a project
// @route   POST /api/projects/:id/like
// @access  Private (any authenticated user)
export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const project = await Project.findById(id);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Project not found'
            });
            return;
        }

        const hasLiked = project.likes.some(
            (likeUserId) => likeUserId.toString() === userId
        );

        if (hasLiked) {
            await Project.findByIdAndUpdate(id, {
                $pull: { likes: userId }
            });
        } else {
            await Project.findByIdAndUpdate(id, {
                $addToSet: { likes: userId }
            });
        }

        const updatedProject = await Project.findById(id);

        res.status(200).json({
            success: true,
            message: hasLiked ? 'Project unliked' : 'Project liked',
            data: {
                likesCount: updatedProject!.likes.length,
                hasLiked: !hasLiked
            }
        });
    } catch (error: any) {
        console.error('Toggle like error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error toggling like'
        });
    }
};

// ===================== ADMIN ENDPOINTS =====================

// @desc    Get all projects (admin - all statuses)
// @route   GET /api/projects/admin/all
// @access  Private (Admin)
export const getAllProjectsAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const projects = await Project.find()
            .populate('studentId', 'name email')
            .populate('instructorId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error: any) {
        console.error('Get all projects admin error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching projects'
        });
    }
};

// @desc    Get pending projects (admin)
// @route   GET /api/projects/admin/pending
// @access  Private (Admin)
export const getPendingProjects = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const projects = await Project.find({ status: 'pending' })
            .populate('studentId', 'name email')
            .populate('instructorId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error: any) {
        console.error('Get pending projects error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching pending projects'
        });
    }
};

// @desc    Review (approve/reject) a project
// @route   PUT /api/projects/:id/review
// @access  Private (Admin)
export const reviewProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            res.status(400).json({
                success: false,
                message: 'Status must be either "approved" or "rejected"'
            });
            return;
        }

        const project = await Project.findById(id)
            .populate('studentId', 'name email')
            .populate('instructorId', 'name email');

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Project not found'
            });
            return;
        }

        project.status = status;
        project.adminRemarks = remarks || '';
        await project.save();

        // Send email to student about the decision
        const student = project.studentId as any;
        if (student?.email) {
            try {
                await sendProjectApprovalEmail(
                    student.email,
                    student.name,
                    project.projectName,
                    status,
                    remarks
                );
            } catch (emailError) {
                console.error('Failed to send approval email to student:', emailError);
            }
        }

        // Create in-app notification for student
        if (student?._id) {
            try {
                await createNotification(
                    student._id.toString(),
                    status === 'approved' ? 'project_approved' : 'project_rejected',
                    `Project ${status === 'approved' ? 'Approved' : 'Rejected'}`,
                    `Your project "${project.projectName}" has been ${status}.${remarks ? ' Remarks: ' + remarks : ''}`,
                    project._id.toString()
                );
            } catch (notifError) {
                console.error('Failed to create student notification:', notifError);
            }
        }

        // If approved, send email and notification to instructor
        if (status === 'approved') {
            const instructor = project.instructorId as any;
            if (instructor?.email) {
                try {
                    await sendProjectAssignedEmail(
                        instructor.email,
                        instructor.name,
                        student?.name || 'Unknown',
                        project.projectName
                    );
                } catch (emailError) {
                    console.error('Failed to send assignment email to instructor:', emailError);
                }
            }
            if (instructor?._id) {
                try {
                    await createNotification(
                        instructor._id.toString(),
                        'project_assigned',
                        'New Project Assigned',
                        `"${project.projectName}" by ${student?.name || 'a student'} has been assigned to you.`,
                        project._id.toString()
                    );
                } catch (notifError) {
                    console.error('Failed to create instructor notification:', notifError);
                }
            }
        }

        res.status(200).json({
            success: true,
            message: `Project ${status} successfully`,
            data: project
        });
    } catch (error: any) {
        console.error('Review project error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error reviewing project'
        });
    }
};
