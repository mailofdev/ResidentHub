// src/services/firebase/complaintService.js
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

// Create a new complaint
export const createComplaint = async (complaintData) => {
  try {
    const docRef = await addDoc(collection(db, 'complaints'), {
      ...complaintData,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all complaints for a resident
export const getResidentComplaints = async (residentId) => {
  try {
    const q = query(
      collection(db, 'complaints'),
      where('residentId', '==', residentId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const complaints = [];
    querySnapshot.forEach((doc) => {
      complaints.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: complaints };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all complaints (admin view)
export const getAllComplaints = async () => {
  try {
    const q = query(
      collection(db, 'complaints'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const complaints = [];
    querySnapshot.forEach((doc) => {
      complaints.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: complaints };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update complaint status
export const updateComplaintStatus = async (complaintId, status, adminNotes = null) => {
  try {
    const updateData = {
      status,
      updatedAt: new Date().toISOString()
    };
    
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    
    if (status === 'resolved') {
      updateData.resolvedAt = new Date().toISOString();
    }
    
    await updateDoc(doc(db, 'complaints', complaintId), updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete complaint
export const deleteComplaint = async (complaintId) => {
  try {
    await deleteDoc(doc(db, 'complaints', complaintId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get complaint by ID
export const getComplaintById = async (complaintId) => {
  try {
    const docRef = doc(db, 'complaints', complaintId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Complaint not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen to complaints changes (realtime)
export const listenToComplaints = (residentId, callback) => {
  const q = query(
    collection(db, 'complaints'),
    where('residentId', '==', residentId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const complaints = [];
    querySnapshot.forEach((doc) => {
      complaints.push({ id: doc.id, ...doc.data() });
    });
    callback(complaints);
  });
};

// Listen to all complaints changes (admin realtime)
export const listenToAllComplaints = (callback) => {
  const q = query(
    collection(db, 'complaints'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const complaints = [];
    querySnapshot.forEach((doc) => {
      complaints.push({ id: doc.id, ...doc.data() });
    });
    callback(complaints);
  });
};
