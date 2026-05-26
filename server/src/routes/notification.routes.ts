import { Router } from 'express';
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
} from '../controllers/notification.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.get('/', authMiddleware, getNotifications);
router.get('/unread-count', authMiddleware, getUnreadCount);
router.put('/read-all', authMiddleware, markAllAsRead);
router.put('/:id/read', authMiddleware, markAsRead);

export default router;
