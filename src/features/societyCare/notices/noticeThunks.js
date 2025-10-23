// src/features/societyCare/notices/noticeThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
  getNoticeById
} from '../../../services/firebase/noticeService';

// Create new notice
export const createNoticeThunk = createAsyncThunk(
  'notices/createNotice',
  async (noticeData, { rejectWithValue }) => {
    try {
      const result = await createNotice(noticeData);
      if (result.success) {
        return { id: result.id, ...noticeData };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get all notices
export const getAllNoticesThunk = createAsyncThunk(
  'notices/getAllNotices',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getAllNotices();
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

// Update notice
export const updateNoticeThunk = createAsyncThunk(
  'notices/updateNotice',
  async ({ noticeId, noticeData }, { rejectWithValue }) => {
    try {
      const result = await updateNotice(noticeId, noticeData);
      if (result.success) {
        return { noticeId, ...noticeData };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete notice
export const deleteNoticeThunk = createAsyncThunk(
  'notices/deleteNotice',
  async (noticeId, { rejectWithValue }) => {
    try {
      const result = await deleteNotice(noticeId);
      if (result.success) {
        return noticeId;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get notice by ID
export const getNoticeByIdThunk = createAsyncThunk(
  'notices/getNoticeById',
  async (noticeId, { rejectWithValue }) => {
    try {
      const result = await getNoticeById(noticeId);
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
