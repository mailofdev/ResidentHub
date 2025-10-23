// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // import Firestore
import { getAnalytics } from "firebase/analytics";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBNrMY8SYtYlLf3ZKgHM6evxlZDXnQc-C8",
  authDomain: "residenthub-53d58.firebaseapp.com",
  projectId: "residenthub-53d58",
  storageBucket: "residenthub-53d58.firebasestorage.app",
  messagingSenderId: "1099334783831",
  appId: "1:1099334783831:web:bf8f0c379f487dc26ba412",
  measurementId: "G-H1V9M5YG1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and export it
export const db = getFirestore(app);



