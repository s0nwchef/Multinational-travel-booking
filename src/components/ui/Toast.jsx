import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const Toast = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isExiting, onClose, toast.id]);

  const handleClose = () => {
    setIsExiting(true);
  };

  const typeStyles = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-green-600',
      icon: '✓',
      iconBg: 'bg-green-400/30',
      shadow: 'shadow-green-500/25'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-red-600',
      icon: '✕',
      iconBg: 'bg-red-400/30',
      shadow: 'shadow-red-500/25'
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      icon: '⚠',
      iconBg: 'bg-yellow-400/30',
      shadow: 'shadow-yellow-500/25'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      icon: 'ℹ',
      iconBg: 'bg-blue-400/30',
      shadow: 'shadow-blue-500/25'
    }
  };

  const style = typeStyles[toast.type] || typeStyles.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`${style.bg} ${style.shadow} shadow-lg rounded-xl p-4 min-w-[300px] max-w-[400px] flex items-center gap-3 pointer-events-auto`}
    >
      {/* Icon */}
      <div className={`${style.iconBg} w-8 h-8 rounded-full flex items-center justify-center shrink-0`}>
        <span className="text-white text-sm font-bold">{style.icon}</span>
      </div>

      {/* Message */}
      <p className="text-white text-sm font-medium flex-grow line-clamp-2">
        {toast.message}
      </p>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="text-white/70 hover:text-white transition-colors shrink-0 hover:bg-white/10 rounded-full p-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
};

export default Toast;
