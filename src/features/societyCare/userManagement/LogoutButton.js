// src/features/societyCare/userManagement/LogoutButton.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { signOutUserThunk } from '../auth/authThunks';

const LogoutButton = ({ variant = "outline-danger", size = "sm", showText = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(signOutUserThunk()).unwrap();
      setShowConfirmModal(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local session and redirect
      sessionStorage.removeItem('societycare_auth');
      navigate('/login');
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowConfirmModal(true)}
      >
        <i className="bi bi-box-arrow-right me-1"></i>
        {showText && 'Logout'}
      </Button>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to logout? You will need to sign in again to access your account.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LogoutButton;
