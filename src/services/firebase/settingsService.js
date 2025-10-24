// src/services/firebase/settingsService.js
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from '../../config/firebase';

const SETTINGS_DOC_ID = 'societySettings';
const THEME_DOC_ID = 'themeSettings';
const NOTIFICATIONS_DOC_ID = 'notificationSettings';

// Society Settings
export const getSocietySettings = async () => {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return default settings if document doesn't exist
      return {
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
      };
    }
  } catch (error) {
    console.error('Error getting society settings:', error);
    throw error;
  }
};

export const updateSocietySettings = async (settingsData) => {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    await setDoc(docRef, {
      ...settingsData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return settingsData;
  } catch (error) {
    console.error('Error updating society settings:', error);
    throw error;
  }
};

export const uploadSocietyLogo = async (file) => {
  try {
    const storageRef = ref(storage, `society/logo/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Update the logo URL in settings
    await updateSocietySettings({ logo: downloadURL });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading society logo:', error);
    throw error;
  }
};

// Theme Settings
export const getThemeSettings = async () => {
  try {
    const docRef = doc(db, 'settings', THEME_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return default theme settings
      const defaultTheme = {
        isDarkMode: localStorage.getItem('theme') === 'dark' || false,
        primaryColor: '#0d6efd',
        secondaryColor: '#6c757d'
      };
      
      // Save default settings
      await updateThemeSettings(defaultTheme);
      return defaultTheme;
    }
  } catch (error) {
    console.error('Error getting theme settings:', error);
    throw error;
  }
};

export const updateThemeSettings = async (themeData) => {
  try {
    const docRef = doc(db, 'settings', THEME_DOC_ID);
    await setDoc(docRef, {
      ...themeData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    // Apply theme to document
    if (themeData.isDarkMode !== undefined) {
      document.documentElement.setAttribute('data-bs-theme', themeData.isDarkMode ? 'dark' : 'light');
      localStorage.setItem('theme', themeData.isDarkMode ? 'dark' : 'light');
    }
    
    return themeData;
  } catch (error) {
    console.error('Error updating theme settings:', error);
    throw error;
  }
};

// Notification Settings
export const getNotificationSettings = async () => {
  try {
    const docRef = doc(db, 'settings', NOTIFICATIONS_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return default notification settings
      const defaultNotifications = {
        pushNotifications: true,
        emailNotifications: true,
        smsNotifications: false,
        maintenanceReminders: true,
        complaintUpdates: true,
        noticeAlerts: true
      };
      
      // Save default settings
      await updateNotificationSettings(defaultNotifications);
      return defaultNotifications;
    }
  } catch (error) {
    console.error('Error getting notification settings:', error);
    throw error;
  }
};

export const updateNotificationSettings = async (notificationData) => {
  try {
    const docRef = doc(db, 'settings', NOTIFICATIONS_DOC_ID);
    await setDoc(docRef, {
      ...notificationData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return notificationData;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};

// Initialize all settings
export const initializeAllSettings = async () => {
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
    console.error('Error initializing settings:', error);
    throw error;
  }
};
