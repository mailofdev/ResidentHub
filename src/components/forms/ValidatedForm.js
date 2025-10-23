// src/components/forms/ValidatedForm.js
import React, { useState, useEffect } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { validateForm, sanitizeInput } from '../../utils/validation';

const ValidatedForm = ({ 
  children, 
  onSubmit, 
  validationRules = {}, 
  initialData = {},
  className = '',
  showValidation = true
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : sanitizedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur
    if (validationRules[name]) {
      const fieldValidation = validateForm(
        { [name]: formData[name] },
        { [name]: validationRules[name] }
      );
      
      if (!fieldValidation.isValid) {
        setErrors(prev => ({
          ...prev,
          [name]: fieldValidation.errors[name]
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(validationRules).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // Validate entire form
    const validation = validateForm(formData, validationRules);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: error.message || 'An error occurred while submitting the form' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName] ? errors[fieldName] : '';
  };

  const isFieldInvalid = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  const isFieldValid = (fieldName) => {
    return touched[fieldName] && !errors[fieldName] && formData[fieldName];
  };

  return (
    <Form onSubmit={handleSubmit} className={className} noValidate>
      {errors.submit && (
        <Alert variant="danger" className="mb-3">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {errors.submit}
        </Alert>
      )}
      
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            formData,
            errors: getFieldError,
            isInvalid: isFieldInvalid,
            isValid: isFieldValid,
            onChange: handleChange,
            onBlur: handleBlur,
            isSubmitting
          });
        }
        return child;
      })}
    </Form>
  );
};

export default ValidatedForm;
