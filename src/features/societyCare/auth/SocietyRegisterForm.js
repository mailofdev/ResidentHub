// src/features/societyCare/auth/SocietyRegisterForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { registerUser } from './authThunks';
import { clearError } from './authSlice';
import ValidatedForm from '../../../components/forms/ValidatedForm';
import ValidatedField from '../../../components/forms/ValidatedField';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useToast } from '../../../contexts/ToastContext';

const SocietyRegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.societyAuth);
  const { showSuccess, showError } = useToast();
  
  const validationRules = {
    name: { required: true, minLength: 2 },
    email: { required: true, email: true },
    password: { required: true, minLength: 6 },
    confirmPassword: { required: true },
    phone: { required: true, phone: true },
    apartmentNumber: { required: true, apartmentNumber: true },
    role: { required: true }
  };

  const handleSubmit = async (formData) => {
    try {
      // Additional validation for password confirmation
      if (formData.password !== formData.confirmPassword) {
        showError('Validation Error', 'Passwords do not match');
        return;
      }
      
      const userData = {
        name: formData.name,
        role: formData.role,
        apartmentNumber: formData.apartmentNumber,
        phone: formData.phone
      };

      const result = await dispatch(registerUser({
        email: formData.email,
        password: formData.password,
        userData
      })).unwrap();
      
      if (result) {
        showSuccess('Registration Successful', `Welcome to SocietyCare, ${result.name}!`);
        
        // Redirect based on role
        if (result.role === 'Admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/resident-dashboard');
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
      showError('Registration Failed', error || 'An error occurred during registration. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Creating your account..." fullScreen />;
  }

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'var(--residenthub-gradient)' }}>
      <div className="container">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">SocietyCare</h2>
                  <p className="text-muted">Join Your Apartment Community</p>
                </div>

                <ValidatedForm
                  onSubmit={handleSubmit}
                  validationRules={validationRules}
                  initialData={{
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 'Resident',
                    apartmentNumber: '',
                    phone: ''
                  }}
                >
                  <Row>
                    <Col md={6}>
                      <ValidatedField
                        name="name"
                        label="Full Name"
                        type="text"
                        placeholder="Enter your full name"
                        autoComplete="name"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <ValidatedField
                        name="email"
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        required
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <ValidatedField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Create a password"
                        autoComplete="new-password"
                        required
                        helpText="Minimum 6 characters"
                      />
                    </Col>
                    <Col md={6}>
                      <ValidatedField
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        required
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <ValidatedField
                        name="role"
                        label="Role"
                        type="select"
                        options={[
                          { value: 'Resident', label: 'Resident' },
                          { value: 'Admin', label: 'Admin' }
                        ]}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <ValidatedField
                        name="apartmentNumber"
                        label="Apartment Number"
                        type="text"
                        placeholder="e.g., A-101"
                        required
                      />
                    </Col>
                  </Row>

                  <ValidatedField
                    name="phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 mb-3"
                  >
                    Create Account
                  </Button>
                </ValidatedForm>

                <div className="text-center">
                  <Link to="/login" className="text-decoration-none">
                    Already have an account? Sign in here
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SocietyRegisterForm;
