import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    X, Bell, Flame, Clock, ShieldCheck, Plane, CreditCard, 
    Star, Tag, ExternalLink, Loader2, AlertCircle, Calendar, XCircle, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications.js';

// Skeleton loader for notifications
const NotificationSkeleton = () => (
    <div className="p-4 rounded-2xl mb-3 flex gap-4 bg-gray-50 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
        <div className="flex-grow space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
            <div className="h-2 bg-gray-200 rounded w-1/4"></div>
        </div>
    </div>
);

// Error state component
const ErrorState = ({ onRetry }) => (
    <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-gray-500 mb-3">Unable to load notifications</p>
        <button
            onClick={onRetry}
            className="text-xs font-bold text-orange-500 hover:text-orange-600"
        >
            Try Again
        </button>
    </div>
);

// Empty state component
const EmptyState = () => (
    <div className="p-6 text-center">
        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No notifications yet</p>
        <p className="text-xs text-gray-400 mt-1">We'll notify you when something arrives!</p>
    </div>
);

const NotificationItem = ({ item, onMarkAsRead, onClick }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'dat_tour_thanh_cong': return <Calendar className="w-4 h-4 text-green-500" />;
            case 'dat_tour_huy': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'thanh_toan_thanh_cong': return <CreditCard className="w-4 h-4 text-blue-500" />;
            case 'nho_danh_gia': return <Star className="w-4 h-4 text-purple-500" />;
            case 'khuyen_mai': return <Tag className="w-4 h-4 text-orange-500" />;
            case 'he_thong': return <ShieldCheck className="w-4 h-4 text-gray-500" />;
            default: return <Bell className="w-4 h-4 text-orange-500" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'dat_tour_thanh_cong': return 'bg-green-50';
            case 'dat_tour_huy': return 'bg-red-50';
            case 'thanh_toan_thanh_cong': return 'bg-blue-50';
            case 'nho_danh_gia': return 'bg-purple-50';
            case 'khuyen_mai': return 'bg-orange-50';
            case 'he_thong': return 'bg-gray-50';
            default: return 'bg-orange-50';
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} mins ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const handleClick = () => {
        if (!item.da_doc) {
            onMarkAsRead(item._id);
        }
        if (item.lien_ket) {
            onClick(item);
        }
    };

    return (
        <div 
            onClick={handleClick}
            className={`p-4 rounded-2xl mb-3 flex gap-4 transition-all hover:scale-[1.02] cursor-pointer border border-transparent hover:border-orange-100 ${!item.da_doc ? 'bg-white shadow-sm ring-1 ring-orange-500/10' : 'bg-gray-50/50'}`}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(item.loai)}`}>
                {getIcon(item.loai)}
            </div>
            <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-black text-gray-900">{item.tieu_de}</h4>
                    {!item.da_doc && <span className="text-[8px] font-black text-orange-500 uppercase tracking-tighter">New</span>}
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2 mb-2">{item.noi_dung}</p>
                <span className="text-[9px] font-bold text-gray-400">{formatTime(item.ngay_tao)}</span>
            </div>
        </div>
    );
};

export default function NotificationDrawer({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [markingAllRead, setMarkingAllRead] = useState(false);

    const {
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        retry
    } = useNotifications({ enablePolling: true });

    const handleMarkAllAsRead = async () => {
        if (markingAllRead) return;
        setMarkingAllRead(true);
        try {
            await markAllAsRead();
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        } finally {
            setMarkingAllRead(false);
        }
    };

    const handleNotificationClick = (notification) => {
        if (notification.lien_ket) {
            onClose();
            navigate(notification.lien_ket);
        }
    };

    const handleGoToCenter = () => {
        onClose();
        navigate('/notifications');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
                    >
                        <div className="p-6 flex items-center justify-between border-b border-gray-50">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-gray-900">Notifications</h2>
                                {unreadCount > 0 && (
                                    <span className="bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Activity</h3>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={handleMarkAllAsRead}
                                        disabled={markingAllRead}
                                        className="text-[10px] font-bold text-orange-500 hover:underline disabled:opacity-50 flex items-center gap-1"
                                    >
                                        {markingAllRead ? (
                                            <>
                                                <Loader2 size={12} className="animate-spin" />
                                                Marking...
                                            </>
                                        ) : (
                                            <>
                                                <Check size={12} strokeWidth={3} />
                                                Mark all as read
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {loading ? (
                                <>
                                    <NotificationSkeleton />
                                    <NotificationSkeleton />
                                    <NotificationSkeleton />
                                </>
                            ) : error ? (
                                <ErrorState onRetry={retry} />
                            ) : notifications.length === 0 ? (
                                <EmptyState />
                            ) : (
                                notifications.slice(0, 5).map(item => (
                                    <NotificationItem 
                                        key={item._id} 
                                        item={item} 
                                        onMarkAsRead={markAsRead}
                                        onClick={handleNotificationClick}
                                    />
                                ))
                            )}

                            {!loading && !error && notifications.length > 0 && (
                                <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                    <p className="text-[10px] font-bold text-orange-800 text-center">
                                        Stay updated with our latest offers and travel alerts!
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100">
                            <button
                                onClick={handleGoToCenter}
                                className="w-full bg-white border-2 border-gray-100 hover:border-orange-500 hover:text-orange-500 text-gray-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 group"
                            >
                                View Notification Center
                                <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
