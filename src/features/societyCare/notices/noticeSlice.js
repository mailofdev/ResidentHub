// src/features/societyCare/notices/noticeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notices: [],
  loading: false,
  error: null,
  selectedNotice: null
};

const noticeSlice = createSlice({
  name: 'notices',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setNotices: (state, action) => {
      state.notices = action.payload;
      state.error = null;
    },
    addNotice: (state, action) => {
      state.notices.unshift(action.payload);
    },
    updateNotice: (state, action) => {
      const index = state.notices.findIndex(notice => notice.id === action.payload.id);
      if (index !== -1) {
        state.notices[index] = { ...state.notices[index], ...action.payload };
      }
    },
    removeNotice: (state, action) => {
      state.notices = state.notices.filter(notice => notice.id !== action.payload);
    },
    setSelectedNotice: (state, action) => {
      state.selectedNotice = action.payload;
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
  setNotices, 
  addNotice, 
  updateNotice, 
  removeNotice, 
  setSelectedNotice, 
  setError, 
  clearError 
} = noticeSlice.actions;

export default noticeSlice.reducer;
