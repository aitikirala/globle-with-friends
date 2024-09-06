// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCN59CkENSWb4Pat1CYKAlIaoiejzgAOUE",
  authDomain: "globe-with-friends.firebaseapp.com",
  projectId: "globe-with-friends",
  storageBucket: "globe-with-friends.appspot.com",
  messagingSenderId: "572003466525",
  appId: "1:572003466525:web:784c5ca358bc9d51a3b5f4",
  measurementId: "G-0TLVJN1WNF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app); // Initialize and export Firestore
export const auth = getAuth(app); // Initialize and export Auth
