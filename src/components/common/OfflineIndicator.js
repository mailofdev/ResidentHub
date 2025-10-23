// src/components/common/OfflineIndicator.js
import React from 'react';
import { Alert } from 'react-bootstrap';
import { useOffline } from '../../hooks/useOffline';

const OfflineIndicator = () => {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <Alert variant="warning" className="mb-0 rounded-0 text-center">
      <i className="bi bi-wifi-off me-2"></i>
      You're currently offline. Some features may not be available.
    </Alert>
  );
};

export default OfflineIndicator;
