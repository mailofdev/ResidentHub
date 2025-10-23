// src/features/societyCare/dashboard/EnhancedResidentDashboard.js
import React, { useEffect, useState, useMemo } from 'react';
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
import { formatCurrency, formatDate } from '../../../utils/validation';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useToast } from '../../../contexts/ToastContext';
import { useOffline } from '../../../hooks/useOffline';
import OfflineIndicator from '../../../components/common/OfflineIndicator';
import { getCachedData, setCachedData, CACHE_KEYS } from '../../../utils/cache';

const EnhancedResidentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.societyAuth);
  const { payments, loading: paymentsLoading, error: paymentsError } = useSelector(state => state.payments);
  const { complaints, loading: complaintsLoading, error: complaintsError } = useSelector(state => state.complaints);
  const { notices, loading: noticesLoading, error: noticesError } = useSelector(state => state.notices);
  const { showError, showWarning } = useToast();
  const isOffline = useOffline();
  
  const [isInitializing, setIsInitializing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Calculate statistics with useMemo to prevent unnecessary recalculations
  const statistics = useMemo(() => {
    const pendingPayments = payments.filter(p => p.status === 'pending');
    const overduePayments = payments.filter(p => 
      p.status === 'pending' && new Date(p.dueDate) < new Date()
    );
    const openComplaints = complaints.filter(c => c.status === 'open');
    const recentNotices = notices.slice(0, 3);

    const totalPendingAmount = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalOverdueAmount = overduePayments.reduce((sum, payment) => sum + payment.amount, 0);

    return {
      pendingPayments,
      overduePayments,
      openComplaints,
      recentNotices,
      totalPendingAmount,
      totalOverdueAmount
    };
  }, [payments, complaints, notices]);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setIsInitializing(true);
        
        // Try to load from cache first
        const cachedPayments = getCachedData(CACHE_KEYS.PAYMENTS);
        const cachedComplaints = getCachedData(CACHE_KEYS.COMPLAINTS);
        const cachedNotices = getCachedData(CACHE_KEYS.NOTICES);

        if (cachedPayments && !isOffline) {
          dispatch(setPayments(cachedPayments));
        } else {
          await dispatch(getResidentPaymentsThunk(user.uid)).unwrap();
        }

        if (cachedComplaints && !isOffline) {
          dispatch(setComplaints(cachedComplaints));
        } else {
          await dispatch(getResidentComplaintsThunk(user.uid)).unwrap();
        }

        if (cachedNotices && !isOffline) {
          dispatch(setNotices(cachedNotices));
        } else {
          await dispatch(getAllNoticesThunk()).unwrap();
        }

        setRetryCount(0);
      } catch (error) {
        console.error('Dashboard initialization error:', error);
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => initializeDashboard(), 2000 * retryCount);
        } else {
          showError('Dashboard Error', 'Failed to load dashboard data. Please refresh the page.');
        }
      } finally {
        setIsInitializing(false);
      }
    };

    if (user?.uid) {
      initializeDashboard();
    }
  }, [dispatch, user?.uid, retryCount, isOffline, showError]);

  // Set up real-time listeners
  useEffect(() => {
    if (!user?.uid || isOffline) return;

    const unsubscribePayments = listenToPayments(user.uid, (paymentsData) => {
      dispatch(setPayments(paymentsData));
      setCachedData(CACHE_KEYS.PAYMENTS, paymentsData);
    });

    const unsubscribeComplaints = listenToComplaints(user.uid, (complaintsData) => {
      dispatch(setComplaints(complaintsData));
      setCachedData(CACHE_KEYS.COMPLAINTS, complaintsData);
    });

    const unsubscribeNotices = listenToNotices((noticesData) => {
      dispatch(setNotices(noticesData));
      setCachedData(CACHE_KEYS.NOTICES, noticesData);
    });

    return () => {
      unsubscribePayments();
      unsubscribeComplaints();
      unsubscribeNotices();
    };
  }, [dispatch, user?.uid, isOffline]);

  // Show offline warning
  useEffect(() => {
    if (isOffline) {
      showWarning('Offline Mode', 'You are currently offline. Some data may not be up to date.');
    }
  }, [isOffline, showWarning]);

  if (isInitializing) {
    return <LoadingSpinner text="Loading your dashboard..." fullScreen />;
  }

  const handleRetry = () => {
    setRetryCount(0);
    window.location.reload();
  };

  return (
    <div className="container-fluid py-4">
      <OfflineIndicator />
      
      {/* Error Display */}
      {(paymentsError || complaintsError || noticesError) && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Unable to load some data</Alert.Heading>
          <p>There was an error loading your dashboard data. Please try again.</p>
          <Button variant="outline-danger" size="sm" onClick={handleRetry}>
            Retry
          </Button>
        </Alert>
      )}

      {/* Welcome Section */}
      <div className="mb-4">
        <h2 className="fw-bold text-primary">Welcome back, {user?.name}!</h2>
        <p className="text-muted">Here's what's happening in your apartment community</p>
      </div>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-primary mb-2">
                <i className="bi bi-currency-rupee fs-1"></i>
              </div>
              <h5 className="fw-bold">{formatCurrency(statistics.totalPendingAmount)}</h5>
              <p className="text-muted mb-0">Pending Payments</p>
              <Badge bg="warning" className="mt-2">
                {statistics.pendingPayments.length} items
              </Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-danger mb-2">
                <i className="bi bi-exclamation-triangle fs-1"></i>
              </div>
              <h5 className="fw-bold">{formatCurrency(statistics.totalOverdueAmount)}</h5>
              <p className="text-muted mb-0">Overdue Amount</p>
              <Badge bg="danger" className="mt-2">
                {statistics.overduePayments.length} items
              </Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-info mb-2">
                <i className="bi bi-chat-dots fs-1"></i>
              </div>
              <h5 className="fw-bold">{statistics.openComplaints.length}</h5>
              <p className="text-muted mb-0">Open Complaints</p>
              <Badge bg="info" className="mt-2">
                Active
              </Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-success mb-2">
                <i className="bi bi-bell fs-1"></i>
              </div>
              <h5 className="fw-bold">{notices.length}</h5>
              <p className="text-muted mb-0">Total Notices</p>
              <Badge bg="success" className="mt-2">
                Latest
              </Badge>
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
                <Col md={3}>
                  <Button 
                    variant="primary" 
                    className="w-100 mb-2"
                    onClick={() => navigate('/payments')}
                    disabled={isOffline}
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    View Payments
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="outline-primary" 
                    className="w-100 mb-2"
                    onClick={() => navigate('/complaints')}
                    disabled={isOffline}
                  >
                    <i className="bi bi-chat-dots me-2"></i>
                    Raise Complaint
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="outline-primary" 
                    className="w-100 mb-2"
                    onClick={() => navigate('/notices')}
                    disabled={isOffline}
                  >
                    <i className="bi bi-bell me-2"></i>
                    View Notices
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="outline-secondary" 
                    className="w-100 mb-2"
                    onClick={() => navigate('/profile')}
                    disabled={isOffline}
                  >
                    <i className="bi bi-person me-2"></i>
                    My Profile
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0">Recent Payments</h6>
            </Card.Header>
            <Card.Body>
              {paymentsLoading ? (
                <LoadingSpinner text="Loading payments..." />
              ) : payments.length === 0 ? (
                <p className="text-muted text-center">No payments found</p>
              ) : (
                <div className="list-group list-group-flush">
                  {payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{payment.description}</h6>
                          <small className="text-muted">
                            Due: {formatDate(payment.dueDate)}
                          </small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold">{formatCurrency(payment.amount)}</div>
                          <Badge 
                            bg={payment.status === 'paid' ? 'success' : 
                                payment.status === 'pending' ? 'warning' : 'secondary'}
                          >
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0">Recent Complaints</h6>
            </Card.Header>
            <Card.Body>
              {complaintsLoading ? (
                <LoadingSpinner text="Loading complaints..." />
              ) : complaints.length === 0 ? (
                <p className="text-muted text-center">No complaints found</p>
              ) : (
                <div className="list-group list-group-flush">
                  {complaints.slice(0, 5).map((complaint) => (
                    <div key={complaint.id} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{complaint.subject}</h6>
                          <p className="mb-1 text-muted small">
                            {complaint.description.substring(0, 60)}...
                          </p>
                          <small className="text-muted">
                            {formatDate(complaint.createdAt)}
                          </small>
                        </div>
                        <Badge 
                          bg={complaint.status === 'resolved' ? 'success' : 
                              complaint.status === 'in_progress' ? 'info' : 'warning'}
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
      {statistics.recentNotices.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h6 className="mb-0">Latest Notices</h6>
              </Card.Header>
              <Card.Body>
                <div className="list-group list-group-flush">
                  {statistics.recentNotices.map((notice) => (
                    <div key={notice.id} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{notice.title}</h6>
                          <p className="mb-1 text-muted">
                            {notice.content.substring(0, 100)}...
                          </p>
                          <small className="text-muted">
                            {formatDate(notice.createdAt)}
                          </small>
                        </div>
                        <Badge bg="primary">
                          {notice.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default EnhancedResidentDashboard;
