// Firebase SDK Configuration
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Firebase config
// IMPORTANTE: Substitua com suas credenciais do Firebase Console
// Pegar em: https://console.firebase.google.com/project/truestreak-ed450/settings/general
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "COLE_AQUI_DEPOIS",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "truestreak-ed450.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "truestreak-ed450",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "truestreak-ed450.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "COLE_AQUI_DEPOIS",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "COLE_AQUI_DEPOIS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;
