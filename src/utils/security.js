// src/utils/security.js

// Input sanitization
export const sanitizeHtml = (input) => {
  if (typeof input !== 'string') return input;
  
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// XSS prevention
export const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return unsafe;
  
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// SQL injection prevention (for any potential SQL-like queries)
export const sanitizeSql = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/['"]/g, '')
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/xp_/gi, '')
    .replace(/sp_/gi, '');
};

// Rate limiting helper
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) { // 10 requests per minute
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Clean old requests
    if (this.requests.has(key)) {
      const userRequests = this.requests.get(key).filter(time => time > windowStart);
      this.requests.set(key, userRequests);
    } else {
      this.requests.set(key, []);
    }

    const userRequests = this.requests.get(key);
    
    if (userRequests.length >= this.maxRequests) {
      return false;
    }

    userRequests.push(now);
    return true;
  }

  getRemainingRequests(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (this.requests.has(key)) {
      const userRequests = this.requests.get(key).filter(time => time > windowStart);
      return Math.max(0, this.maxRequests - userRequests.length);
    }
    
    return this.maxRequests;
  }
}

export const rateLimiter = new RateLimiter();

// Password strength checker
export const checkPasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    common: !isCommonPassword(password)
  };

  const score = Object.values(checks).filter(Boolean).length;
  
  let strength = 'weak';
  if (score >= 5) strength = 'strong';
  else if (score >= 3) strength = 'medium';

  return {
    score,
    strength,
    checks,
    message: getPasswordStrengthMessage(strength, checks)
  };
};

const isCommonPassword = (password) => {
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  return commonPasswords.includes(password.toLowerCase());
};

const getPasswordStrengthMessage = (strength, checks) => {
  const messages = [];
  
  if (!checks.length) messages.push('at least 8 characters');
  if (!checks.lowercase) messages.push('lowercase letters');
  if (!checks.uppercase) messages.push('uppercase letters');
  if (!checks.numbers) messages.push('numbers');
  if (!checks.symbols) messages.push('special characters');
  if (!checks.common) messages.push('avoid common passwords');

  if (messages.length === 0) {
    return 'Strong password!';
  }

  return `Password should include ${messages.join(', ')}`;
};

// Session security
export const generateSecureToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Content Security Policy helper
export const getCSPDirectives = () => {
  return {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "https://www.gstatic.com"],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'img-src': ["'self'", "data:", "https:"],
    'connect-src': ["'self'", "https://*.firebase.com", "https://*.googleapis.com"],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  };
};

// File upload security
export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
  } = options;

  const errors = [];

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  // Check file extension
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    errors.push(`File extension ${extension} is not allowed`);
  }

  // Check for suspicious file names
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    errors.push('Invalid file name');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// CSRF protection helper
export const generateCSRFToken = () => {
  return generateSecureToken();
};

export const validateCSRFToken = (token, expectedToken) => {
  return token === expectedToken;
};
