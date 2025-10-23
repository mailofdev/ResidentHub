// src/utils/setupDemoUsers.js
// This script helps you create demo users in Firebase
// Run this in your browser console after logging into Firebase

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
    console.log('Creating demo users...');
    
    for (const user of demoUsers) {
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          user.email, 
          user.password
        );
        
        const firebaseUser = userCredential.user;
        
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
        
        console.log(`✅ Created user: ${user.email} (${user.userData.role})`);
        
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️ User ${user.email} already exists`);
        } else {
          console.error(`❌ Error creating user ${user.email}:`, error.message);
        }
      }
    }
    
    // Sign out after creating users
    await signOut(auth);
    console.log('✅ Demo users setup complete!');
    
  } catch (error) {
    console.error('❌ Error setting up demo users:', error);
  }
};

// Function to test login with demo users
export const testDemoLogin = async () => {
  try {
    console.log('Testing demo user login...');
    
    // Test admin login
    const adminCredential = await signInWithEmailAndPassword(
      auth, 
      'admin@society.com', 
      'admin123'
    );
    console.log('✅ Admin login successful:', adminCredential.user.email);
    
    await signOut(auth);
    
    // Test resident login
    const residentCredential = await signInWithEmailAndPassword(
      auth, 
      'resident@society.com', 
      'resident123'
    );
    console.log('✅ Resident login successful:', residentCredential.user.email);
    
    await signOut(auth);
    console.log('✅ Demo login tests completed!');
    
  } catch (error) {
    console.error('❌ Error testing demo login:', error);
  }
};

// Instructions for manual setup
export const manualSetupInstructions = () => {
  console.log(`
🔧 Manual Firebase Setup Instructions:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: residenthub-53d58
3. Go to Authentication > Users
4. Click "Add user" and create:

   Admin User:
   - Email: admin@society.com
   - Password: admin123

   Resident User:
   - Email: resident@society.com
   - Password: resident123

5. Go to Firestore Database > Data
6. Create collection "users" with documents for each user:

   Document ID: [User's UID from Authentication]
   Fields:
   - name: "Admin User" / "Resident User"
   - email: "admin@society.com" / "resident@society.com"
   - role: "Admin" / "Resident"
   - apartmentNumber: "Office" / "A-101"
   - phone: "+91 9876543210" / "+91 9876543211"
   - createdAt: [current timestamp]
   - updatedAt: [current timestamp]

7. Test the login in your app!
  `);
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.createDemoUsers = createDemoUsers;
  window.testDemoLogin = testDemoLogin;
  window.manualSetupInstructions = manualSetupInstructions;
}
