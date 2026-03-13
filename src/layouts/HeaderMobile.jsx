import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Search, Heart, Bell, LogOut } from 'lucide-react';

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

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-4">Quick Actions</div>
                            <div className="flex flex-wrap gap-3 px-2">
                                <button onClick={() => {}} className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-primary relative active:scale-90 transition-transform flex-shrink-0">
                                    <Search className="w-5 h-5" />
                                </button>
                                <button onClick={onOpenWishlist} className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-primary relative active:scale-90 transition-transform flex-shrink-0">
                                    <Heart className="w-5 h-5" />
                                    <span className="absolute top-3 right-3 w-2 h-2 bg-black rounded-full border-2 border-white dark:border-gray-800"></span>
                                </button>
                                <button onClick={onOpenNotifications} className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-primary relative active:scale-90 transition-transform flex-shrink-0">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-3 right-3 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                                </button>
                            </div>
                        </div>

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
                                    Sign In
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
