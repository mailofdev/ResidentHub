// src/features/societyCare/payments/PaymentsPage.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Badge, Button, Alert, Modal, Form } from 'react-bootstrap';
import { 
  getResidentPaymentsThunk,
  createPaymentThunk,
  updatePaymentStatusThunk 
} from './paymentThunks';
import { setPayments } from './paymentSlice';
import { listenToPayments } from '../../../services/firebase/paymentService';
import { processMockPayment } from '../../../services/razorpay';

const PaymentsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.societyAuth);
  const { payments, loading } = useSelector(state => state.payments);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    description: '',
    amount: '',
    dueDate: ''
  });

  useEffect(() => {
    if (user?.uid) {
      // Load initial data
      dispatch(getResidentPaymentsThunk(user.uid));

      // Set up real-time listener
      const unsubscribe = listenToPayments(user.uid, (paymentsData) => {
        dispatch(setPayments(paymentsData));
      });

      return () => unsubscribe();
    }
  }, [dispatch, user?.uid]);

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    
    const paymentData = {
      ...paymentForm,
      residentId: user.uid,
      residentName: user.name,
      amount: parseFloat(paymentForm.amount),
      dueDate: paymentForm.dueDate,
      status: 'pending'
    };

    try {
      await dispatch(createPaymentThunk(paymentData)).unwrap();
      setShowPaymentModal(false);
      setPaymentForm({ description: '', amount: '', dueDate: '' });
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const handlePayNow = async (payment) => {
    try {
      // Show loading state
      setSelectedPayment(payment);
      
      // Process mock payment (replace with actual Razorpay integration)
      const paymentResponse = await processMockPayment({
        amount: payment.amount,
        description: payment.description,
        customerName: user.name,
        customerEmail: user.email,
        apartmentNumber: user.apartmentNumber
      });
      
      // Update payment status in Firebase
      await dispatch(updatePaymentStatusThunk({
        paymentId: payment.id,
        status: 'paid',
        paymentMethod: 'razorpay'
      })).unwrap();
      
      // Show success message
      alert('Payment successful! Thank you for your payment.');
      
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setSelectedPayment(null);
    }
  };

  const pendingPayments = payments?.filter(payment => payment.status === 'pending') || [];
  const paidPayments = payments?.filter(payment => payment.status === 'paid') || [];

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Maintenance Payments</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button 
            variant="primary" 
            onClick={() => setShowPaymentModal(true)}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Add Payment
          </Button>
        </div>
      </div>

      <Row>
        {/* Pending Payments */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Pending Payments</h5>
              <Badge bg="warning" pill>{pendingPayments.length}</Badge>
            </Card.Header>
            <Card.Body>
              {pendingPayments.length === 0 ? (
                <Alert variant="success" className="mb-0">
                  <i className="bi bi-check-circle me-2"></i>
                  No pending payments!
                </Alert>
              ) : (
                <div className="list-group list-group-flush">
                  {pendingPayments.map((payment) => (
                    <div key={payment.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{payment.description || 'Maintenance Payment'}</h6>
                        <small className="text-muted">
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="text-end">
                        <h6 className="mb-0 text-warning">₹{payment.amount}</h6>
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => handlePayNow(payment)}
                          disabled={selectedPayment?.id === payment.id}
                        >
                          {selectedPayment?.id === payment.id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                              Processing...
                            </>
                          ) : (
                            'Pay Now'
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Paid Payments */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Payment History</h5>
              <Badge bg="success" pill>{paidPayments.length}</Badge>
            </Card.Header>
            <Card.Body>
              {paidPayments.length === 0 ? (
                <Alert variant="info" className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  No payment history yet.
                </Alert>
              ) : (
                <div className="list-group list-group-flush">
                  {paidPayments.map((payment) => (
                    <div key={payment.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{payment.description || 'Maintenance Payment'}</h6>
                        <small className="text-muted">
                          Paid: {new Date(payment.paidAt).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="text-end">
                        <h6 className="mb-0 text-success">₹{payment.amount}</h6>
                        <Badge bg="success" pill>Paid</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Payment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreatePayment}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={paymentForm.description}
                onChange={(e) => setPaymentForm({...paymentForm, description: e.target.value})}
                placeholder="e.g., Monthly Maintenance"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                placeholder="Enter amount"
                required
                min="0"
                step="0.01"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={paymentForm.dueDate}
                onChange={(e) => setPaymentForm({...paymentForm, dueDate: e.target.value})}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Payment'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentsPage;
