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

type DeferredAction = {
  type: 'reload' | 'redirect' | 'callback';
  payload?: string | (() => void);
};

export function useBadgeNotificationTrigger() {
  const { showBadgeNotification } = useBadgeNotification();

  const triggerBadgeValidation = useCallback(async (
    event: string,
    payload: Record<string, unknown> = {},
    deferredAction?: DeferredAction
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
        console.error("Falha na validação de badge:", response.statusText);
        return;
      }

      const data: BadgeValidationResponse = await response.json();

      // If new badges were unlocked, show the notification with deferred action
      if (data.success && data.badges && data.badges.length > 0) {
        showBadgeNotification(data.badges, deferredAction);
      } else if (deferredAction) {
        // If no badges but there's a deferred action, execute it immediately
        setTimeout(() => {
          switch (deferredAction.type) {
            case 'reload':
              window.location.reload();
              break;
            case 'redirect':
              if (typeof deferredAction.payload === 'string') {
                window.location.href = deferredAction.payload;
              }
              break;
            case 'callback':
              if (typeof deferredAction.payload === 'function') {
                deferredAction.payload();
              }
              break;
          }
        }, 100);
      }
    } catch (error) {
      console.error("Erro ao triggerar validação de badge:", error);
    }
  }, [showBadgeNotification]);

  const triggerBatchBadgeValidation = useCallback(async (
    events: Array<{ event: string; payload: Record<string, unknown> }>,
    deferredAction?: DeferredAction
  ) => {
    try {
      const response = await fetch("/api/badges/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          events, // Send array of events instead of single event
        }),
      });

      if (!response.ok) {
        console.error("Falha na validação de badge em lote:", response.statusText);
        return;
      }

      const data: BadgeValidationResponse = await response.json();

      // If new badges were unlocked, show the notification with deferred action
      if (data.success && data.badges && data.badges.length > 0) {
        showBadgeNotification(data.badges, deferredAction);
      } else if (deferredAction) {
        // If no badges but there's a deferred action, execute it immediately
        setTimeout(() => {
          switch (deferredAction.type) {
            case 'reload':
              window.location.reload();
              break;
            case 'redirect':
              if (typeof deferredAction.payload === 'string') {
                window.location.href = deferredAction.payload;
              }
              break;
            case 'callback':
              if (typeof deferredAction.payload === 'function') {
                deferredAction.payload();
              }
              break;
          }
        }, 100);
      }
    } catch (error) {
      console.error("Erro ao triggerar validação de badge em lote:", error);
    }
  }, [showBadgeNotification]);

  return { triggerBadgeValidation, triggerBatchBadgeValidation };
}
