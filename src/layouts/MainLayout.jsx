import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AuthModal from '../components/AuthModal';

export default function MainLayout() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-black text-text-primary-light dark:text-text-primary-dark transition-colors duration-300 p-4 min-h-screen flex flex-col gap-4 font-body">
            <Header onOpenAuth={() => setIsAuthModalOpen(true)} />
            <main className="flex-grow flex flex-col gap-4">
                <Outlet />
            </main>
            <Footer />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
}
