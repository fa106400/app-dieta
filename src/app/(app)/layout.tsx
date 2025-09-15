"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import { BrowserMinimizationHandler } from "@/components/layout/BrowserMinimizationHandler";
import { BadgeNotificationProvider } from "@/contexts/BadgeNotificationContext";
import { BadgeNotificationManager } from "@/components/badges/BadgeNotificationManager";

export default function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <OnboardingGuard>
        <BadgeNotificationProvider>
          <AppLayout>{children}</AppLayout>
          <BrowserMinimizationHandler />
          <BadgeNotificationManager />
        </BadgeNotificationProvider>
      </OnboardingGuard>
    </ProtectedRoute>
  );
}
