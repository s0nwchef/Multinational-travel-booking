import { useState, useEffect, useCallback, useRef } from 'react';
import notificationApi from '../services/notificationApi.js';
import authService from '../services/authService.js';

/**
 * Custom hook for managing notification state and polling
 * Provides notification list, unread count, and operations
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.pollInterval - Polling interval in milliseconds (default: 30000)
 * @param {boolean} options.enablePolling - Enable/disable polling (default: true)
 * @returns {Object} Notification state and methods
 */
export const useNotifications = (options = {}) => {
    const {
        pollInterval = 30000,
        enablePolling = true
    } = options;

    // State
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
    });

    // Refs
    const pollIntervalRef = useRef(null);
    const isMountedRef = useRef(true);

    /**
     * Fetch notifications from API
     */
    const fetchNotifications = useCallback(async (params = {}) => {
        const isAuthenticated = authService.isAuthenticated();
        if (!isAuthenticated) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await notificationApi.getNotifications(params);
            
            if (isMountedRef.current) {
                setNotifications(response.notifications || []);
                setUnreadCount(response.unreadCount || 0);
                setPagination(response.pagination || {
                    page: 1,
                    limit: 20,
                    total: 0,
                    pages: 0
                });
            }
        } catch (err) {
            if (isMountedRef.current) {
                setError(err.message || 'Failed to fetch notifications');
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, []);

    /**
     * Fetch unread count only (lighter API call)
     */
    const fetchUnreadCount = useCallback(async () => {
        const isAuthenticated = authService.isAuthenticated();
        if (!isAuthenticated) return;

        try {
            const response = await notificationApi.getUnreadCount();
            if (isMountedRef.current) {
                setUnreadCount(response.count || 0);
            }
        } catch (err) {
            // Silently fail for background polling
            console.warn('Failed to fetch unread count:', err.message);
        }
    }, []);

    /**
     * Mark a notification as read
     */
    const markAsRead = useCallback(async (notificationId) => {
        try {
            const response = await notificationApi.markAsRead(notificationId);
            
            if (isMountedRef.current) {
                // Update local state optimistically
                setNotifications(prev => 
                    prev.map(n => 
                        n._id === notificationId 
                            ? { ...n, da_doc: true, ngay_doc: new Date() }
                            : n
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

            return response;
        } catch (err) {
            if (isMountedRef.current) {
                setError(err.message || 'Failed to mark as read');
            }
            throw err;
        }
    }, []);

    /**
     * Mark all notifications as read
     */
    const markAllAsRead = useCallback(async () => {
        try {
            const response = await notificationApi.markAllAsRead();
            
            if (isMountedRef.current) {
                // Update local state
                setNotifications(prev => 
                    prev.map(n => ({ ...n, da_doc: true, ngay_doc: new Date() }))
                );
                setUnreadCount(0);
            }

            return response;
        } catch (err) {
            if (isMountedRef.current) {
                setError(err.message || 'Failed to mark all as read');
            }
            throw err;
        }
    }, []);

    /**
     * Delete a notification
     */
    const deleteNotification = useCallback(async (notificationId) => {
        try {
            const response = await notificationApi.deleteNotification(notificationId);
            
            if (isMountedRef.current) {
                // Update local state
                setNotifications(prev => prev.filter(n => n._id !== notificationId));
                // Decrement unread count if the deleted notification was unread
                const deletedNotification = notifications.find(n => n._id === notificationId);
                if (deletedNotification && !deletedNotification.da_doc) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }

            return response;
        } catch (err) {
            if (isMountedRef.current) {
                setError(err.message || 'Failed to delete notification');
            }
            throw err;
        }
    }, [notifications]);

    /**
     * Clear all read notifications
     */
    const clearReadNotifications = useCallback(async () => {
        try {
            const response = await notificationApi.clearReadNotifications();
            
            if (isMountedRef.current) {
                // Remove all read notifications from local state
                setNotifications(prev => prev.filter(n => !n.da_doc));
            }

            return response;
        } catch (err) {
            if (isMountedRef.current) {
                setError(err.message || 'Failed to clear read notifications');
            }
            throw err;
        }
    }, []);

    /**
     * Start polling for new notifications
     */
    const startPolling = useCallback(() => {
        if (!enablePolling || pollIntervalRef.current) return;

        pollIntervalRef.current = setInterval(() => {
            const isAuthenticated = authService.isAuthenticated();
            if (isAuthenticated) {
                fetchUnreadCount();
            } else {
                stopPolling();
            }
        }, pollInterval);
    }, [enablePolling, pollInterval, fetchUnreadCount]);

    /**
     * Stop polling
     */
    const stopPolling = useCallback(() => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
    }, []);

    /**
     * Retry fetching notifications after error
     */
    const retry = useCallback(() => {
        setError(null);
        fetchNotifications();
    }, [fetchNotifications]);

    // Initial fetch and polling setup
    useEffect(() => {
        isMountedRef.current = true;

        const isAuthenticated = authService.isAuthenticated();
        if (isAuthenticated) {
            fetchNotifications();
            if (enablePolling) {
                startPolling();
            }
        }

        return () => {
            isMountedRef.current = false;
            stopPolling();
        };
    }, [fetchNotifications, startPolling, stopPolling, enablePolling]);

    return {
        // State
        notifications,
        unreadCount,
        loading,
        error,
        pagination,
        
        // Methods
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearReadNotifications,
        retry,
        
        // Polling control
        startPolling,
        stopPolling
    };
};

export default useNotifications;
