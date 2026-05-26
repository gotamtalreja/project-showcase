import { Router } from 'express';
import { body } from 'express-validator';
import {
    getAllProjects,
    getProjectById,
    createProject,
    getStudentProjects,
    getInstructorProjects,
    addFeedback,
    toggleLike,
    getAllProjectsAdmin,
    getPendingProjects,
    reviewProject
} from '../controllers/project.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Validation rules
const createProjectValidation = [
    body('projectName').trim().notEmpty().withMessage('Project name is required').isLength({ min: 3 }).withMessage('Project name must be at least 3 characters'),
    body('groupMembers').isArray({ min: 1 }).withMessage('At least one group member is required'),
    body('groupMembers.*').trim().notEmpty().withMessage('Group member names cannot be empty'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('technologies').isArray({ min: 1 }).withMessage('At least one technology is required'),
    body('technologies.*').trim().notEmpty().withMessage('Technology names cannot be empty'),
    body('youtubeLink').trim().notEmpty().withMessage('YouTube link is required').matches(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/).withMessage('Please provide a valid YouTube URL'),
    body('descriptionLink').trim().notEmpty().withMessage('Description link is required').isURL().withMessage('Please provide a valid URL'),
    body('instructorId').notEmpty().withMessage('Instructor is required').isMongoId().withMessage('Invalid instructor ID'),
    validate
];

const feedbackValidation = [
    body('feedback').trim().notEmpty().withMessage('Feedback cannot be empty'),
    validate
];

const reviewValidation = [
    body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
    validate
];

// Admin routes (must be before /:id to avoid conflicts)
router.get('/admin/all', authMiddleware, roleMiddleware('admin'), getAllProjectsAdmin);
router.get('/admin/pending', authMiddleware, roleMiddleware('admin'), getPendingProjects);
router.put('/:id/review', authMiddleware, roleMiddleware('admin'), reviewValidation, reviewProject);

// Student routes (protected)
router.get('/student/my-projects', authMiddleware, roleMiddleware('student'), getStudentProjects);
router.post('/', authMiddleware, roleMiddleware('student'), createProjectValidation, createProject);

// Instructor routes (protected)
router.get('/instructor/assigned', authMiddleware, roleMiddleware('instructor'), getInstructorProjects);
router.put('/:id/feedback', authMiddleware, roleMiddleware('instructor'), feedbackValidation, addFeedback);

// Like route (any authenticated user)
router.post('/:id/like', authMiddleware, toggleLike);

// Public routes (must be last since /:id is a catch-all pattern)
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

export default router;
