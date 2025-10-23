// src/features/societyCare/residents/residentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  residents: [],
  loading: false,
  error: null,
  selectedResident: null
};

const residentSlice = createSlice({
  name: 'residents',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setResidents: (state, action) => {
      state.residents = action.payload;
      state.error = null;
    },
    addResident: (state, action) => {
      state.residents.push(action.payload);
    },
    updateResident: (state, action) => {
      const index = state.residents.findIndex(resident => resident.id === action.payload.id);
      if (index !== -1) {
        state.residents[index] = { ...state.residents[index], ...action.payload };
      }
    },
    removeResident: (state, action) => {
      state.residents = state.residents.filter(resident => resident.id !== action.payload);
    },
    setSelectedResident: (state, action) => {
      state.selectedResident = action.payload;
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
  setResidents, 
  addResident, 
  updateResident, 
  removeResident, 
  setSelectedResident, 
  setError, 
  clearError 
} = residentSlice.actions;

export default residentSlice.reducer;
