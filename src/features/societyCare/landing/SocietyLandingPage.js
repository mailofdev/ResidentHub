// src/features/societyCare/landing/SocietyLandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

const SocietyLandingPage = () => {
  return (
    <div style={{ background: 'var(--residenthub-gradient)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="text-center text-lg-start">
                <h1 className="display-4 fw-bold text-primary mb-4">
                  SocietyCare
                </h1>
                <p className="lead text-muted mb-4">
                  The complete apartment maintenance tracker for modern housing societies. 
                  Manage payments, complaints, and notices all in one place.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                  <Button as={Link} to="/register" variant="primary" size="lg">
                    Get Started
                  </Button>
                  <Button as={Link} to="/login" variant="outline-primary" size="lg">
                    Sign In
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <div className="bg-white rounded-3 shadow-lg p-4">
                  <i className="bi bi-building text-primary" style={{ fontSize: '8rem' }}></i>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <div className="py-5 bg-white">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="fw-bold">Why Choose SocietyCare?</h2>
              <p className="text-muted">Everything you need to manage your apartment society efficiently</p>
            </Col>
          </Row>
          
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-credit-card text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5 className="card-title">Payment Management</h5>
                  <p className="card-text text-muted">
                    Track maintenance payments, view payment history, and process payments online with Razorpay integration.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5 className="card-title">Complaint System</h5>
                  <p className="card-text text-muted">
                    Raise complaints, track their status, and get real-time updates. Admins can manage and resolve issues efficiently.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-megaphone text-info" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5 className="card-title">Notice Board</h5>
                  <p className="card-text text-muted">
                    Share important announcements, maintenance schedules, and community updates with all residents instantly.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Role-based Features */}
      <div className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="fw-bold">Built for Everyone</h2>
              <p className="text-muted">Different features for residents and administrators</p>
            </Col>
          </Row>
          
          <Row>
            <Col lg={6} className="mb-4">
              <Card className="h-100 border-0 shadow-lg">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-house-door me-2"></i>
                    For Residents
                  </h5>
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      View and pay maintenance dues
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Raise complaints and track status
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Read society notices and announcements
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Real-time updates and notifications
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6} className="mb-4">
              <Card className="h-100 border-0 shadow-lg">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-gear me-2"></i>
                    For Administrators
                  </h5>
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Manage residents and apartment details
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Track all payments and collections
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Handle and resolve complaints
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Post notices and announcements
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Demo Section */}
      <div className="py-5 bg-light">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="fw-bold mb-4">Try It Now</h2>
              <p className="text-muted mb-4">
                Use our demo accounts to explore the features
              </p>
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <Card className="border-0 shadow-sm">
                    <Card.Body>
                      <h6 className="card-title">Demo Accounts</h6>
                      <div className="text-start">
                        <p className="mb-2">
                          <strong>Admin:</strong> admin@society.com / admin123
                        </p>
                        <p className="mb-2">
                          <strong>Resident:</strong> resident@society.com / resident123
                        </p>
                      </div>
                      <Button as={Link} to="/login" variant="primary" className="w-100">
                        Sign In with Demo Account
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="py-4 bg-dark text-white">
        <Container>
          <Row className="text-center">
            <Col>
              <p className="mb-0">
                &copy; 2024 SocietyCare. Built with React, Firebase, and Bootstrap.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default SocietyLandingPage;
