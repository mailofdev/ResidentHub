// src/services/razorpay.js
// Razorpay integration for payment processing

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initializeRazorpayPayment = async (paymentData) => {
  try {
    // Load Razorpay script if not already loaded
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay script');
    }

    // Razorpay configuration
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Replace with your actual key
      amount: paymentData.amount * 100, // Amount in paise
      currency: 'INR',
      name: 'SocietyCare',
      description: paymentData.description || 'Maintenance Payment',
      image: '/logo192.png', // Your logo
      order_id: paymentData.orderId, // This should come from your backend
      handler: function (response) {
        // Payment successful
        console.log('Payment successful:', response);
        if (paymentData.onSuccess) {
          paymentData.onSuccess(response);
        }
      },
      prefill: {
        name: paymentData.customerName || '',
        email: paymentData.customerEmail || '',
        contact: paymentData.customerPhone || ''
      },
      notes: {
        address: paymentData.address || '',
        apartmentNumber: paymentData.apartmentNumber || ''
      },
      theme: {
        color: '#0d6efd' // ResidentHub theme color
      },
      modal: {
        ondismiss: function() {
          if (paymentData.onDismiss) {
            paymentData.onDismiss();
          }
        }
      }
    };

    // Create Razorpay instance
    const razorpay = new window.Razorpay(options);
    
    // Open payment modal
    razorpay.open();
    
    return razorpay;
  } catch (error) {
    console.error('Error initializing Razorpay payment:', error);
    throw error;
  }
};

// Mock payment processing for demo purposes
export const processMockPayment = async (paymentData) => {
  return new Promise((resolve, reject) => {
    // Simulate payment processing delay
    setTimeout(() => {
      // Simulate successful payment
      const mockResponse = {
        razorpay_payment_id: `pay_${Date.now()}`,
        razorpay_order_id: `order_${Date.now()}`,
        razorpay_signature: `signature_${Date.now()}`
      };
      
      console.log('Mock payment successful:', mockResponse);
      resolve(mockResponse);
    }, 2000);
  });
};

// Validate payment signature (should be done on backend)
export const validatePaymentSignature = (paymentData, signature) => {
  // This should be implemented on the backend for security
  // For demo purposes, we'll just return true
  console.log('Validating payment signature:', { paymentData, signature });
  return true;
};

// Get payment status
export const getPaymentStatus = async (paymentId) => {
  try {
    // This should call your backend API to get payment status
    // For demo purposes, we'll return a mock status
    return {
      status: 'captured',
      amount: 2500,
      currency: 'INR',
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
};
