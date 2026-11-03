"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  logOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(auth));

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    if (!auth) throw new Error("Firebase is not configured. See README.md.");
    await signInWithPopup(auth, googleProvider);
  };

  const logOut = async () => {
    if (auth) await signOut(auth);
  };

  if (!auth) {
    return <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-bold">Set up your Codel workspace</h1>
      <p className="mt-4">Copy .env.example to .env.local and add your own Firebase web configuration. Enable Google sign-in and Firestore, then restart the development server.</p>
      <p className="mt-4">README.md includes setup steps, database rules, and three ways to use the game.</p>
    </main>;
  }
  return (
    <AuthContext.Provider value={{ user, loading, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
