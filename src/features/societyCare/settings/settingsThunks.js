// src/features/societyCare/settings/settingsThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getSocietySettings,
  updateSocietySettings,
  uploadSocietyLogo,
  getThemeSettings,
  updateThemeSettings,
  getNotificationSettings,
  updateNotificationSettings
} from '../../../services/firebase/settingsService';

// Get society settings
export const getSocietySettingsThunk = createAsyncThunk(
  'settings/getSocietySettings',
  async (_, { rejectWithValue }) => {
    try {
      const settings = await getSocietySettings();
      return settings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update society settings
export const updateSocietySettingsThunk = createAsyncThunk(
  'settings/updateSocietySettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      const result = await updateSocietySettings(settingsData);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Upload society logo
export const uploadSocietyLogoThunk = createAsyncThunk(
  'settings/uploadLogo',
  async (file, { rejectWithValue }) => {
    try {
      const logoUrl = await uploadSocietyLogo(file);
      return logoUrl;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get theme settings
export const getThemeSettingsThunk = createAsyncThunk(
  'settings/getThemeSettings',
  async (_, { rejectWithValue }) => {
    try {
      const settings = await getThemeSettings();
      return settings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update theme settings
export const updateThemeSettingsThunk = createAsyncThunk(
  'settings/updateThemeSettings',
  async (themeData, { rejectWithValue }) => {
    try {
      const result = await updateThemeSettings(themeData);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get notification settings
export const getNotificationSettingsThunk = createAsyncThunk(
  'settings/getNotificationSettings',
  async (_, { rejectWithValue }) => {
    try {
      const settings = await getNotificationSettings();
      return settings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update notification settings
export const updateNotificationSettingsThunk = createAsyncThunk(
  'settings/updateNotificationSettings',
  async (notificationData, { rejectWithValue }) => {
    try {
      const result = await updateNotificationSettings(notificationData);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initialize all settings
export const initializeSettingsThunk = createAsyncThunk(
  'settings/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const [societySettings, themeSettings, notificationSettings] = await Promise.all([
        getSocietySettings(),
        getThemeSettings(),
        getNotificationSettings()
      ]);
      
      return {
        societySettings,
        themeSettings,
        notificationSettings
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
