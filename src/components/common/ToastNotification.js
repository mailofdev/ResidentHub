// src/components/common/ToastNotification.js
import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastNotification = ({ 
  show, 
  onClose, 
  title, 
  message, 
  variant = 'success',
  duration = 5000 
}) => {
  const [showToast, setShowToast] = useState(show);

  useEffect(() => {
    setShowToast(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setShowToast(false);
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const handleClose = () => {
    setShowToast(false);
    onClose();
  };

  const getIcon = () => {
    switch (variant) {
      case 'success': return 'bi-check-circle';
      case 'danger': return 'bi-exclamation-triangle';
      case 'warning': return 'bi-exclamation-circle';
      case 'info': return 'bi-info-circle';
      default: return 'bi-check-circle';
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast 
        show={showToast} 
        onClose={handleClose}
        bg={variant}
        autohide={false}
      >
        <Toast.Header closeButton>
          <i className={`bi ${getIcon()} me-2`}></i>
          <strong className="me-auto">{title}</strong>
        </Toast.Header>
        <Toast.Body className={variant === 'light' ? 'text-dark' : 'text-white'}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;
