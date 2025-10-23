// src/features/societyCare/dashboard/ResidentDashboard.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Badge, Button, Alert } from 'react-bootstrap';
import { 
  getResidentPaymentsThunk
} from '../payments/paymentThunks';
import { 
  getResidentComplaintsThunk 
} from '../complaints/complaintThunks';
import { 
  getAllNoticesThunk 
} from '../notices/noticeThunks';
import { 
  setPayments 
} from '../payments/paymentSlice';
import { 
  setComplaints 
} from '../complaints/complaintSlice';
import { 
  setNotices 
} from '../notices/noticeSlice';
import { listenToPayments } from '../../../services/firebase/paymentService';
import { listenToComplaints } from '../../../services/firebase/complaintService';
import { listenToNotices } from '../../../services/firebase/noticeService';

const ResidentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.societyAuth);
  const { payments } = useSelector(state => state.payments);
  const { complaints } = useSelector(state => state.complaints);
  const { notices } = useSelector(state => state.notices);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      // Load initial data
      const loadData = async () => {
        try {
          await Promise.all([
            dispatch(getResidentPaymentsThunk(user.uid)),
            dispatch(getResidentComplaintsThunk(user.uid)),
            dispatch(getAllNoticesThunk())
          ]);
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        } finally {
          setLoading(false);
        }
      };

      loadData();

      // Set up real-time listeners
      const unsubscribePayments = listenToPayments(user.uid, (paymentsData) => {
        dispatch(setPayments(paymentsData));
      });

      const unsubscribeComplaints = listenToComplaints(user.uid, (complaintsData) => {
        dispatch(setComplaints(complaintsData));
      });

      const unsubscribeNotices = listenToNotices((noticesData) => {
        dispatch(setNotices(noticesData));
      });

      // Cleanup listeners on unmount
      return () => {
        unsubscribePayments();
        unsubscribeComplaints();
        unsubscribeNotices();
      };
    }
  }, [dispatch, user?.uid]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const pendingPayments = payments?.filter(payment => payment.status === 'pending') || [];
  const paidPayments = payments?.filter(payment => payment.status === 'paid') || [];
  const openComplaints = complaints?.filter(complaint => complaint.status === 'open') || [];
  const resolvedComplaints = complaints?.filter(complaint => complaint.status === 'resolved') || [];
  const recentNotices = notices?.slice(0, 3) || [];

  const totalPendingAmount = pendingPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Welcome back, {user?.name || 'Resident'}!</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <Button variant="outline-primary" size="sm">
              <i className="bi bi-download me-1"></i>
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-credit-card text-warning fs-1"></i>
              </div>
              <h5 className="card-title text-warning">Pending Payments</h5>
              <h3 className="mb-0">{pendingPayments.length}</h3>
              <small className="text-muted">₹{totalPendingAmount.toLocaleString()}</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-check-circle text-success fs-1"></i>
              </div>
              <h5 className="card-title text-success">Paid Payments</h5>
              <h3 className="mb-0">{paidPayments.length}</h3>
              <small className="text-muted">This month</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-exclamation-triangle text-danger fs-1"></i>
              </div>
              <h5 className="card-title text-danger">Open Complaints</h5>
              <h3 className="mb-0">{openComplaints.length}</h3>
              <small className="text-muted">Needs attention</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-megaphone text-info fs-1"></i>
              </div>
              <h5 className="card-title text-info">New Notices</h5>
              <h3 className="mb-0">{recentNotices.length}</h3>
              <small className="text-muted">Recent updates</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Pending Payments */}
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Pending Payments</h5>
              <Badge bg="warning" pill>{pendingPayments.length}</Badge>
            </Card.Header>
            <Card.Body>
              {pendingPayments.length === 0 ? (
                <Alert variant="success" className="mb-0">
                  <i className="bi bi-check-circle me-2"></i>
                  No pending payments! You're all caught up.
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
                        <Button size="sm" variant="outline-primary">
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Complaints */}
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Complaints</h5>
              <Badge bg="info" pill>{complaints.length}</Badge>
            </Card.Header>
            <Card.Body>
              {complaints.length === 0 ? (
                <Alert variant="info" className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  No complaints submitted yet.
                </Alert>
              ) : (
                <div className="list-group list-group-flush">
                  {complaints.slice(0, 3).map((complaint) => (
                    <div key={complaint.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{complaint.category}</h6>
                          <p className="mb-1 text-muted small">
                            {complaint.description?.substring(0, 60)}...
                          </p>
                          <small className="text-muted">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <Badge 
                          bg={complaint.status === 'open' ? 'warning' : 'success'}
                          pill
                        >
                          {complaint.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Notices */}
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Notices</h5>
              <Badge bg="primary" pill>{notices.length}</Badge>
            </Card.Header>
            <Card.Body>
              {notices.length === 0 ? (
                <Alert variant="info" className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  No notices available at the moment.
                </Alert>
              ) : (
                <div className="row">
                  {recentNotices.map((notice) => (
                    <Col md={4} key={notice.id} className="mb-3">
                      <Card className="h-100 border-0 bg-light">
                        <Card.Body>
                          <h6 className="card-title">{notice.title}</h6>
                          <p className="card-text small text-muted">
                            {notice.description?.substring(0, 100)}...
                          </p>
                          <small className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            {new Date(notice.createdAt).toLocaleDateString()}
                          </small>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ResidentDashboard;
