"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { UseAuthReturn } from "@/hooks/useAuth";

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): UseAuthReturn {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  // Add logging to debug auth state
  console.debug("🔍 useAuthContext - Current state:", {
    user: context.user ? "Present" : "Missing",
    email: context.user ? context.user.email : "Not logged",
    session: context.session ? "Present" : "Missing",
    loading: context.loading,
    isAuthenticated: context.isAuthenticated,
  });

  return context;
}
