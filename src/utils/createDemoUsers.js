// src/utils/createDemoUsers.js
// Run this script in your browser console to create demo users

import { 
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
export const createDemoUsers = async () => {
  try {
    console.log('🚀 Creating demo users...');
    
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
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          email: user.email,
          name: user.userData.name,
          role: user.userData.role,
          apartmentNumber: user.userData.apartmentNumber,
          phone: user.userData.phone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        console.log(`✅ User document created for: ${user.email} (${user.userData.role})`);
        
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️ User ${user.email} already exists - skipping`);
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

// Make it available globally for console use
if (typeof window !== 'undefined') {
  window.createDemoUsers = createDemoUsers;
}

export default createDemoUsers;
