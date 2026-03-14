import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Search, Heart, Bell, LogOut, X } from 'lucide-react';

const HeaderMobile = ({
                          isOpen,
                          navLinks,
                          onOpenWishlist,
                          onOpenNotifications,
                          onOpenAuth,
                          user,
                          handleLogout
                      }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSearching, setIsSearching] = useState(false);
    const [searchVal, setSearchVal] = useState("");

    const handleSearch = () => {
        if (searchVal.trim()) {
            navigate("/tours", { state: { query: searchVal } });
            setIsSearching(false);
            setSearchVal("");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="lg:hidden overflow-hidden"
                >
                    <div className="p-6 pt-2 space-y-8">
                        {/* Nav Links Group - Hidden on tablet (md) because they are in the header pill */}
                        <div className="space-y-1 md:hidden">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-4">Navigation</div>
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) => `
                    flex items-center justify-between p-4 rounded-2xl font-bold transition-all
                    ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}
                  `}
                                >
                                    {link.label}
                                    <ChevronRight className={`w-4 h-4 ${location.pathname === link.path ? 'text-primary' : 'text-gray-300'}`} />
                                </NavLink>
                            ))}
                        </div>

                        {/* Actions Group */}
                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-4">Quick Actions</div>

                            <div className="space-y-4 px-2">
                                {/* Search Bar Mobile */}
                                <div className={`
                  flex items-center transition-all duration-300 border-2 rounded-2xl px-3
                  ${isSearching ? 'border-orange-400 bg-white dark:bg-gray-800 shadow-md' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'}
                `}>
                                    <Search className={`w-5 h-5 ${isSearching ? 'text-orange-500' : 'text-gray-400'}`} />
                                    <input
                                        type="text"
                                        placeholder="Where to go?"
                                        className="flex-grow bg-transparent border-none focus:ring-0 text-sm py-3 px-3 text-gray-900 dark:text-white placeholder-gray-400 font-medium outline-none"
                                        value={searchVal}
                                        onChange={(e) => setSearchVal(e.target.value)}
                                        onFocus={() => setIsSearching(true)}
                                        onBlur={() => !searchVal && setIsSearching(false)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                    {searchVal && (
                                        <button onClick={handleSearch} className="p-1 bg-orange-500 text-white rounded-full">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={onOpenWishlist}
                                        className="flex-1 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-primary relative transition-all duration-200 hover:scale-[1.02] active:scale-95 active:bg-orange-50 dark:active:bg-gray-700"
                                    >
                                        <Heart className="w-6 h-6" />
                                        <span className="absolute top-4 right-[35%] w-2.5 h-2.5 bg-black rounded-full border-2 border-white dark:border-gray-800"></span>
                                        <span className="ml-2 font-bold text-sm">Wishlist</span>
                                    </button>

                                    <button
                                        onClick={onOpenNotifications}
                                        className="flex-1 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-primary relative transition-all duration-200 hover:scale-[1.02] active:scale-95 active:bg-orange-50 dark:active:bg-gray-700"
                                    >
                                        <Bell className="w-6 h-6" />
                                        <span className="absolute top-4 right-[35%] w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                                        <span className="ml-2 font-bold text-sm">Alerts</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Account Group */}
                        <div className="pt-2 pb-4">
                            {user ? (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-3xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-primary/20" />
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.membership}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={onOpenAuth}
                                    className="w-full py-5 bg-primary text-white rounded-3xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                >
                                    Sign In to Logo
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HeaderMobile;
