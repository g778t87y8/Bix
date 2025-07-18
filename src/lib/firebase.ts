// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuFnFMy_J_wXbv9YrusLEWEogjj1jGkAA",
  authDomain: "bixing-1b152.firebaseapp.com",
  projectId: "bixing-1b152",
  storageBucket: "bixing-1b152.appspot.com",
  messagingSenderId: "1254701904426",
  appId: "1:1254701904426:web:b744bb191adbB6efc973a1",
  measurementId: "G-08BZEY1F5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics if available
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// We're now using real Firebase credentials
// If you want to use emulators for local development, uncomment the code below

/*
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Only connect to emulators in browser environment and in development mode
  try {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    
    console.log("Connected to Firebase emulators");
  } catch (error) {
    console.error("Failed to connect to Firebase emulators:", error);
  }
}
*/