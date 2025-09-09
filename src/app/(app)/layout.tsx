"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import { BrowserMinimizationHandler } from "@/components/layout/BrowserMinimizationHandler";

export default function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <OnboardingGuard>
        <AppLayout>{children}</AppLayout>
        <BrowserMinimizationHandler />
      </OnboardingGuard>
    </ProtectedRoute>
  );
}
