"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface BadgeData {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_name?: string;
  criteria: {
    event: string;
    operator?: "gte" | "gt" | "eq" | "lte" | "lt";
    count?: number;
    distinct?: boolean;
    threshold?: number;
    unit?: string;
    duration_days?: number;
    window_days?: number;
    target?: string | number | null;
    description?: string;
    meta?: Record<string, unknown>;
  };
  weight: number;
  visibility: boolean;
  created_at: string;
  user_badges?: {
    awarded_at: string;
  }[];
}

interface BadgeNotificationContextType {
  showBadgeNotification: (badges: BadgeData[]) => void;
  hideBadgeNotification: () => void;
  pendingBadges: BadgeData[];
  isNotificationVisible: boolean;
}

const BadgeNotificationContext = createContext<
  BadgeNotificationContextType | undefined
>(undefined);

export function BadgeNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pendingBadges, setPendingBadges] = useState<BadgeData[]>([]);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  const showBadgeNotification = useCallback((badges: BadgeData[]) => {
    setPendingBadges(badges);
    setIsNotificationVisible(true);
  }, []);

  const hideBadgeNotification = useCallback(() => {
    setIsNotificationVisible(false);
    setPendingBadges([]);
  }, []);

  return (
    <BadgeNotificationContext.Provider
      value={{
        showBadgeNotification,
        hideBadgeNotification,
        pendingBadges,
        isNotificationVisible,
      }}
    >
      {children}
    </BadgeNotificationContext.Provider>
  );
}

export function useBadgeNotification() {
  const context = useContext(BadgeNotificationContext);
  if (context === undefined) {
    throw new Error(
      "useBadgeNotification must be used within a BadgeNotificationProvider"
    );
  }
  return context;
}
