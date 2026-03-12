import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AuthModal from '../components/AuthModal';
import WishlistDrawer from '../components/WishlistDrawer';

export default function MainLayout() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-black text-text-primary-light dark:text-text-primary-dark transition-colors duration-300 min-h-screen flex flex-col font-body">
            <header className="sticky top-0 z-50 px-4 pt-2 pb-2 bg-white/80 dark:bg-black/80 backdrop-blur-md">
                <Header
                    onOpenAuth={() => setIsAuthModalOpen(true)}
                    onOpenWishlist={() => setIsWishlistOpen(true)}
                />
            </header>
            <main className="flex-grow flex flex-col gap-4 p-4 pt-2">
                <Outlet />
            </main>
            <div className="p-4 pt-0">
                <Footer />
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
        </div>
    );
}
