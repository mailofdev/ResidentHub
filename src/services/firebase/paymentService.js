// src/services/firebase/paymentService.js
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

// Create a new payment record
export const createPayment = async (paymentData) => {
  try {
    const docRef = await addDoc(collection(db, 'payments'), {
      ...paymentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all payments for a resident
export const getResidentPayments = async (residentId) => {
  try {
    const q = query(
      collection(db, 'payments'),
      where('residentId', '==', residentId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const payments = [];
    querySnapshot.forEach((doc) => {
      payments.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: payments };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all payments (admin view)
export const getAllPayments = async () => {
  try {
    const q = query(
      collection(db, 'payments'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const payments = [];
    querySnapshot.forEach((doc) => {
      payments.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: payments };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update payment status
export const updatePaymentStatus = async (paymentId, status, paymentMethod = null) => {
  try {
    const updateData = {
      status,
      updatedAt: new Date().toISOString()
    };
    
    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
    }
    
    if (status === 'paid') {
      updateData.paidAt = new Date().toISOString();
    }
    
    await updateDoc(doc(db, 'payments', paymentId), updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete payment
export const deletePayment = async (paymentId) => {
  try {
    await deleteDoc(doc(db, 'payments', paymentId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get payment by ID
export const getPaymentById = async (paymentId) => {
  try {
    const docRef = doc(db, 'payments', paymentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Payment not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen to payments changes (realtime)
export const listenToPayments = (residentId, callback) => {
  const q = query(
    collection(db, 'payments'),
    where('residentId', '==', residentId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const payments = [];
    querySnapshot.forEach((doc) => {
      payments.push({ id: doc.id, ...doc.data() });
    });
    callback(payments);
  });
};

// Listen to all payments changes (admin realtime)
export const listenToAllPayments = (callback) => {
  const q = query(
    collection(db, 'payments'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const payments = [];
    querySnapshot.forEach((doc) => {
      payments.push({ id: doc.id, ...doc.data() });
    });
    callback(payments);
  });
};
