import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login, getInstructors, googleLogin, verifyEmail, resendVerification, forgotPassword, resetPassword, getPendingInstructors, approveInstructor, rejectInstructor } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

// Validation rules
const signupValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['student', 'instructor']).withMessage('Invalid role'),
    validate
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required'),
    validate
];

const resendVerificationValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    validate
];

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationValidation, resendVerification);
router.get('/instructors', getInstructors);
router.post('/google', googleLogin);

// Password reset routes
const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    validate
];

const resetPasswordValidation = [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
];

router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, resetPassword);

// Admin routes
router.get('/admin/pending-instructors', authMiddleware, roleMiddleware('admin'), getPendingInstructors);
router.put('/admin/approve-instructor/:id', authMiddleware, roleMiddleware('admin'), approveInstructor);
router.delete('/admin/reject-instructor/:id', authMiddleware, roleMiddleware('admin'), rejectInstructor);

export default router;
