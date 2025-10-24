// src/services/firebase/maintenanceService.js
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase';

const COLLECTION_NAME = 'maintenanceRecords';

// Create maintenance record
export const createMaintenanceRecord = async (recordData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...recordData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    const docSnap = await getDoc(docRef);
    return { id: docRef.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    throw error;
  }
};

// Update maintenance record
export const updateMaintenanceRecord = async (recordId, updates) => {
  try {
    const recordRef = doc(db, COLLECTION_NAME, recordId);
    await updateDoc(recordRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    const docSnap = await getDoc(recordRef);
    return { id: recordId, ...docSnap.data() };
  } catch (error) {
    console.error('Error updating maintenance record:', error);
    throw error;
  }
};

// Delete maintenance record
export const deleteMaintenanceRecord = async (recordId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, recordId));
  } catch (error) {
    console.error('Error deleting maintenance record:', error);
    throw error;
  }
};

// Get all maintenance records (Admin)
export const getMaintenanceRecords = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting maintenance records:', error);
    throw error;
  }
};

// Get maintenance records for specific resident
export const getResidentMaintenanceRecords = async (residentId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('residentId', '==', residentId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting resident maintenance records:', error);
    throw error;
  }
};

// Get maintenance records by flat number
export const getMaintenanceRecordsByFlat = async (flatNumber) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('flatNumber', '==', flatNumber),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting maintenance records by flat:', error);
    throw error;
  }
};

// Get maintenance records by status
export const getMaintenanceRecordsByStatus = async (status) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting maintenance records by status:', error);
    throw error;
  }
};

// Listen to all maintenance records (Admin)
export const listenToMaintenanceRecords = (callback) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const records = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(records);
  });
};

// Listen to resident maintenance records
export const listenToResidentMaintenanceRecords = (residentId, callback) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('residentId', '==', residentId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const records = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(records);
  });
};

// Get maintenance statistics
export const getMaintenanceStatistics = async () => {
  try {
    const records = await getMaintenanceRecords();
    
    const stats = {
      total: records.length,
      pending: records.filter(r => r.status === 'pending').length,
      paid: records.filter(r => r.status === 'paid').length,
      overdue: records.filter(r => r.status === 'pending' && new Date(r.dueDate) < new Date()).length,
      totalAmount: records.reduce((sum, r) => sum + (r.amount || 0), 0),
      pendingAmount: records.filter(r => r.status === 'pending').reduce((sum, r) => sum + (r.amount || 0), 0),
      paidAmount: records.filter(r => r.status === 'paid').reduce((sum, r) => sum + (r.amount || 0), 0)
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting maintenance statistics:', error);
    throw error;
  }
};
