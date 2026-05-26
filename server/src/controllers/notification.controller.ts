import { Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const notifications = await Notification.find({ userId: req.user!.id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error: any) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching notifications'
        });
    }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const count = await Notification.countDocuments({
            userId: req.user!.id,
            isRead: false
        });

        res.status(200).json({
            success: true,
            data: { count }
        });
    } catch (error: any) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching unread count'
        });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user!.id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error: any) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error marking notification as read'
        });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await Notification.updateMany(
            { userId: req.user!.id, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error: any) {
        console.error('Mark all as read error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error marking all notifications as read'
        });
    }
};

// Helper: create a notification (used by other controllers)
export const createNotification = async (
    userId: string,
    type: string,
    title: string,
    message: string,
    relatedId?: string
): Promise<void> => {
    try {
        await Notification.create({
            userId,
            type,
            title,
            message,
            relatedId: relatedId || undefined
        });
    } catch (error) {
        console.error('Create notification error:', error);
    }
};
