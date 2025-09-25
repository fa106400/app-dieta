"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Trophy,
  TrendingUp,
  Target,
  Award,
  RefreshCw,
  // Calendar,
  // Users,
  Star,
  AlertCircle,
  Loader2,
} from "lucide-react";
// import { toast } from "react-toastify";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

// Interfaces
interface Announcement {
  id: string;
  title: string;
  body: string;
  priority: number | null;
  is_active: boolean | null;
  created_at: string | null;
  expires_at: string | null;
}

interface WeightEntry {
  id: string;
  weight_kg: number;
  created_at: string | null;
}

interface CurrentDiet {
  id: string;
  title: string;
  description: string;
}

interface UserBadge {
  user_id: string;
  badge_id: string;
  awarded_at: string | null;
  badges: {
    id: string;
    title: string;
    description: string;
    icon_name: string | null;
  };
}

interface PersonalSnapshot {
  currentWeight: WeightEntry | null;
  weightHistory: WeightEntry[];
  currentDiet: CurrentDiet | null;
  canRefreshRecommendations: boolean;
}

export default function HomePage() {
  const { user } = useAuthContext();
  const router = useRouter();

  // State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [personalSnapshot, setPersonalSnapshot] =
    useState<PersonalSnapshot | null>(null);
  const [recentBadges, setRecentBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch announcements
  const fetchAnnouncements = useCallback(async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching announcements:", error);
        // Don't block dashboard if announcements fail
        return;
      }

      setAnnouncements(data || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      // Don't block dashboard if announcements fail
    }
  }, []);

  // Fetch personal snapshot data
  const fetchPersonalSnapshot = useCallback(async () => {
    if (!user || !supabase) return;

    try {
      // Fetch last 7 weight entries
      const { data: weights, error: weightsError } = await supabase
        .from("weights")
        .select("id, weight_kg, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(7);

      if (weightsError) {
        console.error("Error fetching weights:", weightsError);
        throw weightsError;
      }

      // Fetch current active diet
      const { data: currentDietData, error: dietError } = await supabase
        .from("user_current_diet")
        .select(
          `
          diets:diet_id (
            id,
            title,
            description
          )
        `
        )
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (dietError && dietError.code !== "PGRST116") {
        console.error("Error fetching current diet:", dietError);
        // Don't throw, just continue without current diet
      }

      // Check if recommendations can be refreshed
      const { data: lastRefresh, error: refreshError } = await supabase
        .from("diet_recommendations")
        .select("last_refreshed")
        .eq("user_id", user.id)
        .order("last_refreshed", { ascending: false })
        .limit(1)
        .single();

      if (refreshError) {
        console.error("Error fetching last refresh:", refreshError);
        // Don't throw, just continue without last refresh
      }

      const canRefreshRecommendations =
        !lastRefresh ||
        new Date().getTime() -
          new Date(lastRefresh.last_refreshed || new Date()).getTime() >
          7 * 24 * 60 * 60 * 1000; // 7 days

      const snapshot: PersonalSnapshot = {
        currentWeight: weights && weights.length > 0 ? weights[0] : null,
        weightHistory: weights || [],
        currentDiet: currentDietData?.diets || null,
        canRefreshRecommendations,
      };

      setPersonalSnapshot(snapshot);
    } catch (err) {
      console.error("Error fetching personal snapshot:", err);
      setError("Could not load your data. Try again later.");
    }
  }, [user]);

  // Fetch recent badges
  const fetchRecentBadges = useCallback(async () => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from("user_badges")
        .select(
          `
          user_id,
          badge_id,
          awarded_at,
          badges (
            id,
            title,
            description,
            icon_name
          )
        `
        )
        .eq("user_id", user.id)
        .order("awarded_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching badges:", error);
        // Don't throw, just show empty state
        return;
      }

      setRecentBadges(data || []);
    } catch (err) {
      console.error("Error fetching badges:", err);
      // Don't throw, just show empty state
    }
  }, [user]);

  // Refresh AI recommendations
  /*const handleRefreshRecommendations = async () => {
    if (!personalSnapshot?.canRefreshRecommendations) return;

    try {
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refresh recommendations");
      }

      toast.success("AI recommendations updated successfully!");
      // Refresh personal snapshot to update the cooldown status
      await fetchPersonalSnapshot();
    } catch (err) {
      console.error("Error refreshing recommendations:", err);
      toast.error("Failed to refresh recommendations. Please try again later.");
    }
    alert("ver TO-DO no comentario do codigo");
  };*/

  // Initial data fetch
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      await Promise.all([
        fetchAnnouncements(),
        fetchPersonalSnapshot(),
        fetchRecentBadges(),
      ]);

      setLoading(false);
    };

    fetchAllData();
  }, [fetchAnnouncements, fetchPersonalSnapshot, fetchRecentBadges]);

  // Format weight history for chart
  const formatWeightHistory = (weights: WeightEntry[]) => {
    return weights
      .reverse() // Show oldest to newest
      .map((weight, index) => ({
        day: `Dia ${index + 1}`,
        weight: weight.weight_kg,
      }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-lg">Carregando seu dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Header 
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.email?.split("@")[0]}!
        </h1>
        <p className="text-gray-600">
          Here&apos;s your personal nutrition dashboard.
        </p>
      </div>
      */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Announcements Panel */}
          {announcements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Novidades</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`p-4 rounded-lg border ${
                        (announcement.priority || 0) > 0
                          ? "border-orange-200 bg-orange-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <h3 className="font-semibold text-sm mb-2">
                        {announcement.title}
                      </h3>
                      <p className="text-md text-gray-600">
                        {announcement.body}
                      </p>
                      {/*
                      <p className="text-xs text-gray-500 mt-2">
                        {announcement.created_at
                          ? new Date(
                              announcement.created_at
                            ).toLocaleDateString()
                          : "Recently"}
                      </p>
                      */}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ranking Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Ranking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Em construção</h3>
                <Button variant="outline" disabled>
                  Ver Ranking completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {/* Personal Snapshot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Foto atual</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-center py-4">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setError(null);
                      fetchPersonalSnapshot();
                    }}
                    className="mt-2"
                  >
                    Tentar novamente
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Current Weight */}
                  {personalSnapshot?.currentWeight && (
                    <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                      <div>
                        <p className="text-md text-gray-600">Peso atual</p>
                        <p className="text-xl font-bold">
                          {personalSnapshot.currentWeight.weight_kg} kg
                        </p>
                      </div>
                      <TrendingUp className="h-6 w-6 text-sky-500" />
                    </div>
                  )}

                  {/* Weight Chart */}
                  {personalSnapshot?.weightHistory &&
                    personalSnapshot.weightHistory.length > 1 && (
                      <div className="h-32">
                        <h4 className="text-md font-medium mb-2">
                          Progresso do peso (Últimos 7 registros)
                        </h4>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={formatWeightHistory(
                              personalSnapshot.weightHistory
                            )}
                          >
                            <XAxis dataKey="day" hide />
                            <YAxis hide />
                            <Line
                              type="monotone"
                              dataKey="weight"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                  {/* Current Diet */}
                  {personalSnapshot?.currentDiet && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-md text-gray-600">Plano atual</p>
                      <p className="font-medium">
                        {personalSnapshot.currentDiet.title}
                      </p>
                    </div>
                  )}

                  {/* AI Recommendations Refresh */}
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-md text-gray-600">
                        Recomendações da IA
                      </p>
                      <p className="text-md">
                        {personalSnapshot?.canRefreshRecommendations
                          ? "Atualize seus dados para uma nova recomendação!"
                          : "Você está indo bem, continue assim!"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => (window.location.href = "/profile")}
                      disabled={!personalSnapshot?.canRefreshRecommendations}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Atualizar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Medalhas recentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentBadges.length > 0 ? (
                <div className="space-y-3">
                  {recentBadges.map((userBadge) => (
                    <div
                      key={`${userBadge.user_id}-${userBadge.badge_id}`}
                      className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                        <Star className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-md">
                          {userBadge.badges.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {userBadge.awarded_at
                            ? new Date(
                                userBadge.awarded_at
                              ).toLocaleDateString()
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/badges")}
                    className="w-full"
                  >
                    Ver todas as medalhas
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Comece sua jornada
                  </h3>
                  <p className="text-gray-600 mb-4 font-lg">
                    Ganhe sua primeira medalha escolhendo um plano!
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/diets")}
                  >
                    Ver perfil
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
