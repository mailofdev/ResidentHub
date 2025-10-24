// src/features/societyCare/maintenance/MaintenanceForm.js
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { formatDate } from '../../../utils/validation';

const MaintenanceForm = ({ show, onHide, onSubmit, initialData, residents }) => {
  const [formData, setFormData] = useState({
    flatNumber: '',
    residentId: '',
    residentName: '',
    description: '',
    amount: '',
    dueDate: '',
    category: 'maintenance',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        flatNumber: initialData.flatNumber || '',
        residentId: initialData.residentId || '',
        residentName: initialData.residentName || '',
        description: initialData.description || '',
        amount: initialData.amount || '',
        dueDate: initialData.dueDate ? formatDate(initialData.dueDate, 'YYYY-MM-DD') : '',
        category: initialData.category || 'maintenance',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        flatNumber: '',
        residentId: '',
        residentName: '',
        description: '',
        amount: '',
        dueDate: '',
        category: 'maintenance',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleResidentChange = (e) => {
    const residentId = e.target.value;
    const resident = residents.find(r => r.id === residentId);
    
    setFormData(prev => ({
      ...prev,
      residentId,
      residentName: resident ? resident.name : '',
      flatNumber: resident ? resident.flatNumber : ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.flatNumber.trim()) {
      newErrors.flatNumber = 'Flat number is required';
    }

    if (!formData.residentId) {
      newErrors.residentId = 'Please select a resident';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      flatNumber: '',
      residentId: '',
      residentName: '',
      description: '',
      amount: '',
      dueDate: '',
      category: 'maintenance',
      notes: ''
    });
    setErrors({});
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-receipt me-2"></i>
          {initialData ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Resident *</Form.Label>
                <Form.Select
                  name="residentId"
                  value={formData.residentId}
                  onChange={handleResidentChange}
                  isInvalid={!!errors.residentId}
                  disabled={isSubmitting}
                >
                  <option value="">Select a resident</option>
                  {residents?.map(resident => (
                    <option key={resident.id} value={resident.id}>
                      {resident.name} - {resident.flatNumber}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.residentId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Flat Number *</Form.Label>
                <Form.Control
                  type="text"
                  name="flatNumber"
                  value={formData.flatNumber}
                  onChange={handleInputChange}
                  isInvalid={!!errors.flatNumber}
                  disabled={isSubmitting}
                  placeholder="e.g., A-101"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.flatNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="water">Water Charges</option>
                  <option value="electricity">Electricity</option>
                  <option value="parking">Parking</option>
                  <option value="security">Security</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Amount (₹) *</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  isInvalid={!!errors.amount}
                  disabled={isSubmitting}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              isInvalid={!!errors.description}
              disabled={isSubmitting}
              placeholder="Enter maintenance description..."
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Due Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  isInvalid={!!errors.dueDate}
                  disabled={isSubmitting}
                  min={new Date().toISOString().split('T')[0]}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dueDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Additional notes (optional)"
                />
              </Form.Group>
            </Col>
          </Row>

          {Object.keys(errors).length > 0 && (
            <Alert variant="danger">
              <Alert.Heading>Please fix the following errors:</Alert.Heading>
              <ul className="mb-0">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <i className="bi bi-check me-2"></i>
                {initialData ? 'Update Record' : 'Create Record'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MaintenanceForm;
