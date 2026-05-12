import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  toasts: []
};

// Action types
const TOAST_ACTIONS = {
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  REMOVE_ALL_TOASTS: 'REMOVE_ALL_TOASTS'
};

// Reducer
const toastReducer = (state, action) => {
  switch (action.type) {
    case TOAST_ACTIONS.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };
    case TOAST_ACTIONS.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    case TOAST_ACTIONS.REMOVE_ALL_TOASTS:
      return {
        ...state,
        toasts: []
      };
    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext(null);

// Toast types configuration
const TOAST_TYPES = {
  success: {
    bgColor: 'bg-green-500',
    icon: '✓',
    iconBg: 'bg-green-400'
  },
  error: {
    bgColor: 'bg-red-500',
    icon: '✕',
    iconBg: 'bg-red-400'
  },
  warning: {
    bgColor: 'bg-yellow-500',
    icon: '⚠',
    iconBg: 'bg-yellow-400'
  },
  info: {
    bgColor: 'bg-blue-500',
    icon: 'ℹ',
    iconBg: 'bg-blue-400'
  }
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    
    // Validate type
    const validType = TOAST_TYPES[type] ? type : 'info';
    
    const toast = {
      id,
      message,
      type: validType,
      duration,
      ...TOAST_TYPES[validType]
    };

    dispatch({ type: TOAST_ACTIONS.ADD_TOAST, payload: toast });

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: TOAST_ACTIONS.REMOVE_TOAST, payload: id });
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: TOAST_ACTIONS.REMOVE_TOAST, payload: id });
  }, []);

  const removeAllNotifications = useCallback(() => {
    dispatch({ type: TOAST_ACTIONS.REMOVE_ALL_TOASTS });
  }, []);

  const value = {
    toasts: state.toasts,
    showNotification,
    removeNotification,
    removeAllNotifications,
    // Convenience methods
    success: (message, duration) => showNotification(message, 'success', duration),
    error: (message, duration) => showNotification(message, 'error', duration),
    warning: (message, duration) => showNotification(message, 'warning', duration),
    info: (message, duration) => showNotification(message, 'info', duration)
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
