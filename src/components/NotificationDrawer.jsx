import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Flame, Clock, ShieldCheck, Plane, PiggyBank, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationItem = ({ item }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'flight': return <Plane className="w-4 h-4 text-green-500" />;
            case 'sale': return <Flame className="w-4 h-4 text-orange-500" />;
            case 'reminder': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'security': return <ShieldCheck className="w-4 h-4 text-gray-500" />;
            case 'price': return <PiggyBank className="w-4 h-4 text-stone-500" />;
            default: return <Bell className="w-4 h-4 text-primary" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'flight': return 'bg-green-50';
            case 'sale': return 'bg-orange-50';
            case 'reminder': return 'bg-blue-50';
            case 'security': return 'bg-gray-50';
            case 'price': return 'bg-stone-50';
            default: return 'bg-orange-50';
        }
    };

    return (
        <div className={`p-4 rounded-2xl mb-3 flex gap-4 transition-all hover:scale-[1.02] cursor-pointer border border-transparent hover:border-orange-100 ${item.isNew ? 'bg-white shadow-sm ring-1 ring-orange-500/10' : 'bg-gray-50/50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(item.type)}`}>
                {getIcon(item.type)}
            </div>
            <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-black text-gray-900">{item.title}</h4>
                    {item.isNew && <span className="text-[8px] font-black text-orange-500 uppercase tracking-tighter">New</span>}
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2 mb-2">{item.message}</p>
                <span className="text-[9px] font-bold text-gray-400">{item.time}</span>
            </div>
        </div>
    );
};

export default function NotificationDrawer({ isOpen, onClose }) {
    const navigate = useNavigate();

    const notifications = [
        {
            id: 1,
            type: 'flight',
            title: 'Flight to Tokyo Confirmed',
            message: 'Your booking #TB8392 is confirmed. Check details now to select your seat.',
            time: '2 mins ago',
            isNew: true
        },
        {
            id: 2,
            type: 'sale',
            title: 'Flash Sale: 50% Off Bali Resorts',
            message: 'Limited time offer for your next getaway to Bali. Book within 24h.',
            time: '1 hour ago',
            isNew: true
        },
        {
            id: 3,
            type: 'reminder',
            title: 'Check-in Reminder: London (LHR)',
            message: 'Your flight to London departs tomorrow at 10:00 AM. Online check-in is open.',
            time: '3 hours ago',
            isNew: true
        }
    ];

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
                                <span className="bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Activity</h3>
                                <button className="text-[10px] font-bold text-orange-500 hover:underline">Mark all as read</button>
                            </div>

                            {notifications.map(item => (
                                <NotificationItem key={item.id} item={item} />
                            ))}

                            <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                <p className="text-[10px] font-bold text-orange-800 text-center">
                                    Stay updated with our latest offers and travel alerts!
                                </p>
                            </div>
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
