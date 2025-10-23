// src/features/societyCare/complaints/complaintThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createComplaint,
  getResidentComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
  getComplaintById
} from '../../../services/firebase/complaintService';

// Create new complaint
export const createComplaintThunk = createAsyncThunk(
  'complaints/createComplaint',
  async (complaintData, { rejectWithValue }) => {
    try {
      const result = await createComplaint(complaintData);
      if (result.success) {
        return { id: result.id, ...complaintData };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get resident complaints
export const getResidentComplaintsThunk = createAsyncThunk(
  'complaints/getResidentComplaints',
  async (residentId, { rejectWithValue }) => {
    try {
      const result = await getResidentComplaints(residentId);
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

// Get all complaints (admin)
export const getAllComplaintsThunk = createAsyncThunk(
  'complaints/getAllComplaints',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getAllComplaints();
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

// Update complaint status
export const updateComplaintStatusThunk = createAsyncThunk(
  'complaints/updateComplaintStatus',
  async ({ complaintId, status, adminNotes }, { rejectWithValue }) => {
    try {
      const result = await updateComplaintStatus(complaintId, status, adminNotes);
      if (result.success) {
        return { complaintId, status, adminNotes };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete complaint
export const deleteComplaintThunk = createAsyncThunk(
  'complaints/deleteComplaint',
  async (complaintId, { rejectWithValue }) => {
    try {
      const result = await deleteComplaint(complaintId);
      if (result.success) {
        return complaintId;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get complaint by ID
export const getComplaintByIdThunk = createAsyncThunk(
  'complaints/getComplaintById',
  async (complaintId, { rejectWithValue }) => {
    try {
      const result = await getComplaintById(complaintId);
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
