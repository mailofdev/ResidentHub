// src/features/societyCare/auth/SocietyLoginForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { signInUserThunk } from './authThunks';
import { clearError } from './authSlice';
import ValidatedForm from '../../../components/forms/ValidatedForm';
import ValidatedField from '../../../components/forms/ValidatedField';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useToast } from '../../../contexts/ToastContext';

const SocietyLoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.societyAuth);
  const { showSuccess, showError } = useToast();
  
  const validationRules = {
    email: { required: true, email: true },
    password: { required: true, minLength: 6 }
  };

  const handleSubmit = async (formData) => {
    try {
      console.log('Attempting login with:', formData.email);
      const result = await dispatch(signInUserThunk(formData)).unwrap();
      console.log('Login result:', result);
      
      if (result) {
        console.log('User role:', result.role);
        showSuccess('Login Successful', `Welcome back, ${result.name}!`);
        
        // Redirect based on role
        if (result.role === 'Admin') {
          console.log('Redirecting to admin dashboard');
          navigate('/admin-dashboard');
        } else if (result.role === 'Resident') {
          console.log('Redirecting to resident dashboard');
          navigate('/resident-dashboard');
        } else {
          console.log('No role found, redirecting to resident dashboard as fallback');
          navigate('/resident-dashboard'); // Default fallback
        }
      } else {
        console.log('No result from login');
        showError('Login Failed', 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      showError('Login Failed', error || 'An error occurred during login. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Signing you in..." fullScreen />;
  }

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'var(--residenthub-gradient)' }}>
      <div className="container">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">SocietyCare</h2>
                  <p className="text-muted">Apartment Maintenance Tracker</p>
                </div>

                <ValidatedForm
                  onSubmit={handleSubmit}
                  validationRules={validationRules}
                  initialData={{ email: '', password: '' }}
                >
                  <ValidatedField
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />

                  <ValidatedField
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 mb-3"
                  >
                    Sign In
                  </Button>
                </ValidatedForm>

                <div className="text-center">
                  <Link to="/register" className="text-decoration-none">
                    Don't have an account? Register here
                  </Link>
                </div>

                <hr className="my-4" />

                <div className="text-center">
                  <small className="text-muted">
                    Demo Accounts:<br />
                    Admin: admin@society.com / admin123<br />
                    Resident: resident@society.com / resident123
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SocietyLoginForm;
