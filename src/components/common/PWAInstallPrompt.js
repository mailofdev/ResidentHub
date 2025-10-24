// src/components/common/PWAInstallPrompt.js
import React, { useState, useEffect } from 'react';
import { Button, Alert, Modal } from 'react-bootstrap';
import { isPWA, getPWADisplayMode } from '../../utils/serviceWorkerRegistration';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed or running as PWA
    setIsInstalled(isPWA());
    setIsStandalone(getPWADisplayMode() === 'standalone');

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA install prompt triggered');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`User response to the install prompt: ${outcome}`);
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Store dismissal in localStorage to avoid showing again immediately
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or running as standalone
  if (isInstalled || isStandalone || !showInstallPrompt) {
    return null;
  }

  // Check if user recently dismissed
  const dismissedTime = localStorage.getItem('pwa-install-dismissed');
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
    return null;
  }

  return (
    <>
      {/* Banner version for mobile */}
      <div className="d-block d-md-none">
        <Alert 
          variant="info" 
          className="mb-0 rounded-0 border-0"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1050,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none'
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className="bi bi-download me-2"></i>
              <small>Install ResidentHub for better experience</small>
            </div>
            <div>
              <Button 
                variant="light" 
                size="sm" 
                onClick={handleInstallClick}
                className="me-2"
              >
                Install
              </Button>
              <Button 
                variant="outline-light" 
                size="sm" 
                onClick={handleDismiss}
              >
                <i className="bi bi-x"></i>
              </Button>
            </div>
          </div>
        </Alert>
      </div>

      {/* Modal version for desktop */}
      <div className="d-none d-md-block">
        <Modal 
          show={showInstallPrompt} 
          onHide={handleDismiss}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi bi-download me-2"></i>
              Install ResidentHub
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center mb-3">
              <i className="bi bi-phone" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
            </div>
            <h5 className="text-center mb-3">Get the full experience!</h5>
            <p className="text-muted text-center mb-4">
              Install ResidentHub as a Progressive Web App for:
            </p>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                Faster loading and offline access
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                Push notifications for updates
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                App-like experience on your device
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                Easy access from home screen
              </li>
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleDismiss}>
              Maybe Later
            </Button>
            <Button variant="primary" onClick={handleInstallClick}>
              <i className="bi bi-download me-2"></i>
              Install App
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default PWAInstallPrompt;
