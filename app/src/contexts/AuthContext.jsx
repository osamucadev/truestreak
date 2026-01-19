import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase/config";
import { trackLogin, trackSetUserId, trackSignUp } from "../services/analytics";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });

        trackSetUserId(firebaseUser.uid);

        // Check if user exists in Firestore, if not create
        await ensureUserExists(firebaseUser);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Ensure user document exists in Firestore
  const ensureUserExists = async (firebaseUser) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new user document
      await setDoc(userRef, {
        profile: {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          createdAt: serverTimestamp(),
          lastActiveAt: serverTimestamp(),
        },
        stats: {
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          currentStreak: 0,
          bestStreak: 0,
          totalWorkouts: 0,
          totalMandatory: 0,
          totalFree: 0,
        },
        cycle: null, // Will be set during onboarding
        achievements: [],
        history: [],
      });

      trackSignUp("google");
    } else {
      // Update lastActiveAt
      await setDoc(
        userRef,
        {
          profile: {
            lastActiveAt: serverTimestamp(),
          },
        },
        { merge: true }
      );
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);

      trackLogin("google");

      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
