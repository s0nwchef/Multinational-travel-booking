import React, { useState } from 'react';
import {
    Bell,
    CheckCircle2,
    Flame,
    Clock,
    ShieldCheck,
    Plane,
    PiggyBank,
    Calendar,
    Tag,
    User,
    Check,
    ChevronRight,
    Search
} from 'lucide-react';
import { motion } from 'motion/react';

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
        {count && (
            <span className={`text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ${
                active ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
        {count}
      </span>
        )}
    </button>
);

const ActivityCard = ({ item }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'flight': return <Plane className="w-5 h-5 text-green-500" />;
            case 'sale': return <Flame className="w-5 h-5 text-orange-500" />;
            case 'reminder': return <Clock className="w-5 h-5 text-blue-500" />;
            case 'security': return <ShieldCheck className="w-5 h-5 text-gray-500" />;
            case 'price': return <PiggyBank className="w-5 h-5 text-stone-500" />;
            default: return <Bell className="w-5 h-5 text-primary" />;
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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-6 rounded-3xl mb-4 flex gap-6 transition-all border-l-4 ${
                item.isNew
                    ? 'bg-white shadow-sm border-orange-500 ring-1 ring-gray-100'
                    : 'bg-white/50 border-transparent border-l-gray-100'
            }`}
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getBgColor(item.type)}`}>
                {getIcon(item.type)}
            </div>
            <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-black text-gray-900">{item.title}</h4>
                    {item.isNew && (
                        <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              New
            </span>
                    )}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{item.message}</p>
                <span className="text-xs font-bold text-gray-400">{item.time}</span>
            </div>
        </motion.div>
    );
};

export default function Notifications() {
    const [activeTab, setActiveTab] = useState('all');

    const todayActivities = [
        {
            id: 1,
            type: 'flight',
            title: 'Flight to Tokyo Confirmed',
            message: 'Your booking #TB8392 is confirmed. Check details now to select your seat and meal preferences.',
            time: '2 mins ago',
            isNew: true
        },
        {
            id: 2,
            type: 'sale',
            title: 'Flash Sale: 50% Off Bali Resorts',
            message: 'Limited time offer for your next getaway to Bali. Book within the next 24 hours to claim your discount.',
            time: '1 hour ago',
            isNew: true
        },
        {
            id: 3,
            type: 'reminder',
            title: 'Check-in Reminder: London (LHR)',
            message: 'Your flight to London departs tomorrow at 10:00 AM. Online check-in is now open.',
            time: '3 hours ago',
            isNew: true
        }
    ];

    const yesterdayActivities = [
        {
            id: 4,
            type: 'security',
            title: 'Password Changed Successfully',
            message: 'Your account password was updated from a new device in San Francisco.',
            time: 'Yesterday, 4:23 PM',
            isNew: false
        },
        {
            id: 5,
            type: 'reminder',
            title: 'Welcome back to New York!',
            message: 'We hope you enjoyed your trip. Share your experience and earn 500 bonus miles.',
            time: 'Yesterday, 9:00 AM',
            isNew: false
        },
        {
            id: 6,
            type: 'price',
            title: 'Price Drop Alert: Paris',
            message: 'Prices for flights to Paris have dropped by 15% for your selected dates.',
            time: 'Yesterday, 8:15 AM',
            isNew: false
        }
    ];

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
                            count={3}
                            active={activeTab === 'all'}
                            onClick={() => setActiveTab('all')}
                        />
                        <SidebarItem
                            icon={Calendar}
                            label="Bookings"
                            active={activeTab === 'bookings'}
                            onClick={() => setActiveTab('bookings')}
                        />
                        <SidebarItem
                            icon={Tag}
                            label="Promotions"
                            count={1}
                            active={activeTab === 'promos'}
                            onClick={() => setActiveTab('promos')}
                        />
                        <SidebarItem
                            icon={User}
                            label="Account"
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
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                            <span className="text-sm font-bold text-gray-400">Today</span>
                        </div>
                        <button className="flex items-center gap-2 text-xs font-black text-orange-500 hover:text-orange-600 transition-colors">
                            <Check size={14} strokeWidth={3} />
                            Mark all as read
                        </button>
                    </div>

                    {/* Today Section */}
                    <div className="mb-12">
                        {todayActivities.map(item => (
                            <ActivityCard key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Yesterday Divider */}
                    <div className="relative flex items-center justify-center mb-12">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <span className="relative px-6 bg-white text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Yesterday</span>
                    </div>

                    {/* Yesterday Section */}
                    <div className="mb-12">
                        {yesterdayActivities.map(item => (
                            <ActivityCard key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="flex justify-center">
                        <button className="px-10 py-4 rounded-2xl border-2 border-gray-100 text-sm font-black text-gray-500 hover:border-orange-500 hover:text-orange-500 transition-all active:scale-95">
                            Load More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
