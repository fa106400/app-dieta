"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  Card,
  CardContent /*CardHeader, CardTitle*/,
} from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trophy,
  // Medal,
  // Award,
  Crown,
  // Star,
  Loader2,
  AlertCircle,
  // Target,
  // Users,
} from "lucide-react";
import { toast } from "react-toastify";

interface LeaderboardUser {
  user_id: string;
  exp: number;
  user_alias: string;
  avatar_url: string | null;
  rank: number;
}

interface LeaderboardData {
  top5: LeaderboardUser[];
  currentUser: LeaderboardUser[];
  next4: LeaderboardUser[];
  totalUsers: number;
}

export default function RankingPage() {
  const { user } = useAuthContext();
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const avatar_path = "/imgs/avatars/";

  const fetchLeaderboard = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/leaderboard");

      if (!response.ok) {
        throw new Error(
          "Falha ao buscar dados do ranking. Tente novamente mais tarde."
        );
      }

      const data = await response.json();
      setLeaderboardData(data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Falha ao carregar o ranking. Tente novamente mais tarde.");
      toast.error("Falha ao carregar o ranking. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLeaderboard();
  }, [user, fetchLeaderboard]);

  const getTrophyIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Crown className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Crown className="h-6 w-6 text-amber-600" />;
      default:
        return <Trophy className="h-6 w-6 text-gray-400" />;
    }
  };

  // const getRankBadgeVariant = (rank: number) => {
  //   switch (rank) {
  //     case 1:
  //       return "default" as const;
  //     case 2:
  //       return "secondary" as const;
  //     case 3:
  //       return "outline" as const;
  //     default:
  //       return "secondary" as const;
  //   }
  // };

  // const getRankBadgeColor = (rank: number) => {
  //   switch (rank) {
  //     case 1:
  //       return "bg-yellow-100 text-yellow-800 border-yellow-200";
  //     case 2:
  //       return "bg-gray-100 text-gray-800 border-gray-200";
  //     case 3:
  //       return "bg-amber-100 text-amber-800 border-amber-200";
  //     default:
  //       return "bg-gray-100 text-gray-800 border-gray-200";
  //   }
  // };

  const renderUserRow = (
    userData: LeaderboardUser,
    isCurrentUser: boolean = false
  ) => {
    return (
      <div
        key={userData.user_id}
        className={`flex items-center space-x-4 p-4 rounded-lg border ${
          isCurrentUser
            ? "bg-green-100 border-green-300 ring-2 ring-green-200"
            : "bg-white border-gray-200 hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {userData.rank <= 3 ? (
              getTrophyIcon(userData.rank)
            ) : (
              <span className="text-lg font-semibold text-black-600 w-6 text-center">
                {userData.rank}
              </span>
            )}
            {/* <Badge
              variant={getRankBadgeVariant(userData.rank)}
              className={`text-xs font-medium ${getRankBadgeColor(
                userData.rank
              )}`}
            >
              #{userData.rank}
            </Badge> */}
          </div>
        </div>

        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar_path + userData.avatar_url || undefined} />
          <AvatarFallback className="bg-gray-200 text-gray-600">
            {userData.user_alias?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userData.user_alias || "Anônimo"}
            </p>
            {/* {isCurrentUser && (
              <Badge
                variant="outline"
                className="text-xs bg-blue-100 text-blue-800 border-blue-200"
              >
                You
              </Badge>
            )} */}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* <Star className="h-4 w-4 text-yellow-500" /> */}
          <span className="text-sm font-semibold text-gray-900">
            {userData.exp.toLocaleString()} XP
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-center">Carregando ranking...</span>
        </div>
      </div>
    );
  }

  if (error || !leaderboardData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Falha ao carregar o ranking
            </h3>
            <p className="text-gray-600 mb-4">
              {error || "Ranking não disponível"}
            </p>
            <Button onClick={fetchLeaderboard} variant="outline">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { top5, currentUser, next4, totalUsers } = leaderboardData;
  const allUsers = [...top5, ...currentUser, ...next4];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ranking</h1>
        {/* <p className="text-gray-600">Top usuários por experiência</p> 
        <div className="flex items-center justify-center space-x-4 mt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Top usuários por experiência</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{totalUsers} usuários</span>
          </div>
        </div> */}
      </div>

      {/* Stats */}
      {currentUser.length > 0 && (
        <Card>
          {/* <CardHeader>
            <CardTitle className="text-lg">Sua Posição</CardTitle>
          </CardHeader> */}
          <CardContent>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  #{currentUser[0].rank}
                </div>
                <div className="text-sm text-gray-600">Sua Posição</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {currentUser[0].exp.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Pontos de Experiência
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {totalUsers}
                </div>
                <div className="text-sm text-gray-600">Total de Usuários</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card>
        {/* <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Rankings</span>
          </CardTitle>
        </CardHeader> */}
        <CardContent>
          {allUsers.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum ranking ainda
              </h3>
              <p className="text-gray-600 mb-4">
                Comece a ganhar experiência para aparecer no ranking!
              </p>
              <Button onClick={() => (window.location.href = "/onboarding")}>
                Completar Onboarding
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {allUsers.map((userData) => {
                const isCurrentUser = userData.user_id === user?.id;
                return renderUserRow(userData, isCurrentUser);
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
