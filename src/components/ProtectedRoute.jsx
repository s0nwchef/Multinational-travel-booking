import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService.js';

const ProtectedRoute = ({ children, roles = [] }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if user is authenticated
                if (!authService.isAuthenticated()) {
                    setIsAuthorized(false);
                    setIsChecking(false);
                    return;
                }

                // Check role authorization if roles are specified
                if (roles.length > 0) {
                    const user = authService.getCurrentUser();
                    const hasRequiredRole = roles.includes(user?.role);
                    
                    if (!hasRequiredRole) {
                        setIsAuthorized(false);
                        setIsChecking(false);
                        return;
                    }
                }

                // Try to fetch fresh user data from server
                const freshUser = await authService.fetchCurrentUser();
                if (!freshUser) {
                    setIsAuthorized(false);
                    setIsChecking(false);
                    return;
                }

                setIsAuthorized(true);
                setIsChecking(false);
            } catch (error) {
                console.error('Auth check error:', error);
                setIsAuthorized(false);
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [location.pathname, roles]);

    if (isChecking) {
        // Show loading state
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/home?returnUrl=${returnUrl}`} replace />;
    }

    return children;
};

export const StaffRoute = ({ children }) => {
    return (
        <ProtectedRoute roles={['staff', 'admin']}>
            {children}
        </ProtectedRoute>
    );
};

export default ProtectedRoute;