// src/features/societyCare/payments/paymentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [],
  loading: false,
  error: null,
  selectedPayment: null
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPayments: (state, action) => {
      state.payments = action.payload;
      state.error = null;
    },
    addPayment: (state, action) => {
      state.payments.unshift(action.payload);
    },
    updatePayment: (state, action) => {
      const index = state.payments.findIndex(payment => payment.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = { ...state.payments[index], ...action.payload };
      }
    },
    removePayment: (state, action) => {
      state.payments = state.payments.filter(payment => payment.id !== action.payload);
    },
    setSelectedPayment: (state, action) => {
      state.selectedPayment = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  setLoading, 
  setPayments, 
  addPayment, 
  updatePayment, 
  removePayment, 
  setSelectedPayment, 
  setError, 
  clearError 
} = paymentSlice.actions;

export default paymentSlice.reducer;
