import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, Clock, FileCheck, FileX, UserPlus, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { notificationAPI, Notification } from '../../api/notification.api';

const typeIcons: Record<string, React.ReactNode> = {
    new_project: <FileCheck className="h-4 w-4 text-blue-400" />,
    project_approved: <Check className="h-4 w-4 text-green-400" />,
    project_rejected: <FileX className="h-4 w-4 text-red-400" />,
    new_instructor: <UserPlus className="h-4 w-4 text-purple-400" />,
    project_assigned: <Briefcase className="h-4 w-4 text-cyan-400" />,
};

const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch unread count on mount and every 30s
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const count = await notificationAPI.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            // Silently fail
        }
    };

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const data = await notificationAPI.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = () => {
        const newOpen = !isOpen;
        setIsOpen(newOpen);
        if (newOpen) {
            fetchNotifications();
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                className="relative"
                title="Notifications"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-background border rounded-xl shadow-xl overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b bg-secondary/30">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    <CheckCheck className="h-3 w-3" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        <div className="max-h-80 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                    <Bell className="h-8 w-8 mb-2 opacity-40" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`px-4 py-3 border-b last:border-b-0 cursor-pointer transition-colors hover:bg-secondary/40 ${!notification.isRead ? 'bg-primary/5' : ''
                                            }`}
                                        onClick={() => {
                                            if (!notification.isRead) {
                                                handleMarkAsRead(notification._id);
                                            }
                                        }}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-0.5 shrink-0">
                                                {typeIcons[notification.type] || <Bell className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium truncate">{notification.title}</p>
                                                    {!notification.isRead && (
                                                        <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {timeAgo(notification.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
