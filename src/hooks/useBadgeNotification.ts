"use client";

import { useCallback } from "react";
import { useBadgeNotification } from "@/contexts/BadgeNotificationContext";

interface BadgeValidationResponse {
  success: boolean;
  newlyUnlocked: number;
  count: number;
  badges: Array<{
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
  }>;
}

export function useBadgeNotificationTrigger() {
  const { showBadgeNotification } = useBadgeNotification();

  const triggerBadgeValidation = useCallback(async (
    event: string,
    payload: Record<string, unknown> = {}
  ) => {
    try {
      const response = await fetch("/api/badges/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event,
          payload,
        }),
      });

      if (!response.ok) {
        console.error("Badge validation failed:", response.statusText);
        return;
      }

      const data: BadgeValidationResponse = await response.json();

      // If new badges were unlocked, show the notification
      if (data.success && data.badges && data.badges.length > 0) {
        showBadgeNotification(data.badges);
      }
    } catch (error) {
      console.error("Error triggering badge validation:", error);
    }
  }, [showBadgeNotification]);

  return { triggerBadgeValidation };
}
