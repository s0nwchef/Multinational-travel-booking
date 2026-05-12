import React, { useState, useEffect, useMemo } from 'react';
import {
    Bell,
    Calendar,
    Tag,
    User,
    Check,
    Loader2,
    AlertCircle,
    Plane,
    CreditCard,
    Star,
    ShieldCheck,
    XCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications.js';

const SidebarItem = ({ icon: Icon, label, count, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
            active
                ? 'bg-orange-50 text-orange-600 shadow-sm ring-1 ring-orange-100'
                : 'text-gray-500 hover:bg-gray-50'
        }`}
    >
        <div className="flex items-center gap-3">
            <Icon size={20} className={active ? 'text-orange-600' : 'text-gray-400'} />
            <span className="text-sm font-bold">{label}</span>
        </div>
        {count !== undefined && count > 0 && (
            <span className={`text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ${
                active ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
                {count}
            </span>
        )}
    </button>
);

// Skeleton loader
const ActivitySkeleton = () => (
    <div className="p-6 rounded-3xl mb-4 flex gap-6 bg-gray-50 animate-pulse">
        <div className="w-14 h-14 rounded-2xl bg-gray-200 shrink-0"></div>
        <div className="flex-grow space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-2 bg-gray-200 rounded w-1/4"></div>
        </div>
    </div>
);

// Error state
const ErrorState = ({ onRetry }) => (
    <div className="p-12 text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-700 mb-2">Unable to load notifications</h3>
        <p className="text-sm text-gray-500 mb-4">Something went wrong while fetching your notifications</p>
        <button
            onClick={onRetry}
            className="px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-colors"
        >
            Try Again
        </button>
    </div>
);

// Empty state
const EmptyState = ({ filterLabel }) => (
    <div className="p-12 text-center">
        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-700 mb-2">No notifications</h3>
        <p className="text-sm text-gray-500">
            {filterLabel === 'all' 
                ? "You're all caught up! No notifications yet."
                : `No ${filterLabel} notifications at the moment.`}
        </p>
    </div>
);

