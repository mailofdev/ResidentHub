// src/features/societyCare/auth/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createUser, 
  signInUser, 
  signOutUser, 
  onAuthStateChange,
  updateUserProfile as updateUserProfileService,
  getUserFromSession,
  isAuthenticatedViaSession
} from '../../../services/firebase/authService';
import { setUser } from './authSlice';

// Register new user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, userData }, { rejectWithValue }) => {
    try {
      const result = await createUser(email, password, userData);
      if (result.success) {
        // Extract only serializable data from Firebase user
        const serializableUser = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          role: userData.role,
          name: userData.name,
          apartmentNumber: userData.apartmentNumber,
          phone: userData.phone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return serializableUser;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Sign in user
export const signInUserThunk = createAsyncThunk(
  'auth/signInUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await signInUser(email, password);
      if (result.success) {
        // Extract only serializable data from Firebase user
        const serializableUser = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          role: result.user.role,
          name: result.user.name,
          apartmentNumber: result.user.apartmentNumber,
          phone: result.user.phone,
          createdAt: result.user.createdAt,
          updatedAt: result.user.updatedAt
        };
        return serializableUser;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Sign out user
export const signOutUserThunk = createAsyncThunk(
  'auth/signOutUser',
  async (_, { rejectWithValue }) => {
    try {
      const result = await signOutUser();
      if (result.success) {
        return null;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update user profile
export const updateUserProfileThunk = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ uid, userData }, { rejectWithValue }) => {
    try {
      const result = await updateUserProfileService(uid, userData);
      if (result.success) {
        return userData;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initialize auth state listener
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // First, try to restore user from session storage
      const sessionResult = getUserFromSession();
      if (sessionResult.success) {
        console.log('Restoring user from session storage');
        dispatch(setUser(sessionResult.user));
        return sessionResult.user;
      }

      // If no session, set up Firebase auth listener
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChange((user) => {
          // Extract only serializable data from Firebase user
          const serializableUser = user ? {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            name: user.name,
            apartmentNumber: user.apartmentNumber,
            phone: user.phone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          } : null;
          
          dispatch(setUser(serializableUser));
          resolve(serializableUser);
        });
        
        // Return unsubscribe function for cleanup
        return unsubscribe;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Restore user from session
export const restoreUserFromSession = createAsyncThunk(
  'auth/restoreUserFromSession',
  async (_, { rejectWithValue }) => {
    try {
      const result = getUserFromSession();
      if (result.success) {
        return result.user;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

