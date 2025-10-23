// src/features/societyCare/complaints/ComplaintsPage.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Badge, Button, Alert, Modal, Form } from 'react-bootstrap';
import { 
  getResidentComplaintsThunk,
  createComplaintThunk 
} from './complaintThunks';
import { setComplaints } from './complaintSlice';
import { listenToComplaints } from '../../../services/firebase/complaintService';

const ComplaintsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.societyAuth);
  const { complaints, loading } = useSelector(state => state.complaints);
  
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    category: '',
    description: '',
    priority: 'medium'
  });

  const complaintCategories = [
    'Plumbing',
    'Electrical',
    'Elevator',
    'Security',
    'Cleaning',
    'Parking',
    'Water Supply',
    'Other'
  ];

  useEffect(() => {
    if (user?.uid) {
      // Load initial data
      dispatch(getResidentComplaintsThunk(user.uid));

      // Set up real-time listener
      const unsubscribe = listenToComplaints(user.uid, (complaintsData) => {
        dispatch(setComplaints(complaintsData));
      });

      return () => unsubscribe();
    }
  }, [dispatch, user?.uid]);

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    
    const complaintData = {
      ...complaintForm,
      residentId: user.uid,
      residentName: user.name,
      apartmentNumber: user.apartmentNumber,
      status: 'open'
    };

    try {
      await dispatch(createComplaintThunk(complaintData)).unwrap();
      setShowComplaintModal(false);
      setComplaintForm({ category: '', description: '', priority: 'medium' });
    } catch (error) {
      console.error('Error creating complaint:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'warning';
      case 'resolved': return 'success';
      case 'in-progress': return 'info';
      default: return 'secondary';
    }
  };

  const openComplaints = complaints?.filter(complaint => complaint.status === 'open') || [];
  const resolvedComplaints = complaints?.filter(complaint => complaint.status === 'resolved') || [];

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Complaints & Issues</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button 
            variant="primary" 
            onClick={() => setShowComplaintModal(true)}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Raise Complaint
          </Button>
        </div>
      </div>

      <Row>
        {/* Open Complaints */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Open Complaints</h5>
              <Badge bg="warning" pill>{openComplaints.length}</Badge>
            </Card.Header>
            <Card.Body>
              {openComplaints.length === 0 ? (
                <Alert variant="success" className="mb-0">
                  <i className="bi bi-check-circle me-2"></i>
                  No open complaints!
                </Alert>
              ) : (
                <div className="list-group list-group-flush">
                  {openComplaints.map((complaint) => (
                    <div key={complaint.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <h6 className="mb-0 me-2">{complaint.category}</h6>
                            <Badge bg={getPriorityColor(complaint.priority)} pill>
                              {complaint.priority}
                            </Badge>
                          </div>
                          <p className="mb-2 text-muted small">
                            {complaint.description}
                          </p>
                          <small className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <Badge bg={getStatusColor(complaint.status)} pill>
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

        {/* Resolved Complaints */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Resolved Complaints</h5>
              <Badge bg="success" pill>{resolvedComplaints.length}</Badge>
            </Card.Header>
            <Card.Body>
              {resolvedComplaints.length === 0 ? (
                <Alert variant="info" className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  No resolved complaints yet.
                </Alert>
              ) : (
                <div className="list-group list-group-flush">
                  {resolvedComplaints.map((complaint) => (
                    <div key={complaint.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <h6 className="mb-0 me-2">{complaint.category}</h6>
                            <Badge bg={getPriorityColor(complaint.priority)} pill>
                              {complaint.priority}
                            </Badge>
                          </div>
                          <p className="mb-2 text-muted small">
                            {complaint.description}
                          </p>
                          <small className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}
                          </small>
                          {complaint.adminNotes && (
                            <div className="mt-2">
                              <small className="text-success">
                                <strong>Admin Note:</strong> {complaint.adminNotes}
                              </small>
                            </div>
                          )}
                        </div>
                        <Badge bg={getStatusColor(complaint.status)} pill>
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

      {/* Raise Complaint Modal */}
      <Modal show={showComplaintModal} onHide={() => setShowComplaintModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Raise New Complaint</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateComplaint}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({...complaintForm, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {complaintCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={complaintForm.priority}
                    onChange={(e) => setComplaintForm({...complaintForm, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={complaintForm.description}
                onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                placeholder="Please describe the issue in detail..."
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowComplaintModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ComplaintsPage;
