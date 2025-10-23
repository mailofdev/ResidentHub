// src/services/firebase/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

// Create user with email and password
export const createUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile
    await updateProfile(user, {
      displayName: userData.name
    });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: userData.name,
      role: userData.role,
      apartmentNumber: userData.apartmentNumber || null,
      phone: userData.phone || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with email and password
export const signInUser = async (email, password) => {
  try {
    console.log('Firebase signInUser called with:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Firebase user created:', user.uid);
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    console.log('User data from Firestore:', userData);
    
    if (!userData) {
      console.error('No user data found in Firestore for UID:', user.uid);
      return { success: false, error: 'User data not found in database' };
    }
    
    const combinedUser = { ...user, ...userData };
    console.log('Combined user object:', combinedUser);
    
    // Save user data to session storage
    const sessionData = {
      uid: combinedUser.uid,
      email: combinedUser.email,
      name: combinedUser.name,
      role: combinedUser.role,
      apartmentNumber: combinedUser.apartmentNumber,
      phone: combinedUser.phone,
      loginTime: new Date().toISOString(),
      token: userCredential.user.accessToken || 'firebase-token'
    };
    
    sessionStorage.setItem('societycare_auth', JSON.stringify(sessionData));
    console.log('User data saved to session storage');
    
    return { success: true, user: combinedUser };
  } catch (error) {
    console.error('Firebase signInUser error:', error);
    return { success: false, error: error.message };
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    // Clear session storage
    sessionStorage.removeItem('societycare_auth');
    console.log('User signed out and session cleared');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get user from session storage
export const getUserFromSession = () => {
  try {
    const sessionData = sessionStorage.getItem('societycare_auth');
    if (sessionData) {
      const user = JSON.parse(sessionData);
      console.log('User restored from session:', user);
      return { success: true, user };
    }
    return { success: false, error: 'No session data found' };
  } catch (error) {
    console.error('Error getting user from session:', error);
    return { success: false, error: error.message };
  }
};

// Check if user is authenticated via session
export const isAuthenticatedViaSession = () => {
  try {
    const sessionData = sessionStorage.getItem('societycare_auth');
    return !!sessionData;
  } catch (error) {
    return false;
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      callback({ ...user, ...userData });
    } else {
      callback(null);
    }
  });
};

// Update user profile
export const updateUserProfile = async (uid, userData) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
