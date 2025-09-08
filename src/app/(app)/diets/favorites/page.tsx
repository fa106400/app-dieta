"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { FavoriteDietCard } from "@/components/diets/FavoriteDietCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Search,
} from "lucide-react";
import { Diet } from "@/app/(app)/diets/page";
import { toast } from "sonner";

interface FavoriteDiet extends Diet {
  favorited_at: string | null;
  is_favorited: boolean;
}

export default function FavoritesPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [favorites, setFavorites] = useState<FavoriteDiet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingFavorites, setTogglingFavorites] = useState<Set<string>>(
    new Set()
  );

  // Fetch user's favorite diets
  const fetchFavorites = useCallback(async () => {
    if (!user || !supabase) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("favorites")
        .select(
          `
          diet_id,
          created_at,
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
        .order("created_at", { ascending: false });

      if (error) throw error;

      const favoriteDiets = (data || [])
        .filter((item) => item.diets) // Filter out items where diets is null
        .map((item) => ({
          ...(item.diets as unknown as Diet),
          favorited_at: item.created_at,
          is_favorited: true,
        }));

      setFavorites(favoriteDiets);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Could not load favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Toggle favorite status
  const toggleFavorite = async (dietId: string) => {
    if (!user || !supabase) return;

    setTogglingFavorites((prev) => new Set(prev).add(dietId));

    try {
      const existing = favorites.find((f) => f.id === dietId);

      if (existing) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("diet_id", dietId)
          .eq("user_id", user.id);

        if (error) throw error;

        setFavorites((prev) => prev.filter((f) => f.id !== dietId));
        toast.success("Removed from favorites");
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          diet_id: dietId,
        });

        if (error) throw error;

        // Note: In a real app, you'd refetch or add the diet to the list
        toast.success("Added to favorites");
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast.error("Action failed, please retry.");
    } finally {
      setTogglingFavorites((prev) => {
        const newSet = new Set(prev);
        newSet.delete(dietId);
        return newSet;
      });
    }
  };

  // Filter favorites based on search
  const filteredFavorites = favorites.filter(
    (diet) =>
      !searchQuery.trim() ||
      diet.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diet.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diet.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading favorites...</span>
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
              Unable to Load Favorites
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchFavorites} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
            <p className="text-gray-600 mt-1">Your saved diet plans</p>
          </div>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  No favorites yet
                </h3>
                <p className="text-gray-600 max-w-md">
                  You haven&apos;t favorited any diets yet. Start exploring our
                  catalog to find diets you love!
                </p>
              </div>
              <Button onClick={() => router.push("/diets")} className="mt-4">
                Browse Diet Catalog
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
            <p className="text-gray-600 mt-1">
              {favorites.length} {favorites.length === 1 ? "diet" : "diets"}{" "}
              saved
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
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

      {/* Search */}
      {favorites.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search your favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Favorites List */}
      {filteredFavorites.length === 0 && searchQuery.trim() ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No matching favorites
            </h3>
            <p className="text-gray-600 mb-4">
              No favorites match your search &quot;{searchQuery}&quot;. Try a
              different search term.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
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
          {filteredFavorites.map((diet) => (
            <FavoriteDietCard
              key={diet.id}
              diet={diet}
              viewMode={viewMode}
              isRecommended={false}
              onToggleFavorite={toggleFavorite}
              isToggling={togglingFavorites.has(diet.id || "")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
