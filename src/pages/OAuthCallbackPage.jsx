import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import authService from '../services/authService';

/**
 * OAuth Callback Page
 * Handles Google OAuth callback and processes authentication
 */
const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double processing in React Strict Mode
    if (processedRef.current) {
      console.log('[OAuthCallback] Already processed, skipping');
      return;
    }
    processedRef.current = true;

    const handleCallback = async () => {
      setIsProcessing(true);
      try {
        console.log('[OAuthCallback] Processing callback...');
        const result = await authService.processOAuthCallback();
        
        if (result) {
          console.log('[OAuthCallback] Success, redirecting...');
          // Successful authentication - redirect to dashboard or home
          const redirectPath = result.isNewUser ? '/home' : '/dashboard';
          navigate(redirectPath, { replace: true });
        } else {
          console.log('[OAuthCallback] No result, redirecting to home');
          // No OAuth callback parameters - redirect to home
          navigate('/home', { replace: true });
        }
      } catch (err) {
        console.error('[OAuthCallback] Error:', err);
        setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        
        // Redirect to home after 3 seconds on error
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Đăng nhập thất bại
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Đang chuyển về trang chủ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Đang xử lý đăng nhập...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Vui lòng đợi trong giây lát
        </p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
