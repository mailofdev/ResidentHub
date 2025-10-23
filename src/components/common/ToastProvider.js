// src/components/common/ToastProvider.js
import React from 'react';
import { ToastContainer } from 'react-bootstrap';
import ToastNotification from './ToastNotification';
import { useToast } from '../../contexts/ToastContext';

const ToastDisplay = () => {
  const { toasts, hideToast } = useToast();

  return (
    <ToastContainer position="top-end" className="p-3">
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          show={true}
          onClose={() => hideToast(toast.id)}
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          duration={toast.duration}
        />
      ))}
    </ToastContainer>
  );
};

export default ToastDisplay;
