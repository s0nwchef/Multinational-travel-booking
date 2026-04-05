import React, { useState } from "react";
import GlobeScrollDemo from "../components/ui/landing-page";
import Header from "../layouts/Header";
import AuthModal from "../components/AuthModal";
import WishlistDrawer from "../components/WishlistDrawer";
import NotificationDrawer from "../components/NotificationDrawer";
import { cn } from "../lib/utils";

const LandingPage = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(0);

    return (
        <div className="relative min-h-screen bg-black">
            {/* Navigation - Using App's Header UI */}
            <div className={cn(
                "fixed top-0 left-0 right-0 z-50 px-4 pt-4 transition-all duration-700 ease-in-out",
                activeSection === 0 ? "opacity-0 -translate-y-10 pointer-events-none" : "opacity-100 translate-y-0 pointer-events-auto"
            )}>
                <Header
                    onOpenAuth={() => setIsAuthModalOpen(true)}
                    onOpenWishlist={() => setIsWishlistOpen(true)}
                    onOpenNotifications={() => setIsNotificationOpen(true)}
                />
            </div>

            {/* Main Content - Globe Scroll Experience */}
            <GlobeScrollDemo onSectionChange={setActiveSection} />

            {/* Modals */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
            <NotificationDrawer isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
        </div>
    );
};

export default LandingPage;
