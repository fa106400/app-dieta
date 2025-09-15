"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { hideBadgeNotification } = useBadgeNotification();

  if (!isVisible || badges.length === 0) {
    return null;
  }

  const handleProceed = () => {
    hideBadgeNotification();
    onClose();
  };

  const handleGoToBadges = () => {
    hideBadgeNotification();
    onClose();
    router.push("/badges");
  };

  const getBadgeIcon = (badge: BadgeData) => {
    if (badge.icon_name) {
      switch (badge.icon_name) {
        case "trophy":
          return <Trophy className="h-12 w-12 text-yellow-500" />;
        case "award":
          return <Award className="h-12 w-12 text-blue-500" />;
        case "target":
          return <Target className="h-12 w-12 text-green-500" />;
        case "trending-up":
          return <TrendingUp className="h-12 w-12 text-purple-500" />;
        case "shopping-cart":
          return <ShoppingCart className="h-12 w-12 text-orange-500" />;
        case "weight":
          return <Weight className="h-12 w-12 text-red-500" />;
        case "star":
          return <Star className="h-12 w-12 text-yellow-400" />;
        default:
          return <Trophy className="h-12 w-12 text-yellow-500" />;
      }
    }
    return <Trophy className="h-12 w-12 text-yellow-500" />;
  };

  const getCriteriaDescription = (criteria: BadgeData["criteria"]) => {
    if (!criteria) return "No criteria available";

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
        return `Exportar lista de compras ${criteria.count || 1} vez${
          (criteria.count || 1) > 1 ? "es" : ""
        }`;
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
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Badge(s) Display */}
            <div className="space-y-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                >
                  <div className="flex-shrink-0">{getBadgeIcon(badge)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {badge.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800 text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Nova!
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {badge.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      <strong>Critério:</strong>{" "}
                      {getCriteriaDescription(badge.criteria)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleProceed}
                variant="outline"
                className="flex-1"
              >
                Continuar
              </Button>
              <Button
                onClick={handleGoToBadges}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                Ver Conquistas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
