// src/components/common/AccessibleButton.js
import React from 'react';
import { Button } from 'react-bootstrap';

const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
  ariaDescribedBy,
  ...props 
}) => {
  const handleKeyDown = (e) => {
    // Handle Enter and Space key presses
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && !loading && onClick) {
        onClick(e);
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || loading}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {loading && (
        <>
          <span 
            className="spinner-border spinner-border-sm me-2" 
            role="status" 
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Loading...</span>
        </>
      )}
      {children}
    </Button>
  );
};

export default AccessibleButton;
