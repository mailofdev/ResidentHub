// src/components/forms/ValidatedField.js
import React from 'react';
import { Form } from 'react-bootstrap';

const ValidatedField = ({ 
  name,
  label,
  type = 'text',
  placeholder = '',
  required = false,
  disabled = false,
  formData = {},
  errors = () => '',
  isInvalid = () => false,
  isValid = () => false,
  onChange = () => {},
  onBlur = () => {},
  isSubmitting = false,
  helpText = '',
  options = [],
  rows = 3,
  ...props
}) => {
  const value = formData[name] || '';
  const error = errors(name);
  const invalid = isInvalid(name);
  const valid = isValid(name);

  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <Form.Select
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={invalid}
            isValid={valid}
            disabled={disabled || isSubmitting}
            required={required}
            {...props}
          >
            <option value="">Select {label}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );

      case 'textarea':
        return (
          <Form.Control
            as="textarea"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            isInvalid={invalid}
            isValid={valid}
            disabled={disabled || isSubmitting}
            required={required}
            rows={rows}
            {...props}
          />
        );

      case 'checkbox':
        return (
          <Form.Check
            type="checkbox"
            name={name}
            checked={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={invalid}
            disabled={disabled || isSubmitting}
            required={required}
            label={label}
            {...props}
          />
        );

      default:
        return (
          <Form.Control
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            isInvalid={invalid}
            isValid={valid}
            disabled={disabled || isSubmitting}
            required={required}
            {...props}
          />
        );
    }
  };

  return (
    <Form.Group className="mb-3">
      {type !== 'checkbox' && label && (
        <Form.Label>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </Form.Label>
      )}
      
      {renderField()}
      
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
      
      {valid && (
        <Form.Control.Feedback type="valid">
          Looks good!
        </Form.Control.Feedback>
      )}
      
      {helpText && !error && (
        <Form.Text className="text-muted">
          {helpText}
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default ValidatedField;
