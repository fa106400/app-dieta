"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { BrowserMinimizationHandler } from "@/components/layout/BrowserMinimizationHandler";

export default function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
      <BrowserMinimizationHandler />
    </ProtectedRoute>
  );
}
