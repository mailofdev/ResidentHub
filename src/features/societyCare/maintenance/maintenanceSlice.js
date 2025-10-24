// src/features/societyCare/maintenance/maintenanceSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  maintenanceRecords: [],
  loading: false,
  error: null,
  selectedRecord: null,
  filters: {
    status: 'all',
    month: 'all',
    year: new Date().getFullYear()
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  }
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMaintenanceRecords: (state, action) => {
      state.maintenanceRecords = action.payload;
      state.pagination.totalItems = action.payload.length;
      state.error = null;
    },
    addMaintenanceRecord: (state, action) => {
      state.maintenanceRecords.unshift(action.payload);
      state.pagination.totalItems += 1;
    },
    updateMaintenanceRecord: (state, action) => {
      const index = state.maintenanceRecords.findIndex(record => record.id === action.payload.id);
      if (index !== -1) {
        state.maintenanceRecords[index] = { ...state.maintenanceRecords[index], ...action.payload };
      }
    },
    removeMaintenanceRecord: (state, action) => {
      state.maintenanceRecords = state.maintenanceRecords.filter(record => record.id !== action.payload);
      state.pagination.totalItems -= 1;
    },
    setSelectedRecord: (state, action) => {
      state.selectedRecord = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetMaintenanceState: (state) => {
      return initialState;
    }
  }
});

export const { 
  setLoading, 
  setMaintenanceRecords, 
  addMaintenanceRecord, 
  updateMaintenanceRecord, 
  removeMaintenanceRecord, 
  setSelectedRecord, 
  setFilters,
  setPagination,
  setError, 
  clearError,
  resetMaintenanceState
} = maintenanceSlice.actions;

export default maintenanceSlice.reducer;
