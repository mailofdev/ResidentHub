// src/services/firebase/noticeService.js
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// Create a new notice
export const createNotice = async (noticeData) => {
  try {
    const docRef = await addDoc(collection(db, 'notices'), {
      ...noticeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all notices
export const getAllNotices = async () => {
  try {
    const q = query(
      collection(db, 'notices'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const notices = [];
    querySnapshot.forEach((doc) => {
      notices.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: notices };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update notice
export const updateNotice = async (noticeId, noticeData) => {
  try {
    await updateDoc(doc(db, 'notices', noticeId), {
      ...noticeData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete notice
export const deleteNotice = async (noticeId) => {
  try {
    await deleteDoc(doc(db, 'notices', noticeId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get notice by ID
export const getNoticeById = async (noticeId) => {
  try {
    const docRef = doc(db, 'notices', noticeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Notice not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen to notices changes (realtime)
export const listenToNotices = (callback) => {
  const q = query(
    collection(db, 'notices'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const notices = [];
    querySnapshot.forEach((doc) => {
      notices.push({ id: doc.id, ...doc.data() });
    });
    callback(notices);
  });
};
