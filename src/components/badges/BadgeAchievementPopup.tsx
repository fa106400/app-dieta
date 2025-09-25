"use client";

import React from "react";
// import { useRouter } from "next/navigation";
import { useBadgeNotification } from "@/contexts/BadgeNotificationContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Award,
  Target,
  TrendingUp,
  ShoppingCart,
  Weight,
  Star,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

interface BadgeAchievementPopupProps {
  badges: BadgeData[];
  isVisible: boolean;
  onClose: () => void;
}

export function BadgeAchievementPopup({
  badges,
  isVisible,
  onClose,
}: BadgeAchievementPopupProps) {
  // const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hideBadgeNotification, deferredAction } = useBadgeNotification();
  const [currentBadgeIndex, setCurrentBadgeIndex] = React.useState(0);

  // Reset carousel when badges change
  React.useEffect(() => {
    setCurrentBadgeIndex(0);
  }, [badges]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isVisible) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          if (currentBadgeIndex > 0) {
            setCurrentBadgeIndex(currentBadgeIndex - 1);
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          if (currentBadgeIndex < badges.length - 1) {
            setCurrentBadgeIndex(currentBadgeIndex + 1);
          }
          break;
        case "Escape":
          event.preventDefault();
          hideBadgeNotification();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isVisible,
    currentBadgeIndex,
    badges.length,
    hideBadgeNotification,
    onClose,
  ]);

  if (!isVisible || badges.length === 0) {
    return null;
  }

  const currentBadge = badges[currentBadgeIndex];
  const isFirstBadge = currentBadgeIndex === 0;
  const isLastBadge = currentBadgeIndex === badges.length - 1;

  const goToNextBadge = () => {
    if (!isLastBadge) {
      setCurrentBadgeIndex(currentBadgeIndex + 1);
    }
  };

  const goToPreviousBadge = () => {
    if (!isFirstBadge) {
      setCurrentBadgeIndex(currentBadgeIndex - 1);
    }
  };

  const handleProceed = () => {
    hideBadgeNotification();
    onClose();
  };

  // const handleGoToBadges = () => {
  //   hideBadgeNotification();
  //   onClose();
  //   router.push("/badges");
  // };

  const getBadgeIcon = (badge: BadgeData) => {
    if (badge.icon_name) {
      switch (badge.icon_name) {
        case "trophy":
          return <Trophy className="h-16 w-16 text-yellow-500" />;
        case "award":
          return <Award className="h-16 w-16 text-blue-500" />;
        case "target":
          return <Target className="h-16 w-16 text-green-500" />;
        case "trending-up":
          return <TrendingUp className="h-16 w-16 text-purple-500" />;
        case "shopping-cart":
          return <ShoppingCart className="h-16 w-16 text-orange-500" />;
        case "weight":
          return <Weight className="h-16 w-16 text-red-500" />;
        case "star":
          return <Star className="h-16 w-16 text-yellow-400" />;
        default:
          return <Trophy className="h-16 w-16 text-yellow-500" />;
      }
    }
    return <Trophy className="h-16 w-16 text-yellow-500" />;
  };

  const getCriteriaDescription = (criteria: BadgeData["criteria"]) => {
    if (!criteria) return "Nenhum critério disponível";

    switch (criteria.event) {
      case "diet_chosen":
        return `Escolher ${criteria.count || 1} dieta${
          (criteria.count || 1) > 1 ? "s" : ""
        }`;
      case "diet_switches":
        return `Mudar de dieta ${criteria.count || 1} vez${
          (criteria.count || 1) > 1 ? "es" : ""
        }`;
      case "diet_duration":
        return `Manter a mesma dieta por ${criteria.duration_days || 7} dias`;
      case "shopping_exported":
        // return `Exportar lista de compras ${criteria.count || 1} vez${
        //   (criteria.count || 1) > 1 ? "es" : ""
        // }`;
        return "Exportar lista de compras";
      case "onboarding_completed":
        // return `Completar o onboarding ${criteria.count || 1} vez${
        //   (criteria.count || 1) > 1 ? "es" : ""
        // }`;
        return "Completar o onboarding";
      case "weight_loss":
        return `Perder ${criteria.threshold || 1}kg`;
      case "experience":
        return `Ganhar ${criteria.threshold || 100} pontos de experiência`;
      default:
        return "Critério personalizado";
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <Card className="w-full max-w-md mx-auto bg-white shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-30"></div>
                <div className="relative bg-yellow-100 rounded-full p-4">
                  <Trophy className="h-16 w-16 text-yellow-600" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              🎉 Parabéns!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              {badges.length === 1
                ? "Você desbloqueou uma nova conquista!"
                : `Você desbloqueou ${badges.length} novas conquistas!`}
              {badges.length > 1 && (
                <div className="mt-2 text-sm text-gray-500">
                  Conquista {currentBadgeIndex + 1} de {badges.length}
                </div>
              )}
              {/* {deferredAction && (
                <div className="mt-2 text-sm text-blue-600 font-medium">
                  ⏳ Aguardando sua ação para continuar...
                </div>
              )} */}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Current Badge Display */}
            <div className="relative">
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex-shrink-0">
                  {getBadgeIcon(currentBadge)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentBadge.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 text-xs"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Nova!
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {currentBadge.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Critério:</strong>{" "}
                    {getCriteriaDescription(currentBadge.criteria)}
                  </p>
                </div>
              </div>

              {/* Navigation Arrows */}
              {badges.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousBadge}
                    disabled={isFirstBadge}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextBadge}
                    disabled={isLastBadge}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Progress Dots */}
            {badges.length > 1 && (
              <div className="flex justify-center space-x-2">
                {badges.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBadgeIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentBadgeIndex
                        ? "bg-yellow-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {!isLastBadge ? (
                <Button
                  onClick={goToNextBadge}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  Próxima Conquista
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleProceed}
                    variant="outline"
                    className="flex-1"
                  >
                    Continuar
                  </Button>
                  {/* <Button
                    onClick={handleGoToBadges}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    Ver Todas as Conquistas
                  </Button> */}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
