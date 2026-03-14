import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Check } from 'lucide-react';

const WishlistItem = ({ item, isSelected, onToggle }) => (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0 group items-center">
        {/* Checkbox */}
        <button
            onClick={() => onToggle(item.id)}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                isSelected
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-gray-200 hover:border-orange-300'
            }`}
        >
            {isSelected && <Check size={14} strokeWidth={4} />}
        </button>

        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="flex-grow flex flex-col justify-between">
            <div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{item.title}</h4>
                <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1">📅 {item.date}</span>
                    <span className="flex items-center gap-1">👤 {item.adults} Adults</span>
                </div>
            </div>
            <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-black text-orange-600">${item.price.toFixed(2)}</span>
                <div className="flex items-center gap-3">
                    <button className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
                        Edit
                    </button>
                    <button className="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors flex items-center gap-1">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const RecommendationCard = ({ item }) => (
    <div className="min-w-[160px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-50 group cursor-pointer">
        <div className="h-24 overflow-hidden relative">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
        </div>
        <div className="p-2">
            <h5 className="text-[10px] font-bold text-gray-900 line-clamp-1">{item.title}</h5>
            <p className="text-[9px] text-gray-500 mt-0.5">From ${item.price}</p>
        </div>
    </div>
);

export default function WishlistDrawer({ isOpen, onClose }) {
    const scrollRef = useRef(null);
    const [selectedIds, setSelectedIds] = useState([1, 2, 3]); // Default all selected

    const wishlistItems = [
        {
            id: 1,
            title: "Tokyo Tower Main Observatory Ticket",
            date: "Oct 24, 2024",
            adults: 2,
            price: 28.00,
            image: "https://picsum.photos/seed/tokyo/200/200"
        },
        {
            id: 2,
            title: "teamLab Planets TOKYO: Digital Art Museum Entrance Ticket",
            date: "Oct 25, 2024",
            adults: 1,
            price: 35.50,
            image: "https://picsum.photos/seed/teamlab/200/200"
        },
        {
            id: 3,
            title: "Tokyo Subway Ticket (24/48/72 Hours) - Unlimited Rides",
            date: "Oct 24, 2024",
            adults: 2,
            price: 18.00,
            image: "https://picsum.photos/seed/subway/200/200"
        }
    ];

    const recommendations = [
        { id: 4, title: "Mt. Fuji Day Tour", price: 65.00, image: "https://picsum.photos/seed/fuji/200/200" },
        { id: 5, title: "Shibuya Sky Ticket", price: 15.00, image: "https://picsum.photos/seed/shibuya/200/200" },
        { id: 6, title: "Kyoto Temple Tour", price: 45.00, image: "https://picsum.photos/seed/kyoto/200/200" },
        { id: 7, title: "Nara Deer Park", price: 30.00, image: "https://picsum.photos/seed/nara/200/200" },
        { id: 8, title: "Osaka Castle", price: 25.00, image: "https://picsum.photos/seed/osaka/200/200" }
    ];

    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const subtotal = wishlistItems
        .filter(item => selectedIds.includes(item.id))
        .reduce((acc, item) => acc + item.price, 0);

    const handleWheel = (e) => {
        if (scrollRef.current) {
            // Prevent vertical scroll and convert to horizontal
            e.preventDefault();
            scrollRef.current.scrollLeft += e.deltaY;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center justify-between border-b border-gray-50">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-gray-900">Your Wishlist</h2>
                                <span className="bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
                            <div className="space-y-2">
                                {wishlistItems.map(item => (
                                    <WishlistItem
                                        key={item.id}
                                        item={item}
                                        isSelected={selectedIds.includes(item.id)}
                                        onToggle={toggleSelection}
                                    />
                                ))}
                            </div>

                            {/* Recommendations Section */}
                            <div className="mt-12">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">You might also like</h3>
                                <div
                                    ref={scrollRef}
                                    onWheel={handleWheel}
                                    className="flex gap-4 overflow-x-auto pb-4 no-scrollbar cursor-grab active:cursor-grabbing"
                                >
                                    {recommendations.map(item => (
                                        <RecommendationCard key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Summary */}
                        <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-500">Subtotal</span>
                                    <span className="text-[10px] text-gray-400">{selectedIds.length} items selected</span>
                                </div>
                                <span className="text-xl font-black text-gray-900">${subtotal.toFixed(2)}</span>
                            </div>
                            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 group">
                                Proceed to Checkout
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
