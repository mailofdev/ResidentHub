// src/features/societyCare/maintenance/PaymentModal.js
import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { formatCurrency, formatDate } from '../../../utils/validation';

const PaymentModal = ({ show, onHide, onSubmit, record }) => {
  const [formData, setFormData] = useState({
    paymentMethod: 'cash',
    transactionId: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    if (formData.paymentMethod !== 'cash' && !formData.transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required for non-cash payments';
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
      await onSubmit(formData);
    } catch (error) {
      console.error('Payment submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      paymentMethod: 'cash',
      transactionId: '',
      notes: ''
    });
    setErrors({});
    onHide();
  };

  if (!record) return null;

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-credit-card me-2"></i>
          Mark Payment as Paid
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Record Details */}
          <Alert variant="info" className="mb-4">
            <Alert.Heading>Payment Details</Alert.Heading>
            <Row>
              <Col md={6}>
                <strong>Flat Number:</strong> {record.flatNumber}<br />
                <strong>Resident:</strong> {record.residentName}<br />
                <strong>Description:</strong> {record.description}
              </Col>
              <Col md={6}>
                <strong>Amount:</strong> {formatCurrency(record.amount)}<br />
                <strong>Due Date:</strong> {formatDate(record.dueDate)}<br />
                <strong>Category:</strong> {record.category}
              </Col>
            </Row>
          </Alert>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Payment Method *</Form.Label>
                <Form.Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  isInvalid={!!errors.paymentMethod}
                  disabled={isSubmitting}
                >
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card Payment</option>
                  <option value="online">Online Payment</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.paymentMethod}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Transaction ID {formData.paymentMethod !== 'cash' && '*'}
                </Form.Label>
                <Form.Control
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  isInvalid={!!errors.transactionId}
                  disabled={isSubmitting}
                  placeholder={
                    formData.paymentMethod === 'cash' 
                      ? 'Optional for cash payments' 
                      : 'Enter transaction ID'
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.transactionId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Payment Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              disabled={isSubmitting}
              placeholder="Additional payment notes (optional)"
            />
          </Form.Group>

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

          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <strong>Important:</strong> Once marked as paid, this action cannot be undone. 
            Please verify all payment details before confirming.
          </Alert>
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
            variant="success" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Mark as Paid
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PaymentModal;
