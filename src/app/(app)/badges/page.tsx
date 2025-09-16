"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Award,
  //   Star,
  Target,
  TrendingUp,
  Calendar,
  Loader2,
  AlertCircle,
  Sparkles,
  CheckCircle,
  Lock,
} from "lucide-react";
// import { toast } from "sonner";

interface BadgeCriteria {
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
}

interface BadgeData {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_name?: string;
  criteria: BadgeCriteria;
  weight: number;
  visibility: boolean;
  created_at: string;
  user_badges?: {
    awarded_at: string;
  }[];
}

export default function BadgesPage() {
  const { user } = useAuthContext();
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("earned");

  // Fetch badges
  const fetchBadges = async (type: "earned" | "all" = "all") => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/badges?type=${type}`);
      if (!response.ok) {
        throw new Error("Failed to fetch badges");
      }

      const data = await response.json();
      setBadges(data.badges || []);
    } catch (err) {
      console.error("Error fetching badges:", err);
      setError("Failed to load badges");
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    if (user) {
      fetchBadges("earned"); // Start with earned badges since that's the default tab
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    fetchBadges(value as "earned" | "all");
  };

  // Get badge icon
  const getBadgeIcon = (badge: BadgeData) => {
    if (badge.user_badges && badge.user_badges.length > 0) {
      return <Trophy className="h-8 w-8 text-yellow-500" />;
    }
    return <Lock className="h-8 w-8 text-gray-400" />;
  };

  // Get badge status
  const getBadgeStatus = (badge: BadgeData) => {
    if (badge.user_badges && badge.user_badges.length > 0) {
      return {
        earned: true,
        awardedAt: badge.user_badges[0].awarded_at,
        color: "bg-yellow-50 border-yellow-200",
        textColor: "text-yellow-800",
      };
    }
    return {
      earned: false,
      awardedAt: null,
      color: "bg-gray-50 border-gray-200",
      textColor: "text-gray-600",
    };
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get criteria description
  const getCriteriaDescription = (criteria: BadgeCriteria) => {
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
      case "onboarding_completed":
        return `Completar o onboarding ${criteria.count || 1} vez${
          (criteria.count || 1) > 1 ? "es" : ""
        }`;
      case "weight_loss":
        return `Perder ${criteria.threshold || 1}kg`;
      case "experience":
        return `Alcançar ${criteria.threshold || 1000} de experiência`;
      default:
        return criteria.description || "Critério não especificado";
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading badges...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Error Loading Badges
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => fetchBadges("all")} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  const earnedBadges = badges.filter(
    (badge) => badge.user_badges && badge.user_badges.length > 0
  );
  const allBadges = badges;

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Badges</h1>
          <p className="text-gray-600">
            Track your achievements and unlock new badges as you progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Earned Badges</p>
                  <p className="text-2xl font-bold">{earnedBadges.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Badges</p>
                  <p className="text-2xl font-bold">{allBadges.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-2xl font-bold">
                    {allBadges.length > 0
                      ? Math.round(
                          (earnedBadges.length / allBadges.length) * 100
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="earned" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Earned Badges</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>All Badges</span>
            </TabsTrigger>
          </TabsList>

          {/* Earned Badges Tab */}
          <TabsContent value="earned" className="space-y-6">
            {earnedBadges.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Badges Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start your journey by choosing a diet, tracking your weight,
                    or exploring the app!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = "/diets")}
                    >
                      Browse Diets
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = "/profile")}
                    >
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {earnedBadges.map((badge) => {
                  const status = getBadgeStatus(badge);
                  return (
                    <Card key={badge.id} className={`${status.color} border-2`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          {getBadgeIcon(badge)}
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Earned
                          </Badge>
                        </div>
                        <CardTitle className={`text-lg ${status.textColor}`}>
                          {badge.title}
                        </CardTitle>
                        <CardDescription className={status.textColor}>
                          {badge.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              Earned on {formatDate(status.awardedAt!)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Criteria:</strong>{" "}
                            {getCriteriaDescription(badge.criteria)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* All Badges Tab */}
          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBadges.map((badge) => {
                const status = getBadgeStatus(badge);
                return (
                  <Card key={badge.id} className={`${status.color} border-2`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        {getBadgeIcon(badge)}
                        {status.earned ? (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Earned
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-600"
                          >
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </div>
                      <CardTitle className={`text-lg ${status.textColor}`}>
                        {badge.title}
                      </CardTitle>
                      <CardDescription className={status.textColor}>
                        {badge.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {status.earned && status.awardedAt && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              Earned on {formatDate(status.awardedAt)}
                            </span>
                          </div>
                        )}
                        <div className="text-sm text-gray-600">
                          <strong>Criteria:</strong>{" "}
                          {getCriteriaDescription(badge.criteria)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