const ActivityCard = ({ item, onMarkAsRead, onClick }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'dat_tour_thanh_cong': return <Calendar className="w-5 h-5 text-green-500" />;
            case 'dat_tour_huy': return <XCircle className="w-5 h-5 text-red-500" />;
            case 'thanh_toan_thanh_cong': return <CreditCard className="w-5 h-5 text-blue-500" />;
            case 'nho_danh_gia': return <Star className="w-5 h-5 text-purple-500" />;
            case 'khuyen_mai': return <Tag className="w-5 h-5 text-orange-500" />;
            case 'he_thong': return <ShieldCheck className="w-5 h-5 text-gray-500" />;
            default: return <Bell className="w-5 h-5 text-orange-500" />;
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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleClick}
            className={`relative p-6 rounded-3xl mb-4 flex gap-6 transition-all border-l-4 cursor-pointer ${
                !item.da_doc
                    ? 'bg-white shadow-sm border-orange-500 ring-1 ring-gray-100'
                    : 'bg-white/50 border-transparent border-l-gray-100'
            }`}
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getBgColor(item.loai)}`}>
                {getIcon(item.loai)}
            </div>
            <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-black text-gray-900">{item.tieu_de}</h4>
                    {!item.da_doc && (
                        <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                            New
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{item.noi_dung}</p>
                <span className="text-xs font-bold text-gray-400">{formatTime(item.ngay_tao)}</span>
            </div>
        </motion.div>
    );
};

// Type filter mapping
const TYPE_FILTER_MAP = {
    bookings: ['dat_tour_thanh_cong', 'dat_tour_huy', 'thanh_toan_thanh_cong'],
    promotions: ['khuyen_mai'],
    account: ['nho_danh_gia', 'he_thong']
};

export default function Notifications() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [markingAllRead, setMarkingAllRead] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const {
        notifications,
        unreadCount,
        loading,
        error,
        pagination,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        retry
    } = useNotifications({ enablePolling: false });

    // Filter notifications based on active tab
    const filteredNotifications = useMemo(() => {
        if (activeTab === 'all') return notifications;
        
        const allowedTypes = TYPE_FILTER_MAP[activeTab];
        if (!allowedTypes) return notifications;
        
        return notifications.filter(n => allowedTypes.includes(n.loai));
    }, [notifications, activeTab]);

    // Group notifications by date
    const groupedNotifications = useMemo(() => {
        const today = [];
        const yesterday = [];
        const earlier = [];
        
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterdayStart = new Date(todayStart.getTime() - 86400000);

        filteredNotifications.forEach(n => {
            const date = new Date(n.ngay_tao);
            if (date >= todayStart) {
                today.push(n);
            } else if (date >= yesterdayStart) {
                yesterday.push(n);
            } else {
                earlier.push(n);
            }
        });

        return { today, yesterday, earlier };
    }, [filteredNotifications]);

    // Get counts for sidebar
    const counts = useMemo(() => {
        const bookings = notifications.filter(n => TYPE_FILTER_MAP.bookings.includes(n.loai) && !n.da_doc).length;
        const promotions = notifications.filter(n => TYPE_FILTER_MAP.promotions.includes(n.loai) && !n.da_doc).length;
        const account = notifications.filter(n => TYPE_FILTER_MAP.account.includes(n.loai) && !n.da_doc).length;
        
        return { bookings, promotions, account };
    }, [notifications]);

    // Fetch more notifications (pagination)
    const loadMore = () => {
        if (currentPage < pagination.pages) {
            setCurrentPage(prev => prev + 1);
            fetchNotifications({ page: currentPage + 1, limit: 20, type: activeTab === 'all' ? undefined : activeTab });
        }
    };

    // Handle tab change
    useEffect(() => {
        setCurrentPage(1);
        fetchNotifications({ page: 1, limit: 20, type: activeTab === 'all' ? undefined : activeTab });
    }, [activeTab]);

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
            navigate(notification.lien_ket);
        }
    };

    return (
        <div className="max-w-7xl mx-auto w-full py-12 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Sidebar */}
                <div className="lg:col-span-3">
                    <div className="mb-10">
                        <h1 className="text-2xl font-black text-gray-900 mb-2">Notifications</h1>
                        <p className="text-sm text-gray-400 font-medium">Manage your alerts and updates</p>
                    </div>

                    <div className="space-y-2">
                        <SidebarItem
                            icon={Bell}
                            label="All Notifications"
                            count={unreadCount}
                            active={activeTab === 'all'}
                            onClick={() => setActiveTab('all')}
                        />
                        <SidebarItem
                            icon={Calendar}
                            label="Bookings"
                            count={counts.bookings}
                            active={activeTab === 'bookings'}
                            onClick={() => setActiveTab('bookings')}
                        />
                        <SidebarItem
                            icon={Tag}
                            label="Promotions"
                            count={counts.promotions}
                            active={activeTab === 'promotions'}
                            onClick={() => setActiveTab('promotions')}
                        />
                        <SidebarItem
                            icon={User}
                            label="Account"
                            count={counts.account}
                            active={activeTab === 'account'}
                            onClick={() => setActiveTab('account')}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-9">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-black text-gray-900">Recent Activity</h2>
                            {filteredNotifications.length > 0 && (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                    <span className="text-sm font-bold text-gray-400">{filteredNotifications.length} items</span>
                                </>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleMarkAllAsRead}
                                disabled={markingAllRead}
                                className="flex items-center gap-2 text-xs font-black text-orange-500 hover:text-orange-600 transition-colors disabled:opacity-50"
                            >
                                {markingAllRead ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Marking...
                                    </>
                                ) : (
                                    <>
                                        <Check size={14} strokeWidth={3} />
                                        Mark all as read
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <>
                            <ActivitySkeleton />
                            <ActivitySkeleton />
                            <ActivitySkeleton />
                        </>
                    ) : error ? (
                        <ErrorState onRetry={retry} />
                    ) : filteredNotifications.length === 0 ? (
                        <EmptyState filterLabel={activeTab} />
                    ) : (
                        <>
                            {/* Today Section */}
                            {groupedNotifications.today.length > 0 && (
                                <div className="mb-12">
                                    {groupedNotifications.today.map(item => (
                                        <ActivityCard 
                                            key={item._id} 
                                            item={item} 
                                            onMarkAsRead={markAsRead}
                                            onClick={handleNotificationClick}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Yesterday Divider */}
                            {groupedNotifications.yesterday.length > 0 && (
                                <>
                                    <div className="relative flex items-center justify-center mb-12">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-100"></div>
                                        </div>
                                        <span className="relative px-6 bg-white text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Yesterday</span>
                                    </div>

                                    <div className="mb-12">
                                        {groupedNotifications.yesterday.map(item => (
                                            <ActivityCard 
                                                key={item._id} 
                                                item={item} 
                                                onMarkAsRead={markAsRead}
                                                onClick={handleNotificationClick}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Earlier Section */}
                            {groupedNotifications.earlier.length > 0 && (
                                <>
                                    <div className="relative flex items-center justify-center mb-12">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-100"></div>
                                        </div>
                                        <span className="relative px-6 bg-white text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Earlier</span>
                                    </div>

                                    <div className="mb-12">
                                        {groupedNotifications.earlier.map(item => (
                                            <ActivityCard 
                                                key={item._id} 
                                                item={item} 
                                                onMarkAsRead={markAsRead}
                                                onClick={handleNotificationClick}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Load More */}
                            {currentPage < pagination.pages && (
                                <div className="flex justify-center">
                                    <button 
                                        onClick={loadMore}
                                        className="px-10 py-4 rounded-2xl border-2 border-gray-100 text-sm font-black text-gray-500 hover:border-orange-500 hover:text-orange-500 transition-all active:scale-95"
                                    >
                                        Load More
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
