// src/components/common/LoadingSpinner.js
import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  centered = true, 
  fullScreen = false,
  variant = 'primary' 
}) => {
  const sizeMap = {
    sm: 'sm',
    md: '',
    lg: 'lg'
  };

  const spinnerSize = sizeMap[size] || '';

  const content = (
    <div className={`d-flex flex-column align-items-center ${centered ? 'justify-content-center' : ''}`}
         style={fullScreen ? { minHeight: '100vh' } : { minHeight: '200px' }}>
      <Spinner 
        animation="border" 
        variant={variant} 
        size={spinnerSize}
        role="status"
        aria-label="Loading"
      >
        <span className="visually-hidden">{text}</span>
      </Spinner>
      {text && (
        <div className="mt-2 text-muted">
          {text}
        </div>
      )}
    </div>
  );

  return content;
};

export default LoadingSpinner;
