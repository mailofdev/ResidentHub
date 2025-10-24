// src/features/societyCare/dashboard/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Badge, Button, Alert, Table } from 'react-bootstrap';
import { 
  getAllPaymentsThunk 
} from '../payments/paymentThunks';
import { 
  getAllComplaintsThunk 
} from '../complaints/complaintThunks';
import { 
  getAllNoticesThunk 
} from '../notices/noticeThunks';
import { 
  getAllResidentsThunk 
} from '../residents/residentThunks';
import { 
  setPayments 
} from '../payments/paymentSlice';
import { 
  setComplaints 
} from '../complaints/complaintSlice';
import { 
  setNotices 
} from '../notices/noticeSlice';
import { 
  setResidents 
} from '../residents/residentSlice';
import { listenToAllPayments } from '../../../services/firebase/paymentService';
import { listenToAllComplaints } from '../../../services/firebase/complaintService';
import { listenToNotices } from '../../../services/firebase/noticeService';
import { listenToResidents } from '../../../services/firebase/residentService';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.societyAuth);
  const { payments } = useSelector(state => state.payments);
  const { complaints } = useSelector(state => state.complaints);
  const { notices } = useSelector(state => state.notices);
  const { residents } = useSelector(state => state.residents);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(getAllPaymentsThunk()),
          dispatch(getAllComplaintsThunk()),
          dispatch(getAllNoticesThunk()),
          dispatch(getAllResidentsThunk())
        ]);
      } catch (error) {
        console.error('Error loading admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up real-time listeners
    const unsubscribePayments = listenToAllPayments((paymentsData) => {
      dispatch(setPayments(paymentsData));
    });

    const unsubscribeComplaints = listenToAllComplaints((complaintsData) => {
      dispatch(setComplaints(complaintsData));
    });

    const unsubscribeNotices = listenToNotices((noticesData) => {
      dispatch(setNotices(noticesData));
    });

    const unsubscribeResidents = listenToResidents((residentsData) => {
      dispatch(setResidents(residentsData));
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribePayments();
      unsubscribeComplaints();
      unsubscribeNotices();
      unsubscribeResidents();
    };
  }, [dispatch]);

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
  const totalResidents = residents?.length || 0;
  const recentNotices = notices?.slice(0, 3) || [];

  const totalPendingAmount = pendingPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const totalPaidAmount = paidPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Admin Dashboard</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <Button variant="outline-primary" size="sm">
              <i className="bi bi-download me-1"></i>
              Export Report
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
                <i className="bi bi-people text-primary fs-1"></i>
              </div>
              <h5 className="card-title text-primary">Total Residents</h5>
              <h3 className="mb-0">{totalResidents}</h3>
              <small className="text-muted">Registered users</small>
            </Card.Body>
          </Card>
        </Col>
        
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
                <i className="bi bi-check-circle text-success fs-1"></i>
              </div>
              <h5 className="card-title text-success">Collected Amount</h5>
              <h3 className="mb-0">₹{totalPaidAmount.toLocaleString()}</h3>
              <small className="text-muted">This month</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={2}>
                  <Button 
                    variant="primary" 
                    className="w-100 mb-2"
                    onClick={() => window.location.href = '/maintenance'}
                  >
                    <i className="bi bi-receipt me-2"></i>
                    Maintenance
                  </Button>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="outline-primary" 
                    className="w-100 mb-2"
                    onClick={() => window.location.href = '/user-management'}
                  >
                    <i className="bi bi-people me-2"></i>
                    Residents
                  </Button>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="outline-primary" 
                    className="w-100 mb-2"
                    onClick={() => window.location.href = '/complaints'}
                  >
                    <i className="bi bi-chat-dots me-2"></i>
                    Complaints
                  </Button>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="outline-primary" 
                    className="w-100 mb-2"
                    onClick={() => window.location.href = '/notices'}
                  >
                    <i className="bi bi-bell me-2"></i>
                    Notices
                  </Button>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="outline-secondary" 
                    className="w-100 mb-2"
                    onClick={() => window.location.href = '/settings'}
                  >
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </Button>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="outline-secondary" 
                    className="w-100 mb-2"
                    onClick={() => window.location.href = '/profile'}
                  >
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Payments */}
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Payments</h5>
              <Badge bg="info" pill>{payments.length}</Badge>
            </Card.Header>
            <Card.Body>
              {payments.length === 0 ? (
                <Alert variant="info" className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  No payments recorded yet.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover size="sm">
                    <thead>
                      <tr>
                        <th>Resident</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.slice(0, 5).map((payment) => (
                        <tr key={payment.id}>
                          <td>
                            <small>{payment.residentName || 'Unknown'}</small>
                          </td>
                          <td>₹{payment.amount}</td>
                          <td>
                            <Badge 
                              bg={payment.status === 'paid' ? 'success' : 'warning'}
                              pill
                            >
                              {payment.status}
                            </Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
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
                <div className="table-responsive">
                  <Table hover size="sm">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Resident</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.slice(0, 5).map((complaint) => (
                        <tr key={complaint.id}>
                          <td>
                            <small>{complaint.category}</small>
                          </td>
                          <td>
                            <small>{complaint.residentName || 'Unknown'}</small>
                          </td>
                          <td>
                            <Badge 
                              bg={complaint.status === 'resolved' ? 'success' : 'warning'}
                              pill
                            >
                              {complaint.status}
                            </Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
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
                  No notices posted yet.
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

export default AdminDashboard;
