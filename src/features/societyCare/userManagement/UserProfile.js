// src/features/societyCare/userManagement/UserProfile.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Form, Button, Alert, Modal, Badge } from 'react-bootstrap';
import { updateUserProfileThunk } from '../auth/authThunks';
import { updateUserProfile } from '../auth/authSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.societyAuth);
  const { loading, error } = useSelector(state => state.societyAuth);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    apartmentNumber: user?.apartmentNumber || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(updateUserProfileThunk({
        uid: user.uid,
        userData: formData
      })).unwrap();
      
      // Update local state
      dispatch(updateUserProfile(formData));
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'danger';
      case 'Resident': return 'primary';
      default: return 'secondary';
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">User Profile</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button 
            variant="outline-primary" 
            onClick={() => setShowEditModal(true)}
          >
            <i className="bi bi-pencil me-1"></i>
            Edit Profile
          </Button>
        </div>
      </div>

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Profile Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Full Name</label>
                    <p className="form-control-plaintext">{user?.name || 'Not provided'}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email Address</label>
                    <p className="form-control-plaintext">{user?.email || 'Not provided'}</p>
                  </div>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Phone Number</label>
                    <p className="form-control-plaintext">{user?.phone || 'Not provided'}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Apartment Number</label>
                    <p className="form-control-plaintext">{user?.apartmentNumber || 'Not provided'}</p>
                  </div>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Role</label>
                    <div>
                      <Badge bg={getRoleBadgeColor(user?.role)} pill>
                        {user?.role || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">User ID</label>
                    <p className="form-control-plaintext small text-muted">{user?.uid || 'Not available'}</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Account Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-check-circle text-success me-2"></i>
                <span>Account Active</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-shield-check text-primary me-2"></i>
                <span>Email Verified</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-calendar me-2"></i>
                <span>Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="mt-3">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" size="sm">
                  <i className="bi bi-key me-1"></i>
                  Change Password
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <i className="bi bi-download me-1"></i>
                  Export Data
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
              />
              <Form.Text className="text-muted">
                Email cannot be changed
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Apartment Number</Form.Label>
              <Form.Control
                type="text"
                name="apartmentNumber"
                value={formData.apartmentNumber}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;
