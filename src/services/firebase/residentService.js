// src/services/firebase/residentService.js
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// Create a new resident
export const createResident = async (residentData) => {
  try {
    const docRef = await addDoc(collection(db, 'residents'), {
      ...residentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all residents
export const getAllResidents = async () => {
  try {
    const q = query(
      collection(db, 'residents'),
      orderBy('apartmentNumber', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const residents = [];
    querySnapshot.forEach((doc) => {
      residents.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: residents };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get resident by ID
export const getResidentById = async (residentId) => {
  try {
    const docRef = doc(db, 'residents', residentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Resident not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update resident
export const updateResident = async (residentId, residentData) => {
  try {
    await updateDoc(doc(db, 'residents', residentId), {
      ...residentData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete resident
export const deleteResident = async (residentId) => {
  try {
    await deleteDoc(doc(db, 'residents', residentId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen to residents changes (realtime)
export const listenToResidents = (callback) => {
  const q = query(
    collection(db, 'residents'),
    orderBy('apartmentNumber', 'asc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const residents = [];
    querySnapshot.forEach((doc) => {
      residents.push({ id: doc.id, ...doc.data() });
    });
    callback(residents);
  });
};
