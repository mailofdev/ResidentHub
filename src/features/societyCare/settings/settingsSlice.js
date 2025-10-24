// src/features/societyCare/settings/settingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  societySettings: {
    name: '',
    address: '',
    contact: '',
    email: '',
    logo: '',
    establishedYear: '',
    totalFlats: 0,
    amenities: [],
    rules: [],
    emergencyContacts: []
  },
  themeSettings: {
    isDarkMode: false,
    primaryColor: '#0d6efd',
    secondaryColor: '#6c757d'
  },
  notificationSettings: {
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceReminders: true,
    complaintUpdates: true,
    noticeAlerts: true
  },
  loading: false,
  error: null,
  isInitialized: false
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSocietySettings: (state, action) => {
      state.societySettings = { ...state.societySettings, ...action.payload };
      state.error = null;
    },
    setThemeSettings: (state, action) => {
      state.themeSettings = { ...state.themeSettings, ...action.payload };
      // Apply theme changes to document
      if (action.payload.isDarkMode !== undefined) {
        document.documentElement.setAttribute('data-bs-theme', action.payload.isDarkMode ? 'dark' : 'light');
        localStorage.setItem('theme', action.payload.isDarkMode ? 'dark' : 'light');
      }
    },
    setNotificationSettings: (state, action) => {
      state.notificationSettings = { ...state.notificationSettings, ...action.payload };
    },
    initializeSettings: (state, action) => {
      const { societySettings, themeSettings, notificationSettings } = action.payload;
      state.societySettings = { ...state.societySettings, ...societySettings };
      state.themeSettings = { ...state.themeSettings, ...themeSettings };
      state.notificationSettings = { ...state.notificationSettings, ...notificationSettings };
      state.isInitialized = true;
      state.error = null;
    },
    updateSocietyInfo: (state, action) => {
      state.societySettings = { ...state.societySettings, ...action.payload };
    },
    addAmenity: (state, action) => {
      state.societySettings.amenities.push(action.payload);
    },
    removeAmenity: (state, action) => {
      state.societySettings.amenities = state.societySettings.amenities.filter(
        amenity => amenity.id !== action.payload
      );
    },
    addRule: (state, action) => {
      state.societySettings.rules.push(action.payload);
    },
    removeRule: (state, action) => {
      state.societySettings.rules = state.societySettings.rules.filter(
        rule => rule.id !== action.payload
      );
    },
    addEmergencyContact: (state, action) => {
      state.societySettings.emergencyContacts.push(action.payload);
    },
    removeEmergencyContact: (state, action) => {
      state.societySettings.emergencyContacts = state.societySettings.emergencyContacts.filter(
        contact => contact.id !== action.payload
      );
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSettings: (state) => {
      return initialState;
    }
  }
});

export const { 
  setLoading, 
  setSocietySettings, 
  setThemeSettings, 
  setNotificationSettings,
  initializeSettings,
  updateSocietyInfo,
  addAmenity,
  removeAmenity,
  addRule,
  removeRule,
  addEmergencyContact,
  removeEmergencyContact,
  setError, 
  clearError,
  resetSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;
