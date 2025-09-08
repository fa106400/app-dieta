"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { DietCard } from "@/components/diets/DietCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DietSorting } from "@/components/diets/DietSorting";
import { DietFilters } from "@/components/diets/DietFilters";
import { DietSearch } from "@/components/diets/DietSearch";

import {
  Filter,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
  Sparkles,
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
  // These fields are only available in diet_catalog_view, not in base diets table
  variant_count?: number | null;
  min_calories?: number | null;
  max_calories?: number | null;
  is_recommended?: boolean;
  recommendation_score?: number;
  recommendation_reasoning?: string | null;
}

export interface DietFilters {
  category: string[];
  difficulty: string[];
  duration: string[];
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
    duration: [],
    goal: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const fetchDiets = useCallback(async () => {
    if (!supabase) {
      setError("Database connection not available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("diet_catalog_view")
        .select("*")
        .order("popularity_score", { ascending: false });

      if (error) throw error;

      setDiets(data || []);
    } catch (err) {
      console.error("Error fetching diets:", err);
      setError("Unable to load diets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecommendedDiets = useCallback(async () => {
    if (!user || !supabase) return;

    try {
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
            is_public,
            created_at,
            updated_at
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
    } catch (err) {
      console.error("Error fetching recommended diets:", err);
      // Don't show error for recommendations, just hide the section
    }
  }, [user]);

  const applyFiltersAndSearch = useCallback(() => {
    let filtered = [...diets];

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
        (diet) => diet.category && filters.category.includes(diet.category)
      );
    }

    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(
        (diet) =>
          diet.difficulty && filters.difficulty.includes(diet.difficulty)
      );
    }

    if (filters.duration.length > 0) {
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
    }

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
  }, [diets, searchQuery, filters, sortBy]);

  // Fetch all diets
  useEffect(() => {
    fetchDiets();
    if (user) {
      fetchRecommendedDiets();
    }
  }, [user, fetchDiets, fetchRecommendedDiets]);

  // Apply filters and search
  useEffect(() => {
    applyFiltersAndSearch();
  }, [applyFiltersAndSearch]);

  const handleFilterChange = (newFilters: DietFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      difficulty: [],
      duration: [],
      goal: [],
    });
    setSearchQuery("");
  };

  const hasActiveFilters =
    searchQuery.trim() ||
    filters.category.length > 0 ||
    filters.difficulty.length > 0 ||
    filters.duration.length > 0 ||
    filters.goal.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading diets...</span>
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
            <h3 className="text-lg font-semibold mb-2">Unable to Load Diets</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchDiets} variant="outline">
              Try Again
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
          <h1 className="text-3xl font-bold text-gray-900">Diet Catalog</h1>
          <p className="text-gray-600 mt-1">
            Discover the perfect diet plan for your health goals
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
            <span>Filters</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1">
                {filters.category.length +
                  filters.difficulty.length +
                  filters.duration.length +
                  filters.goal.length}
              </Badge>
            )}
          </Button>

          <div className="flex items-center border rounded-md">
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
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <DietSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search diets by name, description, or tags..."
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

      {/* Recommended Diets Section */}
      {recommendedDiets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Recommended for You
            </h2>
          </div>
          <div
            className={`grid gap-4 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {recommendedDiets.map((diet) => (
              <DietCard
                key={diet.id}
                diet={diet}
                viewMode={viewMode}
                isRecommended={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Diets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            All Diets
            {hasActiveFilters && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredDiets.length} of {diets.length} diets)
              </span>
            )}
          </h2>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all filters
            </Button>
          )}
        </div>

        {filteredDiets.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No diets found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters
                  ? "Try changing your filters or search terms."
                  : "No diets are available at the moment."}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div
            className={`grid gap-4 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredDiets.map((diet) => (
              <DietCard
                key={diet.id}
                diet={diet}
                viewMode={viewMode}
                isRecommended={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
