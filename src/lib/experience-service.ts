"use client";

import { supabase } from "@/lib/supabase";

export interface ExperienceData {
  exp: number;
  user_id: string;
}

export class ExperienceService {
  /**
   * Get current XP for a user
   */
  static async getCurrentXP(userId: string): Promise<number> {
    try {
      if (!supabase) {
        throw new Error("Supabase client não disponível");
      }

      const { data, error } = await supabase
        .from("user_metrics")
        .select("exp")
        .eq("user_id", userId)
        .single();

      if (error) {
        // If no record exists, return 0
        if (error.code === "PGRST116") {
          return 0;
        }
        throw error;
      }

      return data?.exp || 0;
    } catch (error) {
      console.error("Erro ao buscar XP atual:", error);
      return 0;
    }
  }

  /**
   * Increase XP for a user
   */
  static async increaseXP(userId: string, amount: number): Promise<number> {
    try {
      if (!supabase) {
        throw new Error("Supabase client não disponível");
      }

      // Get current XP
      const currentXP = await this.getCurrentXP(userId);
      const newXP = currentXP + amount;

      // Upsert the user_metrics record
      const { data, error } = await supabase
        .from("user_metrics")
        .upsert(
          {
            user_id: userId,
            exp: newXP,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          }
        )
        .select("exp")
        .single();

      if (error) {
        throw error;
      }

      return data?.exp || newXP;
    } catch (error) {
      console.error("Erro ao aumentar XP:", error);
      throw error;
    }
  }

  /**
   * Initialize user metrics record (called after onboarding)
   */
  static async initializeUserMetrics(userId: string, initialXP: number = 100): Promise<number> {
    try {
      if (!supabase) {
        throw new Error("Supabase client não disponível");
      }

      const { data, error } = await supabase
        .from("user_metrics")
        .insert({
          user_id: userId,
          exp: initialXP,
        })
        .select("exp")
        .single();

      if (error) {
        throw error;
      }

      return data?.exp || initialXP;
    } catch (error) {
      console.error("Erro ao inicializar metrics do usuário:", error);
      throw error;
    }
  }

  /**
   * Get user's rank and surrounding users for leaderboard
   */
  static async getUserRank(userId: string): Promise<{
    rank: number;
    user: ExperienceData;
    totalUsers: number;
  } | null> {
    try {
      if (!supabase) {
        throw new Error("Supabase client não disponível");
      }

      // Get all users with their ranks using window function
      const { data, error } = await supabase
        .from("users_metrics_view")
        .select("user_id, exp, user_alias, avatar_url");

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        return null;
      }

      // Sort by exp descending and calculate ranks
      const sortedUsers = data
        .filter(user => user.exp !== null && user.user_id !== null)
        .sort((a, b) => (b.exp || 0) - (a.exp || 0))
        .map((user, index) => ({
          user_id: user.user_id!,
          exp: user.exp!,
          user_alias: user.user_alias || "Anônimo",
          avatar_url: user.avatar_url,
          rank: index + 1,
        }));

      // Find current user
      const currentUser = sortedUsers.find(user => user.user_id === userId);
      
      if (!currentUser) {
        return null;
      }

      return {
        rank: currentUser.rank,
        user: {
          exp: currentUser.exp || 0,
          user_id: currentUser.user_id || "",
        },
        totalUsers: sortedUsers.length,
      };
    } catch (error) {
      console.error("Erro ao buscar rank do usuário:", error);
      return null;
    }
  }

  /**
   * Get leaderboard data (top 5 + current user + next 4)
   */
  static async getLeaderboardData(userId: string): Promise<{
    top5: Array<ExperienceData & { rank: number; user_alias: string; avatar_url: string | null }>;
    currentUser: Array<ExperienceData & { rank: number; user_alias: string; avatar_url: string | null }>;
    next4: Array<ExperienceData & { rank: number; user_alias: string; avatar_url: string | null }>;
  }> {
    try {
      if (!supabase) {
        throw new Error("Supabase client não disponível");
      }

      // Get all users with their ranks
      const { data, error } = await supabase
        .from("users_metrics_view")
        .select("user_id, exp, user_alias, avatar_url");

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        return { top5: [], currentUser: [], next4: [] };
      }

      // Sort by exp descending and calculate ranks
      const sortedUsers = data
        .filter(user => user.exp !== null && user.user_id !== null)
        .sort((a, b) => (b.exp || 0) - (a.exp || 0))
        .map((user, index) => ({
          user_id: user.user_id!,
          exp: user.exp!,
          user_alias: user.user_alias || "Anônimo",
          avatar_url: user.avatar_url,
          rank: index + 1,
        }));

      // Get top 5
      const top5 = sortedUsers.slice(0, 5);

      // Find current user
      const currentUserIndex = sortedUsers.findIndex(user => user.user_id === userId);
      const currentUser = currentUserIndex >= 0 ? [sortedUsers[currentUserIndex]] : [];

      // Get next 4 after current user (if not in top 5)
      let next4: typeof sortedUsers = [];
      if (currentUserIndex >= 5) {
        next4 = sortedUsers.slice(currentUserIndex + 1, currentUserIndex + 5);
      } else if (currentUserIndex >= 0) {
        // If current user is in top 5, get next 4 after top 5
        next4 = sortedUsers.slice(5, 9);
      }

      return {
        top5,
        currentUser,
        next4,
      };
    } catch (error) {
      console.error("Erro ao buscar dados da leaderboard:", error);
      return { top5: [], currentUser: [], next4: [] };
    }
  }
}
