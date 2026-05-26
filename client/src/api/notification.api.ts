import api from './api';

export interface Notification {
    _id: string;
    userId: string;
    type: 'new_project' | 'project_approved' | 'project_rejected' | 'new_instructor' | 'project_assigned';
    title: string;
    message: string;
    isRead: boolean;
    relatedId?: string;
    createdAt: string;
    updatedAt: string;
}

export const notificationAPI = {
    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get('/notifications');
        return response.data.data;
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await api.get('/notifications/unread-count');
        return response.data.data.count;
    },

    markAsRead: async (id: string): Promise<Notification> => {
        const response = await api.put(`/notifications/${id}/read`);
        return response.data.data;
    },

    markAllAsRead: async (): Promise<void> => {
        await api.put('/notifications/read-all');
    },
};
