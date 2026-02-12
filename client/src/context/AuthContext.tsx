import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          console.log(">> AUTH_DEBUG: Checking claims for", currentUser.email);
          // Force refresh to get latest claims
          const tokenResult = await getIdTokenResult(currentUser, true);
          console.log(">> AUTH_DEBUG: Claims:", tokenResult.claims);
          
          const hasAdmin = !!tokenResult.claims.admin;
          const hasFacilitator = tokenResult.claims.role === 'facilitator';
          console.log(`>> AUTH_DEBUG: Admin: ${hasAdmin}, Facilitator: ${hasFacilitator}`);

          setIsAdmin(hasAdmin || hasFacilitator);
        } catch (e) {
          console.error("Failed to get claims", e);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
