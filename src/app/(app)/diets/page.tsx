"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Json } from "../../../../supabase";
import { DietCard } from "@/components/diets/DietCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DietSorting } from "@/components/diets/DietSorting";
import { DietFilters } from "@/components/diets/DietFilters";
import { DietSearch } from "@/components/diets/DietSearch";

import {
  Filter,
  // Grid3X3,
  // List,
  Loader2,
  AlertCircle,
  // Sparkles,
} from "lucide-react";

export interface Diet {
  id: string | null;
  slug: string | null;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  category: string | null;
  difficulty: string | null;
  duration_weeks: number | null;
  popularity_score: number | null;
  is_public?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  // New fields from simplified schema
  calories_total?: number | null;
  macros?: Json | null; // JSONB field
  week_plan?: Json | null; // JSONB field
  shopping_plan?: Json | null; // JSONB field
  // Recommendation fields (still used)
  is_recommended?: boolean;
  recommendation_score?: number;
  recommendation_reasoning?: string | null;
}

export interface DietFilters {
  category: string[];
  difficulty: string[];
  goal: string[];
}

export type SortOption =
  | "popularity"
  | "recommendation"
  | "alphabetical"
  | "recent";

export default function DietCatalogPage() {
  const { user } = useAuthContext();
  const [diets, setDiets] = useState<Diet[]>([]);
  const [recommendedDiets, setRecommendedDiets] = useState<Diet[]>([]);
  const [filteredDiets, setFilteredDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<DietFilters>({
    category: [],
    difficulty: [],
    // duration: [],
    goal: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  // const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Refs to prevent unnecessary re-fetches
  const hasFetchedDiets = useRef(false);
  const hasFetchedRecommended = useRef(false);
  const isInitialized = useRef(false);

  const fetchDiets = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (hasFetchedDiets.current) return;

    if (!supabase) {
      setError("Erro ao conectar ao banco de dados. Tente novamente.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      hasFetchedDiets.current = true;

      const { data, error } = await supabase
        .from("diet_catalog_view")
        .select(
          `
          id,
          title,
          description,
          category,
          difficulty,
          duration_weeks,
          popularity_score,
          calories_total,
          macros,
          week_plan,
          tags,
          slug
        `
        )
        .order("popularity_score", { ascending: false });

      if (error) throw error;

      setDiets(data || []);
    } catch (err) {
      console.error("Erro ao buscar planos:", err);
      setError("Não foi possível carregar os planos. Tente novamente.");
      hasFetchedDiets.current = false; // Reset on error to allow retry
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies to prevent re-creation

  const fetchRecommendedDiets = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (hasFetchedRecommended.current || !user) return;

    if (!supabase) return;

    try {
      hasFetchedRecommended.current = true;

      const { data, error } = await supabase
        .from("diet_recommendations")
        .select(
          `
          score,
          reasoning,
          diets:diet_id (
            id,
            slug,
            title,
            description,
            tags,
            category,
            difficulty,
            duration_weeks,
            popularity_score,
            calories_total,
            macros,
            week_plan
          )
        `
        )
        .eq("user_id", user.id)
        .order("score", { ascending: false })
        .limit(5);

      if (error) throw error;

      const recommended = (data || []).map((item) => ({
        ...item.diets,
        is_recommended: true,
        recommendation_score: item.score,
        recommendation_reasoning: item.reasoning,
      }));

      setRecommendedDiets(recommended);
      // When we have recommendations, default sort by recommendation
      setSortBy((prev) => (prev === "popularity" ? "recommendation" : prev));
    } catch (err) {
      console.error("Error fetching recommended diets:", err);
      hasFetchedRecommended.current = false; // Reset on error to allow retry
      // Don't show error for recommendations, just hide the section
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only depend on user.id, not the entire user object

  const applyFiltersAndSearch = useCallback(() => {
    // Merge recommendation metadata into the full diets list
    const recommendationById = new Map<
      string,
      { score?: number; reasoning?: string }
    >();
    recommendedDiets.forEach((d) => {
      if (d.id)
        recommendationById.set(d.id, {
          score: d.recommendation_score,
          reasoning: d.recommendation_reasoning || undefined,
        });
    });

    const merged = diets.map((d) => {
      const rec = d.id ? recommendationById.get(d.id) : undefined;
      return rec
        ? {
            ...d,
            is_recommended: true,
            recommendation_score: rec.score,
            recommendation_reasoning: rec.reasoning,
          }
        : d;
    });

    let filtered = [...merged];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (diet) =>
          diet.title?.toLowerCase().includes(query) ||
          diet.description?.toLowerCase().includes(query) ||
          diet.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.category.length > 0) {
      filtered = filtered.filter(
        (diet) =>
          diet.tags &&
          filters.category.some((category) => diet.tags!.includes(category))
      );
    }

    // if (filters.difficulty.length > 0) {
    //   filtered = filtered.filter(
    //     (diet) =>
    //       diet.difficulty && filters.difficulty.includes(diet.difficulty)
    //   );
    // }

    if (filters.goal.length > 0) {
      filtered = filtered.filter(
        (diet) =>
          diet.tags && filters.goal.some((goal) => diet.tags!.includes(goal))
      );
    }

    /*if (filters.duration.length > 0) {
      filtered = filtered.filter((diet) => {
        const weeks = diet.duration_weeks;
        if (!weeks) return false;
        return filters.duration.some((duration: string) => {
          switch (duration) {
            case "short":
              return weeks <= 4;
            case "medium":
              return weeks > 4 && weeks <= 12;
            case "long":
              return weeks > 12;
            default:
              return false;
          }
        });
      });
    }*/

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return (b.popularity_score || 0) - (a.popularity_score || 0);
        case "recommendation":
          return (b.recommendation_score || 0) - (a.recommendation_score || 0);
        case "alphabetical":
          return (a.title || "").localeCompare(b.title || "");
        case "recent":
          const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
          return bDate - aDate;
        default:
          return 0;
      }
    });

    setFilteredDiets(filtered);
  }, [diets, recommendedDiets, searchQuery, filters, sortBy]);

  // Initialize data fetching only once
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      fetchDiets();
    }
  }, [fetchDiets]);

  // Fetch recommended diets when user changes
  useEffect(() => {
    if (user && !hasFetchedRecommended.current) {
      fetchRecommendedDiets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, fetchRecommendedDiets]);

  // Apply filters and search
  useEffect(() => {
    applyFiltersAndSearch();
  }, [applyFiltersAndSearch]);

  // Handle browser visibility changes to prevent unnecessary re-fetches
  /*useEffect(() => {
    const handleVisibilityChange = () => {
      // Don't refetch when tab becomes visible again
      // The data should still be valid
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);*/

  const handleFilterChange = (newFilters: DietFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      difficulty: [],
      // duration: [],
      goal: [],
    });
    setSearchQuery("");
  };

  const hasActiveFilters =
    searchQuery.trim() ||
    filters.category.length > 0 ||
    filters.difficulty.length > 0 ||
    // filters.duration.length > 0 ||
    filters.goal.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-center text-lg">Carregando planos...</span>
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
              Não foi possível carregar os planos.
            </h3>
            <p className=" mb-4 text-lg">{error}</p>
            <Button
              onClick={() => {
                hasFetchedDiets.current = false;
                fetchDiets();
              }}
              variant="outline"
            >
              Tentar novamente
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
          <h1 className="text-2xl font-bold ">Catálogo de Planos</h1>
          <p className=" mt-1 text-lg">
            Descubra o plano perfeito para seus objetivos de saúde
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span className="text-lg">Filtros</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1">
                {filters.category.length +
                  filters.difficulty.length +
                  // filters.duration.length +
                  filters.goal.length}
              </Badge>
            )}
          </Button>

          {/*<div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>*/}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <DietSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar planos por nome, descrição ou tags..."
            />
          </div>
          <DietSorting value={sortBy} onChange={setSortBy} />
        </div>

        {showFilters && (
          <DietFilters
            filters={filters}
            onChange={handleFilterChange}
            onClear={clearFilters}
          />
        )}
      </div>

      {/* Recommended Diets Section }
      {recommendedDiets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-semibold ">
              Recommended for You
            </h2>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recommendedDiets.map((diet) => (
              <DietCard
                key={diet.id}
                diet={diet}
                viewMode={"grid"}
                isRecommended={true}
              />
            ))}
          </div>
        </div>
      )*/}

      {/* All Diets Section - already sorted by recommendations first */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold ">
            {/* Todos os Planos */}
            {hasActiveFilters && (
              <span className="text-md font-normal  ml-2">
                ({filteredDiets.length} de {diets.length} planos)
              </span>
            )}
          </h2>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpar todos os filtros
            </Button>
          )}
        </div>

        {filteredDiets.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12  mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum plano encontrado
              </h3>
              <p className=" mb-4 text-lg">
                {hasActiveFilters
                  ? "Tente alterar seus filtros ou termos de busca."
                  : "Nenhum plano está disponível no momento."}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Limpar filtros
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredDiets.map((diet) => (
              <DietCard
                key={diet.id}
                diet={diet}
                viewMode={"grid"}
                isRecommended={!!diet.is_recommended}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
