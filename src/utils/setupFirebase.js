// src/utils/setupFirebase.js
// Run this in your browser console to set up Firebase demo data

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Demo users data
const demoUsers = [
  {
    email: 'admin@society.com',
    password: 'admin123',
    userData: {
      name: 'Admin User',
      role: 'Admin',
      apartmentNumber: 'Office',
      phone: '+91 9876543210'
    }
  },
  {
    email: 'resident@society.com',
    password: 'resident123',
    userData: {
      name: 'Resident User',
      role: 'Resident',
      apartmentNumber: 'A-101',
      phone: '+91 9876543211'
    }
  }
];

// Function to create demo users
export const setupDemoUsers = async () => {
  try {
    console.log('🚀 Setting up demo users...');
    
    for (const user of demoUsers) {
      try {
        console.log(`Creating user: ${user.email}`);
        
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          user.email, 
          user.password
        );
        
        const firebaseUser = userCredential.user;
        console.log(`✅ User created with UID: ${firebaseUser.uid}`);
        
        // Create user document in Firestore
        const userDocData = {
          uid: firebaseUser.uid,
          email: user.email,
          name: user.userData.name,
          role: user.userData.role,
          apartmentNumber: user.userData.apartmentNumber,
          phone: user.userData.phone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), userDocData);
        console.log(`✅ User document created for: ${user.email} (${user.userData.role})`);
        
        // Verify the document was created
        const verifyDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (verifyDoc.exists()) {
          console.log(`✅ Verified user document exists:`, verifyDoc.data());
        } else {
          console.error(`❌ User document not found after creation`);
        }
        
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️ User ${user.email} already exists - checking Firestore document...`);
          
          // Try to sign in to get the UID
          try {
            const signInResult = await signInWithEmailAndPassword(auth, user.email, user.password);
            const uid = signInResult.user.uid;
            
            // Check if user document exists in Firestore
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
              console.log(`✅ User document already exists:`, userDoc.data());
            } else {
              console.log(`⚠️ User exists but no Firestore document. Creating one...`);
              
              const userDocData = {
                uid: uid,
                email: user.email,
                name: user.userData.name,
                role: user.userData.role,
                apartmentNumber: user.userData.apartmentNumber,
                phone: user.userData.phone,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              
              await setDoc(doc(db, 'users', uid), userDocData);
              console.log(`✅ User document created for existing user: ${user.email}`);
            }
          } catch (signInError) {
            console.error(`❌ Error signing in existing user ${user.email}:`, signInError.message);
          }
        } else {
          console.error(`❌ Error creating user ${user.email}:`, error.message);
        }
      }
    }
    
    // Sign out after creating users
    await signOut(auth);
    console.log('🎉 Demo users setup complete!');
    console.log('You can now login with:');
    console.log('Admin: admin@society.com / admin123');
    console.log('Resident: resident@society.com / resident123');
    
  } catch (error) {
    console.error('❌ Error setting up demo users:', error);
  }
};

// Function to test login
export const testLogin = async (email, password) => {
  try {
    console.log(`Testing login for: ${email}`);
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Login successful:', result.user.uid);
    
    // Check Firestore document
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (userDoc.exists()) {
      console.log('✅ User document found:', userDoc.data());
    } else {
      console.error('❌ User document not found in Firestore');
    }
    
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    return false;
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.setupDemoUsers = setupDemoUsers;
  window.testLogin = testLogin;
}

export default setupDemoUsers;
