// src/contexts/ToastContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ title, message, variant = 'success', duration = 5000 }) => {
    const id = Date.now() + Math.random();
    const toast = { id, title, message, variant, duration };
    
    setToasts(prev => [...prev, toast]);
    
    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((title, message) => {
    return showToast({ title, message, variant: 'success' });
  }, [showToast]);

  const showError = useCallback((title, message) => {
    return showToast({ title, message, variant: 'danger' });
  }, [showToast]);

  const showWarning = useCallback((title, message) => {
    return showToast({ title, message, variant: 'warning' });
  }, [showToast]);

  const showInfo = useCallback((title, message) => {
    return showToast({ title, message, variant: 'info' });
  }, [showToast]);

  const value = {
    toasts,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
