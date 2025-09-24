"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

interface UserProfile {
  onboarding_completed: boolean | null;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isAuthenticated, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [onboardingStatus, setOnboardingStatus] = useState<{
    loading: boolean;
    completed: boolean | null;
  }>({
    loading: true,
    completed: null,
  });

  // Skip onboarding check for the onboarding page itself
  const isOnboardingPage = pathname === "/onboarding";

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Don't check if not authenticated or on onboarding page
      if (!isAuthenticated || isOnboardingPage || !user) {
        setOnboardingStatus({ loading: false, completed: true });
        return;
      }

      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (!response.ok) {
          console.error("Falha ao buscar perfil:", data.error);
          setOnboardingStatus({ loading: false, completed: true }); // Allow access on error
          return;
        }

        const profile = data.profile as UserProfile | null;
        const isCompleted = profile?.onboarding_completed === true;

        setOnboardingStatus({ loading: false, completed: isCompleted });

        // Redirect to onboarding if not completed
        if (!isCompleted) {
          router.push("/onboarding");
        } else {
        }
      } catch (error) {
        console.error("Erro ao verificar status de onboarding:", error);
        setOnboardingStatus({ loading: false, completed: true }); // Allow access on error
      }
    };

    // Only check if authentication is loaded and user is authenticated
    if (!loading && isAuthenticated) {
      checkOnboardingStatus();
    } else if (!loading && !isAuthenticated) {
      // If not authenticated, don't show loading
      setOnboardingStatus({ loading: false, completed: true });
    }
  }, [isAuthenticated, loading, user, isOnboardingPage, router]);

  // Show loading state while checking authentication or onboarding status
  if (loading || onboardingStatus.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render children if onboarding is not completed (except on onboarding page)
  if (!isOnboardingPage && onboardingStatus.completed === false) {
    return null;
  }

  return <>{children}</>;
}
