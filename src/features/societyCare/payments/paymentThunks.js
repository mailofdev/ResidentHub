// src/features/societyCare/payments/paymentThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createPayment,
  getResidentPayments,
  getAllPayments,
  updatePaymentStatus,
  deletePayment,
  getPaymentById
} from '../../../services/firebase/paymentService';

// Create new payment
export const createPaymentThunk = createAsyncThunk(
  'payments/createPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const result = await createPayment(paymentData);
      if (result.success) {
        return { id: result.id, ...paymentData };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get resident payments
export const getResidentPaymentsThunk = createAsyncThunk(
  'payments/getResidentPayments',
  async (residentId, { rejectWithValue }) => {
    try {
      const result = await getResidentPayments(residentId);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get all payments (admin)
export const getAllPaymentsThunk = createAsyncThunk(
  'payments/getAllPayments',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getAllPayments();
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update payment status
export const updatePaymentStatusThunk = createAsyncThunk(
  'payments/updatePaymentStatus',
  async ({ paymentId, status, paymentMethod }, { rejectWithValue }) => {
    try {
      const result = await updatePaymentStatus(paymentId, status, paymentMethod);
      if (result.success) {
        return { paymentId, status, paymentMethod };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete payment
export const deletePaymentThunk = createAsyncThunk(
  'payments/deletePayment',
  async (paymentId, { rejectWithValue }) => {
    try {
      const result = await deletePayment(paymentId);
      if (result.success) {
        return paymentId;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get payment by ID
export const getPaymentByIdThunk = createAsyncThunk(
  'payments/getPaymentById',
  async (paymentId, { rejectWithValue }) => {
    try {
      const result = await getPaymentById(paymentId);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
