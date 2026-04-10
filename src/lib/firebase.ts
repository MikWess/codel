import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJU791snwkCoyHDRXKT8L3YCdLxY7mXmQ",
  authDomain: "codel-e2440.firebaseapp.com",
  projectId: "codel-e2440",
  storageBucket: "codel-e2440.firebasestorage.app",
  messagingSenderId: "414089133992",
  appId: "1:414089133992:web:0b3bad939877874fb4279d",
  measurementId: "G-D8ZFK54C17",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export const ADMIN_EMAIL = "michaelrwessman@gmail.com";
