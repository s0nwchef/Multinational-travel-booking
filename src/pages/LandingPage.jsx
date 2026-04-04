import React, { useState } from "react";
import GlobeScrollDemo from "../components/ui/landing-page";
import Header from "../layouts/Header";
import AuthModal from "../components/AuthModal";
import WishlistDrawer from "../components/WishlistDrawer";
import NotificationDrawer from "../components/NotificationDrawer";

const LandingPage = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    return (
        <div className="relative min-h-screen bg-black">
            {/* Navigation - Using App's Header UI */}
            <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pointer-events-none">
                <div className="pointer-events-auto">
                    <Header
                        onOpenAuth={() => setIsAuthModalOpen(true)}
                        onOpenWishlist={() => setIsWishlistOpen(true)}
                        onOpenNotifications={() => setIsNotificationOpen(true)}
                    />
                </div>
            </div>

            {/* Main Content - Globe Scroll Experience */}
            <GlobeScrollDemo />

            {/* Modals */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
            <NotificationDrawer isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
        </div>
    );
};

export default LandingPage;
