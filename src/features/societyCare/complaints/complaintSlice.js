// src/features/societyCare/complaints/complaintSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  complaints: [],
  loading: false,
  error: null,
  selectedComplaint: null
};

const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setComplaints: (state, action) => {
      state.complaints = action.payload;
      state.error = null;
    },
    addComplaint: (state, action) => {
      state.complaints.unshift(action.payload);
    },
    updateComplaint: (state, action) => {
      const index = state.complaints.findIndex(complaint => complaint.id === action.payload.id);
      if (index !== -1) {
        state.complaints[index] = { ...state.complaints[index], ...action.payload };
      }
    },
    removeComplaint: (state, action) => {
      state.complaints = state.complaints.filter(complaint => complaint.id !== action.payload);
    },
    setSelectedComplaint: (state, action) => {
      state.selectedComplaint = action.payload;
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
  setComplaints, 
  addComplaint, 
  updateComplaint, 
  removeComplaint, 
  setSelectedComplaint, 
  setError, 
  clearError 
} = complaintSlice.actions;

export default complaintSlice.reducer;
