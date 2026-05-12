import React from 'react';
import { AnimatePresence } from 'motion/react';
import Toast from './Toast';
import { useNotification } from '../../contexts/NotificationContext';

const ToastContainer = () => {
  const { toasts, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
