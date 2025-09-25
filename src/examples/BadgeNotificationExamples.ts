/**
 * Examples of how to use the Badge Notification System with Deferred Actions
 * 
 * This file demonstrates different patterns for integrating badge notifications
 * with various user actions that might require page reloads or redirects.
 */

import { useBadgeNotificationTrigger } from "@/hooks/useBadgeNotification";

// Example 1: Diet Selection with Page Reload
export function useDietSelection() {
  const { triggerBadgeValidation } = useBadgeNotificationTrigger();

  const followDiet = async (dietId: string) => {
    // ... your existing diet following logic ...
    
    // Trigger badge validation with deferred reload
    await triggerBadgeValidation("diet_chosen", { diet_id: dietId }, {
      type: 'reload' // Page will reload AFTER modal is closed
    });
  };

  return { followDiet };
}

// Example 2: Weight Logging with Redirect
export function useWeightLogging() {
  const { triggerBadgeValidation } = useBadgeNotificationTrigger();

  const logWeight = async (weight: number, date: string) => {
    // ... your existing weight logging logic ...
    
    // Trigger badge validation with deferred redirect
    await triggerBadgeValidation("weight_loss", { weight_kg: weight, measured_at: date }, {
      type: 'redirect',
      payload: '/profile/manage' // Redirect to profile page AFTER modal is closed
    });
  };

  return { logWeight };
}

// Example 3: Shopping Export with Custom Callback
export function useShoppingExport() {
  const { triggerBadgeValidation } = useBadgeNotificationTrigger();

  const exportShoppingList = async (period: string) => {
    // ... your existing export logic ...
    
    // Trigger badge validation with custom callback
    await triggerBadgeValidation("shopping_exported", { period }, {
      type: 'callback',
      payload: () => {
        // Custom action after modal closes
        console.debug('Export completed, showing success message');
        // Could trigger additional UI updates, analytics, etc.
      }
    });
  };

  return { exportShoppingList };
}

// Example 4: Multiple Badge Events with Single Deferred Action (BATCH MODE)
export function useComplexAction() {
  const { triggerBatchBadgeValidation } = useBadgeNotificationTrigger();

  const performComplexAction = async (data: { dietId: string }) => {
    // ... your existing logic ...
    
    // Batch multiple badge events with single deferred action
    await triggerBatchBadgeValidation(
      [
        { event: "diet_chosen", payload: { diet_id: data.dietId } },
        { event: "diet_switches", payload: { diet_id: data.dietId } }
      ],
      {
        type: 'reload'
      }
    );
  };

  return { performComplexAction };
}

// Example 5: Conditional Deferred Actions
export function useConditionalAction() {
  const { triggerBadgeValidation } = useBadgeNotificationTrigger();

  const conditionalAction = async (shouldReload: boolean, redirectPath?: string) => {
    // ... your existing logic ...
    
    let deferredAction;
    if (shouldReload) {
      deferredAction = { type: 'reload' as const };
    } else if (redirectPath) {
      deferredAction = { type: 'redirect' as const, payload: redirectPath };
    }
    
    await triggerBadgeValidation("experience", { points: 100 }, deferredAction);
  };

  return { conditionalAction };
}
