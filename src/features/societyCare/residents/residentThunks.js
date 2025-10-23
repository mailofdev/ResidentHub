// src/features/societyCare/residents/residentThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createResident,
  getAllResidents,
  updateResident,
  deleteResident,
  getResidentById
} from '../../../services/firebase/residentService';

// Create new resident
export const createResidentThunk = createAsyncThunk(
  'residents/createResident',
  async (residentData, { rejectWithValue }) => {
    try {
      const result = await createResident(residentData);
      if (result.success) {
        return { id: result.id, ...residentData };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get all residents
export const getAllResidentsThunk = createAsyncThunk(
  'residents/getAllResidents',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getAllResidents();
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

// Update resident
export const updateResidentThunk = createAsyncThunk(
  'residents/updateResident',
  async ({ residentId, residentData }, { rejectWithValue }) => {
    try {
      const result = await updateResident(residentId, residentData);
      if (result.success) {
        return { residentId, ...residentData };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete resident
export const deleteResidentThunk = createAsyncThunk(
  'residents/deleteResident',
  async (residentId, { rejectWithValue }) => {
    try {
      const result = await deleteResident(residentId);
      if (result.success) {
        return residentId;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get resident by ID
export const getResidentByIdThunk = createAsyncThunk(
  'residents/getResidentById',
  async (residentId, { rejectWithValue }) => {
    try {
      const result = await getResidentById(residentId);
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
