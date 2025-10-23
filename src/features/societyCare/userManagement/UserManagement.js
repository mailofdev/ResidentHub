// src/features/societyCare/userManagement/UserManagement.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { 
  getAllResidentsThunk,
  createResidentThunk,
  updateResidentThunk,
  deleteResidentThunk
} from '../residents/residentThunks';
import { setResidents } from '../residents/residentSlice';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.societyAuth);
  const { residents, loading } = useSelector(state => state.residents);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    apartmentNumber: '',
    role: 'Resident'
  });

  useEffect(() => {
    if (user?.role === 'Admin') {
      dispatch(getAllResidentsThunk());
    }
  }, [dispatch, user?.role]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddResident = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(createResidentThunk(formData)).unwrap();
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        apartmentNumber: '',
        role: 'Resident'
      });
    } catch (error) {
      console.error('Error adding resident:', error);
    }
  };

  const handleEditResident = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(updateResidentThunk({
        residentId: selectedResident.id,
        residentData: formData
      })).unwrap();
      setShowEditModal(false);
      setSelectedResident(null);
    } catch (error) {
      console.error('Error updating resident:', error);
    }
  };

  const handleDeleteResident = async (residentId) => {
    if (window.confirm('Are you sure you want to delete this resident?')) {
      try {
        await dispatch(deleteResidentThunk(residentId)).unwrap();
      } catch (error) {
        console.error('Error deleting resident:', error);
      }
    }
  };

  const openEditModal = (resident) => {
    setSelectedResident(resident);
    setFormData({
      name: resident.name,
      email: resident.email,
      phone: resident.phone,
      apartmentNumber: resident.apartmentNumber,
      role: resident.role
    });
    setShowEditModal(true);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'danger';
      case 'Resident': return 'primary';
      default: return 'secondary';
    }
  };

  if (user?.role !== 'Admin') {
    return (
      <div className="container-fluid">
        <Alert variant="warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          You don't have permission to access this page.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">User Management</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button 
            variant="primary" 
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Add Resident
          </Button>
        </div>
      </div>

      <Card>
        <Card.Header>
          <h5 className="mb-0">All Residents</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Apartment</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {residents.map((resident) => (
                    <tr key={resident.id}>
                      <td>{resident.name}</td>
                      <td>{resident.email}</td>
                      <td>{resident.phone || 'Not provided'}</td>
                      <td>{resident.apartmentNumber || 'Not provided'}</td>
                      <td>
                        <Badge bg={getRoleBadgeColor(resident.role)} pill>
                          {resident.role}
                        </Badge>
                      </td>
                      <td>
                        {resident.createdAt ? new Date(resident.createdAt).toLocaleDateString() : 'Unknown'}
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openEditModal(resident)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteResident(resident.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add Resident Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Resident</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddResident}>
          <Modal.Body>
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
              />
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
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Resident">Resident</option>
                <option value="Admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Resident'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Resident Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Resident</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditResident}>
          <Modal.Body>
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
              />
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
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Resident">Resident</option>
                <option value="Admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Resident'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
