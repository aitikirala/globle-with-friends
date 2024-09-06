// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,               // Your Firebase API Key
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,       // Your Firebase Auth Domain
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,         // Your Firebase Project ID
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET, // Your Firebase Storage Bucket
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, // Messaging Sender ID
  appId: process.env.REACT_APP_FIREBASE_APP_ID,                 // Firebase App ID
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID  // Measurement ID (optional)
};

// Initialize Firebase with the configuration
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);  // Export Firestore database
export const auth = getAuth(app);     // Export Firebase authentication
