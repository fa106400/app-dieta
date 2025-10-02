"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  // Trophy,
  // TrendingUp,
  Target,
  Award,
  // RefreshCw,
  // Calendar,
  // Users,
  Star,
  AlertCircle,
  Loader2,
  // LibraryBig,
  Trophy,
} from "lucide-react";
// import { toast } from "react-toastify";
// import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

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

interface MiniRankingData {
  topUser: {
    user_id: string;
    exp: number;
    user_alias: string;
    avatar_url: string | null;
    rank: number;
  } | null;
  currentUser: {
    user_id: string;
    exp: number;
    user_alias: string;
    avatar_url: string | null;
    rank: number;
  } | null;
  isCurrentUserTop: boolean;
  totalUsers: number;
}

export default function HomePage() {
  const { user } = useAuthContext();
  const router = useRouter();

  // State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [personalSnapshot, setPersonalSnapshot] =
    useState<PersonalSnapshot | null>(null);
  const [recentBadges, setRecentBadges] = useState<UserBadge[]>([]);
  const [miniRanking, setMiniRanking] = useState<MiniRankingData | null>(null);
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

  // Fetch mini-ranking
  const fetchMiniRanking = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/leaderboard?mini=true");
      if (!response.ok) {
        throw new Error("Falha ao carregar ranking");
      }

      const data = await response.json();
      setMiniRanking(data);
    } catch (err) {
      console.error("Error fetching mini-ranking:", err);
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
        fetchMiniRanking(),
      ]);

      setLoading(false);
    };

    fetchAllData();
  }, [
    fetchAnnouncements,
    fetchPersonalSnapshot,
    fetchRecentBadges,
    fetchMiniRanking,
  ]);

  // Format weight history for chart
  // const formatWeightHistory = (weights: WeightEntry[]) => {
  //   return weights
  //     .reverse() // Show oldest to newest
  //     .map((weight, index) => ({
  //       day: `Dia ${index + 1}`,
  //       weight: weight.weight_kg,
  //     }));
  // };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className=" text-lg">Carregando seu dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      {/* TEMPORARY TEST BUTTON - DELETE WHEN DONE */}
      {/* <div className="mb-4">
        <Button
          onClick={() => router.push("/badge-test")}
          variant="outline"
          size="sm"
          className="bg-yellow-100 border-yellow-300 hover:bg-yellow-200"
        >
          🧪 Test Badge Modal (TEMPORARY - DELETE ME)
        </Button>
      </div> */}

      {/* Header 
      <div className="mb-6">
        <h1 className="text-2xl font-bold  mb-2">
          Welcome back, {user?.email?.split("@")[0]}!
        </h1>
        <p className="">
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
                <div className="space-y-1">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`p-2 rounded-lg border ${
                        (announcement.priority || 0) > 0
                          ? "border-none bg-gray-50"
                          : "border-none bg-gray-50"
                      }`}
                    >
                      <p className="font-semibold text-md mb-0">
                        {announcement.title}
                      </p>
                      <p className="text-md ">{announcement.body}</p>
                      {/*
                      <p className="text-sm  mt-2">
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

          {/* Ranking Preview - renders only on desktop */}
          <Card className="hidden lg:block">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Ranking</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {miniRanking ? (
                <div className="space-y-4">
                  {miniRanking.isCurrentUserTop ? (
                    // Current user is #1
                    <div className="text-center py-4">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              miniRanking.currentUser?.avatar_url
                                ? `/imgs/avatars/${miniRanking.currentUser.avatar_url}`
                                : undefined
                            }
                          />
                          <AvatarFallback className="bg-yellow-100 text-yellow-800">
                            {miniRanking.currentUser?.user_alias
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-medium text-md">
                            {miniRanking.currentUser?.user_alias || "Você"}
                          </p>
                          <p className="text-md ">
                            {/* #{miniRanking.currentUser?.rank} •{" "} */}
                            {miniRanking.currentUser?.exp.toLocaleString()} XP
                          </p>
                        </div>
                      </div>
                      <p className="text-md text-yellow-500 font-medium mb-4">
                        Você está em 1º lugar! Continue assim!
                      </p>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => router.push("/ranking")}
                        className="w-full font-bold bg-sky-500 text-white uppercase text-[0.8rem]"
                      >
                        Ver Ranking completo
                      </Button>
                    </div>
                  ) : (
                    // Show top user and current user
                    <div className="space-y-3">
                      {/* Top User */}
                      {miniRanking.topUser && (
                        <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg ">
                          <Trophy className="h-6 w-6 text-yellow-500" />
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                miniRanking.topUser.avatar_url
                                  ? `/imgs/avatars/${miniRanking.topUser.avatar_url}`
                                  : undefined
                              }
                            />
                            <AvatarFallback className="bg-yellow-100 text-yellow-800 text-md">
                              {miniRanking.topUser.user_alias
                                ?.charAt(0)
                                .toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center justify-between p-3 w-full">
                            <div className="font-medium text-md">
                              {/* #{miniRanking.topUser.rank} •{" "} */}
                              {miniRanking.topUser.user_alias || "Anônimo"}
                            </div>
                            <div className="font-medium text-md">
                              {miniRanking.topUser.exp.toLocaleString()} XP
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Current User */}
                      {miniRanking.currentUser && (
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg ">
                          <span className="text-lg font-semibold text-green-600 w-6 text-center">
                            {miniRanking.currentUser.rank}
                          </span>
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                miniRanking.currentUser.avatar_url
                                  ? `/imgs/avatars/${miniRanking.currentUser.avatar_url}`
                                  : undefined
                              }
                            />
                            <AvatarFallback className="bg-green-100 text-green-800 text-md">
                              {miniRanking.currentUser.user_alias
                                ?.charAt(0)
                                .toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center justify-between p-3 w-full">
                            <p className="font-medium text-md">
                              {miniRanking.currentUser.user_alias || "Você"}
                            </p>
                            <p className="font-medium text-md">
                              {miniRanking.currentUser.exp.toLocaleString()} XP
                            </p>
                          </div>
                        </div>
                      )}

                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => router.push("/ranking")}
                        className="w-full font-bold bg-sky-500 text-white uppercase text-[0.8rem]"
                      >
                        Ver Ranking completo
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Trophy className="h-12 w-12  mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Carregando ranking...
                  </h3>
                  <Button
                    variant="default"
                    size="sm"
                    disabled
                    className="font-bold bg-sky-500 text-white uppercase text-[0.8rem]"
                  >
                    Ver Ranking completo
                  </Button>
                </div>
              )}
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
                    variant="default"
                    size="sm"
                    className="font-bold bg-orange-500 text-white uppercase text-[0.8rem] mt-2"
                    onClick={() => {
                      setError(null);
                      fetchPersonalSnapshot();
                    }}
                  >
                    Tentar novamente
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Current Weight */}
                  {personalSnapshot?.currentWeight && (
                    <div className="flex items-center justify-between p-3 bg-sky-400 text-white rounded-lg">
                      <div>
                        <p className="text-md font-bold">
                          Peso atual:{" "}
                          <span className="font-bold">
                            {personalSnapshot.currentWeight.weight_kg} kg
                          </span>
                        </p>
                        {/* <p className="text-xl font-bold">
                          {personalSnapshot.currentWeight.weight_kg} kg
                        </p> */}
                      </div>
                      {/* <TrendingUp className="h-6 w-6 text-sky-500" /> */}
                      {/** Button to redirect to weight history page */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push("/profile")}
                        className="font-bold text-sky-500 uppercase text-[0.8rem]"
                      >
                        {/* <TrendingUp className="h-6 w-6 text-white" /> */}
                        ver gráfico
                      </Button>
                    </div>
                  )}

                  {/* Weight Chart */}
                  {/* {personalSnapshot?.weightHistory &&
                    personalSnapshot.weightHistory.length > 1 && (
                      <div className="h-32">
                        <h4 className="text-md font-medium mb-2">
                          Ver Progresso do peso
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
                    )} */}

                  {/* Current Diet */}
                  {personalSnapshot?.currentDiet && (
                    <div className="p-3 bg-green-100 rounded-lg">
                      <p className="text-md">Plano atual:</p>
                      <span className="font-bold">
                        {personalSnapshot.currentDiet.title}
                      </span>
                    </div>
                  )}

                  {/** If no current diet, show a message to choose a diet */}
                  {!personalSnapshot?.currentDiet && (
                    <div className="flex items-center justify-between p-3 bg-green-400 text-white rounded-lg">
                      {/* <p className="font-medium ">Plano atual</p> */}
                      <p className="font-bold">Escolha um plano!</p>
                      {/** Button to redirect to diets page */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-bold text-green-500 uppercase text-[0.8rem]"
                        onClick={() => router.push("/diets")}
                      >
                        {/* <LibraryBig className="h-6 w-6 text-white" /> */}
                        Ver catálogo
                      </Button>
                    </div>
                  )}

                  {/* AI Recommendations Refresh */}
                  <div className="flex-col items-center justify-between p-3 bg-purple-400 text-white rounded-lg">
                    <p className="text-md font-bold">Recomendações da IA</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">
                        {personalSnapshot?.canRefreshRecommendations
                          ? "Atualize seus dados!"
                          : "Continue assim!"}
                      </span>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => (window.location.href = "/profile")}
                        disabled={!personalSnapshot?.canRefreshRecommendations}
                        className="font-bold text-purple-500 uppercase text-[0.8rem]"
                      >
                        {/* <RefreshCw className="h-4 w-4 mr-2" /> */}
                        Atualizar
                      </Button>
                    </div>
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
                        <p className="text-md ">
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
                    variant="default"
                    size="sm"
                    onClick={() => router.push("/badges")}
                    className="w-full font-bold bg-yellow-500 text-white uppercase text-[0.8rem]"
                  >
                    ver todas as medalhas
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Award className="h-12 w-12  mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Comece sua jornada
                  </h3>
                  <p className=" mb-4 text-lg">
                    Ganhe sua primeira medalha escolhendo um plano!
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => router.push("/diets")}
                    className="w-full font-bold bg-sky-500 text-white uppercase text-[0.8rem]"
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
