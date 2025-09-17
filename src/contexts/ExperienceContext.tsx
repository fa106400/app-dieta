"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuthContext } from "./AuthContext";
import { ExperienceService } from "@/lib/experience-service";

interface ExperienceContextType {
  userXP: number;
  loading: boolean;
  refreshXP: () => Promise<void>;
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(
  undefined
);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const [userXP, setUserXP] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchXP = useCallback(async () => {
    if (!user?.id) {
      setUserXP(0);
      return;
    }

    try {
      const xp = await ExperienceService.getCurrentXP(user.id);
      setUserXP(xp);
    } catch (error) {
      console.error("Error fetching XP:", error);
    }
  }, [user?.id]);

  const refreshXP = useCallback(async () => {
    await fetchXP();
  }, [fetchXP]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        await fetchXP();
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id, fetchXP]);

  const value: ExperienceContextType = {
    userXP,
    loading,
    refreshXP,
  };

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (context === undefined) {
    throw new Error("useExperience must be used within an ExperienceProvider");
  }
  return context;
}
