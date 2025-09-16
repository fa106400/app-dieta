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

type DeferredAction = {
  type: "reload" | "redirect" | "callback";
  payload?: string | (() => void);
};

interface BadgeNotificationContextType {
  showBadgeNotification: (
    badges: BadgeData[],
    deferredAction?: DeferredAction
  ) => void;
  hideBadgeNotification: () => void;
  pendingBadges: BadgeData[];
  isNotificationVisible: boolean;
  deferredAction: DeferredAction | null;
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
  const [deferredAction, setDeferredAction] = useState<DeferredAction | null>(
    null
  );

  const showBadgeNotification = useCallback(
    (badges: BadgeData[], deferredAction?: DeferredAction) => {
      setPendingBadges(badges);
      setIsNotificationVisible(true);
      if (deferredAction) {
        setDeferredAction(deferredAction);
      }
    },
    []
  );

  const hideBadgeNotification = useCallback(() => {
    setIsNotificationVisible(false);
    setPendingBadges([]);

    // Execute deferred action after modal closes
    if (deferredAction) {
      setTimeout(() => {
        switch (deferredAction.type) {
          case "reload":
            window.location.reload();
            break;
          case "redirect":
            if (typeof deferredAction.payload === "string") {
              window.location.href = deferredAction.payload;
            }
            break;
          case "callback":
            if (typeof deferredAction.payload === "function") {
              deferredAction.payload();
            }
            break;
        }
        setDeferredAction(null);
      }, 100); // Small delay to ensure modal is fully closed
    }
  }, [deferredAction]);

  return (
    <BadgeNotificationContext.Provider
      value={{
        showBadgeNotification,
        hideBadgeNotification,
        pendingBadges,
        isNotificationVisible,
        deferredAction,
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
