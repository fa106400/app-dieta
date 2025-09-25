"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CurrentDietCard } from "@/components/diets/CurrentDietCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, Target, Plus } from "lucide-react";
import type { Json } from "../../../../supabase";

interface DietFromQuery {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration_weeks: number;
  popularity_score: number;
  calories_total: number;
  shopping_plan: Json;
  tags: string[];
  slug: string;
}

interface CurrentDiet {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration_weeks: number;
  popularity_score: number;
  calories_total: number;
  shopping_plan: Json;
  tags: string[];
  slug: string;
  started_at: string;
  is_active: boolean;
}

export default function MyWeekPage() {
  const { user } = useAuthContext();
  const [currentDiet, setCurrentDiet] = useState<CurrentDiet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs to prevent unnecessary re-fetches
  const hasFetchedDiet = useRef(false);
  const isInitialized = useRef(false);

  const fetchCurrentDiet = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (hasFetchedDiet.current || !user) return;

    if (!supabase) {
      setError("Erro ao conectar ao banco de dados. Tente novamente.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      hasFetchedDiet.current = true;

      // Fetch current active diet for the user
      const { data: currentDietData, error: currentDietError } = await supabase
        .from("user_current_diet")
        .select(
          `
          started_at,
          is_active,
          diets:diet_id (
            id,
            title,
            description,
            category,
            difficulty,
            duration_weeks,
            popularity_score,
            calories_total,
            shopping_plan,
            tags,
            slug
          )
        `
        )
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (currentDietError) {
        if (currentDietError.code === "PGRST116") {
          // No active diet found
          setCurrentDiet(null);
        } else {
          throw currentDietError;
        }
      } else if (currentDietData && currentDietData.diets) {
        const diet = currentDietData.diets as {
          id: string;
          title: string;
          description: string;
          category: string;
          difficulty: string;
          duration_weeks: number;
          popularity_score: number;
          calories_total: number;
          tags: string[];
          slug: string;
        };
        setCurrentDiet({
          id: diet.id,
          title: diet.title,
          description: diet.description,
          category: diet.category,
          difficulty: diet.difficulty,
          duration_weeks: diet.duration_weeks,
          popularity_score: diet.popularity_score,
          calories_total: diet.calories_total,
          shopping_plan: (diet as DietFromQuery).shopping_plan || [],
          tags: diet.tags || [],
          slug: diet.slug,
          started_at: currentDietData.started_at || new Date().toISOString(),
          is_active: currentDietData.is_active || false,
        });
      }
    } catch (err) {
      console.error("Error fetching current diet:", err);
      setError("Não foi possível carregar o plano. Tente novamente.");
      hasFetchedDiet.current = false; // Reset on error to allow retry
    } finally {
      setLoading(false);
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize data fetching only once
  useEffect(() => {
    if (!isInitialized.current && user) {
      isInitialized.current = true;
      fetchCurrentDiet();
    }
  }, [fetchCurrentDiet, user]);

  const handleDietChange = () => {
    // Refresh current diet after potential change
    hasFetchedDiet.current = false;
    fetchCurrentDiet();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-center font-lg">
            Carregando seu plano atual...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Não foi possível carregar o plano
            </h3>
            <p className="text-gray-600 mb-4 font-lg">{error}</p>
            <Button
              onClick={() => {
                hasFetchedDiet.current = false;
                fetchCurrentDiet();
              }}
              variant="outline"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu plano atual</h1>
          {/*<p className="text-gray-600 mt-1">Acompanhe seu plano atual</p>*/}
        </div>
      </div>

      {/* Current Diet Section */}
      {currentDiet ? (
        <div className="space-y-4">
          {/*<div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-sky-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Seu Plano Atual
            </h2>
          </div>*/}
          <CurrentDietCard
            currentDiet={currentDiet}
            onDietChange={handleDietChange}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum Plano Ativo</h3>
            <p className="text-gray-600 mb-6 font-lg">
              Você não tem um plano ativo ainda. Escolha um para começar sua
              jornada!
            </p>
            <Button
              onClick={() => (window.location.href = "/diets")}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Escolha um plano</span>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
