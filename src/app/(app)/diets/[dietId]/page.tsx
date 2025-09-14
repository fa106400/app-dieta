"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Json } from "../../../../../supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Heart,
  Loader2,
  AlertCircle,
  Users,
  Star,
  ChevronDown,
  ChevronRight,
  Flame,
  Utensils,
  Calendar,
  Target,
} from "lucide-react";
import { Diet } from "@/app/(app)/diets/page";
import { toast } from "sonner";

// New interfaces for simplified schema - using Json types from Supabase

// Simplified DietDetail interface - no more variants or separate meals
interface DietDetail extends Diet {
  is_favorited?: boolean;
  recommendation_reasoning?: string | null;
  is_currently_active?: boolean;
}

export default function DietDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthContext();
  const dietId = params.dietId as string;

  const [diet, setDiet] = useState<DietDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Removed selectedVariant state - no longer needed with simplified schema
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0])); // Expand first day by default
  const [isFollowing, setIsFollowing] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  // State to track which alt_item index is currently shown for each item (dayIndex-mealIndex-itemIndex -> altIndex)
  const [itemAltIndex, setItemAltIndex] = useState<Map<string, number>>(
    new Map()
  );

  // Refs to prevent unnecessary re-fetches
  const hasFetchedDiet = useRef(false);
  const isInitialized = useRef(false);

  // Fetch diet details
  const fetchDiet = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (hasFetchedDiet.current) return;

    if (!dietId || !supabase) {
      setError("Invalid diet ID or database connection not available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      hasFetchedDiet.current = true;

      // Fetch diet basic info
      const { data: dietData, error: dietError } = await supabase
        .from("diets")
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
          shopping_plan,
          tags,
          slug,
          is_public,
          created_at,
          updated_at
        `
        )
        .eq("id", dietId)
        .single();

      if (dietError) throw dietError;

      // Fetch recommendation reasoning for this user+diet (if exists)
      let recommendation_reasoning: string | null = null;
      if (user) {
        const { data: recData } = await supabase
          .from("diet_recommendations")
          .select("reasoning")
          .eq("user_id", user.id)
          .eq("diet_id", dietId)
          .maybeSingle();
        recommendation_reasoning = recData?.reasoning ?? null;
      }

      // No need to fetch variants or meals - they are now part of the diet record

      // Check if user has favorited this diet
      let isFavorited = false;
      if (user) {
        const { data: favoriteData } = await supabase
          .from("favorites")
          .select("diet_id")
          .eq("user_id", user.id)
          .eq("diet_id", dietId)
          .single();

        isFavorited = !!favoriteData;
      }

      // Check if this diet is currently active for the user
      let isCurrentlyActive = false;
      if (user) {
        const { data: currentDietData } = await supabase
          .from("user_current_diet")
          .select("diet_id")
          .eq("user_id", user.id)
          .eq("diet_id", dietId)
          .eq("is_active", true)
          .single();

        isCurrentlyActive = !!currentDietData;
      }

      const dietDetail: DietDetail = {
        ...dietData,
        is_favorited: isFavorited,
        recommendation_reasoning,
        is_currently_active: isCurrentlyActive,
      };

      setDiet(dietDetail);
    } catch (err) {
      console.error("Error fetching diet:", err);
      setError("Could not load diet. Try again later.");
      hasFetchedDiet.current = false; // Reset on error to allow retry
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dietId, user?.id]); // Only depend on user.id, not entire user object

  // Initialize data fetching only once
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      fetchDiet();
    }
  }, [fetchDiet]);

  // Handle browser visibility changes to prevent unnecessary re-fetches
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Don't refetch when tab becomes visible again
      // The data should still be valid
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Toggle favorite
  const toggleFavorite = async () => {
    if (!user || !supabase || !diet || !diet.id) return;

    setIsTogglingFavorite(true);

    try {
      if (diet.is_favorited) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("diet_id", diet.id);

        if (error) throw error;

        setDiet((prev) => (prev ? { ...prev, is_favorited: false } : null));
        toast.success("Removed from favorites");
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          diet_id: diet.id,
        });

        if (error) throw error;

        setDiet((prev) => (prev ? { ...prev, is_favorited: true } : null));
        toast.success("Added to favorites");
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast.error("Action failed, please retry.");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // Follow Now functionality
  const followNow = async () => {
    if (!user || !supabase || !diet || !diet.id) return;

    setIsFollowing(true);

    try {
      // First, deactivate any current active diet
      await supabase
        .from("user_current_diet")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("is_active", true);

      // Set new active diet
      const { error } = await supabase.from("user_current_diet").insert({
        user_id: user.id,
        diet_id: diet.id,
        is_active: true,
      });

      if (error) throw error;

      toast.success("Diet set as your current plan!");
      router.push("/my-week");
    } catch (err) {
      console.error("Error setting active diet:", err);
      toast.error("Failed to set as active diet.");
    } finally {
      setIsFollowing(false);
    }
  };

  const unfollowDiet = async () => {
    if (!user || !supabase || !diet || !diet.id) return;

    setIsFollowing(true);

    try {
      // Deactivate the current diet
      const { error } = await supabase
        .from("user_current_diet")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("diet_id", diet.id)
        .eq("is_active", true);

      if (error) throw error;

      toast.success("Diet unfollowed successfully!");
      // Refresh the page to update the button state
      window.location.reload();
    } catch (err) {
      console.error("Error unfollowing diet:", err);
      toast.error("Failed to unfollow diet.");
    } finally {
      setIsFollowing(false);
    }
  };

  // Toggle day expansion
  const toggleDay = (dayIndex: number) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayIndex)) {
        newSet.delete(dayIndex);
      } else {
        newSet.add(dayIndex);
      }
      return newSet;
    });
  };

  const cycleItemSwap = (
    dayIndex: number,
    mealIndex: number,
    itemIndex: number,
    altItemsCount: number
  ) => {
    const swapKey = `${dayIndex}-${mealIndex}-${itemIndex}`;
    setItemAltIndex((prev) => {
      const newMap = new Map(prev);
      const currentIndex = newMap.get(swapKey) || 0;
      const nextIndex = (currentIndex + 1) % altItemsCount;
      newMap.set(swapKey, nextIndex);
      return newMap;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-center">Loading diet details...</span>
        </div>
      </div>
    );
  }

  if (error || !diet) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to Load Diet</h3>
            <p className="text-gray-600 mb-4">{error || "Diet not found"}</p>
            <Button
              onClick={() => {
                hasFetchedDiet.current = false;
                fetchDiet();
              }}
              variant="outline"
            >
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
            <h1 className="text-3xl font-bold text-gray-900">
              {diet.title || "Untitled Diet"}
            </h1>
            <p className="text-gray-600 mt-1">
              {diet.description || "No description available"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFavorite}
            disabled={isTogglingFavorite}
            className={`${
              diet.is_favorited
                ? "text-red-500 hover:text-red-600"
                : "text-gray-400 hover:text-red-500"
            }`}
          >
            {isTogglingFavorite ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart
                className={`h-4 w-4 ${diet.is_favorited ? "fill-current" : ""}`}
              />
            )}
          </Button>
        </div>
      </div>

      {/* Diet Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">
                Category
              </span>
            </div>
            <Badge variant="secondary">
              {diet.category?.replace("_", " ").toUpperCase() || "Unknown"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">
                Difficulty
              </span>
            </div>
            <Badge variant="secondary">
              {diet.difficulty?.toUpperCase() || "Unknown"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">
                Duration
              </span>
            </div>
            <div className="text-lg font-semibold">
              {diet.duration_weeks || 0} weeks
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">
                Popularity
              </span>
            </div>
            <div className="text-lg font-semibold">
              {diet.popularity_score || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diet Information */}
      {diet.calories_total && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flame className="h-5 w-5" />
              <span>Diet Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-blue-600">
                  {diet.calories_total} cal
                </div>
              </div>
              {diet.macros && (
                <div className="text-center space-y-2">
                  <div className="text-sm text-gray-600">Macros</div>
                  <div className="text-sm">
                    <div>
                      Protein:{" "}
                      {(diet.macros as Json & { proteina?: number })?.proteina}g
                    </div>
                    <div>
                      Carbs:{" "}
                      {
                        (diet.macros as Json & { carboidrato?: number })
                          ?.carboidrato
                      }
                      g
                    </div>
                    <div>
                      Fat:{" "}
                      {(diet.macros as Json & { gordura?: number })?.gordura}g
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Why recommended (only if this diet was recommended for the user) */}
      {diet.recommendation_reasoning && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Why this was recommended</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-line">
              {diet.recommendation_reasoning}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Weekly Meal Plan */}
      {diet.week_plan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Utensils className="h-5 w-5" />
              <span>Weekly Meal Plan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(
                diet.week_plan as Json & {
                  days?: Array<{
                    day_index: number;
                    meals: Array<{
                      name: string;
                      calories: number;
                      items: Array<{
                        name: string;
                        quantity: number;
                        unit: string;
                        alt_items?: Array<{
                          name: string;
                          quantity: number;
                          unit: string;
                        }>;
                      }>;
                    }>;
                  }>;
                }
              )?.days?.map(
                (
                  day: Json & {
                    day_index: number;
                    meals: Array<{
                      name: string;
                      calories: number;
                      items: Array<{
                        name: string;
                        quantity: number;
                        unit: string;
                        alt_items?: Array<{
                          name: string;
                          quantity: number;
                          unit: string;
                        }>;
                      }>;
                    }>;
                  },
                  dayIndex: number
                ) => (
                  <Card key={dayIndex}>
                    <CardHeader
                      className="cursor-pointer"
                      onClick={() => toggleDay(dayIndex)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Day {dayIndex + 1}
                        </CardTitle>
                        {expandedDays.has(dayIndex) ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </div>
                    </CardHeader>

                    {expandedDays.has(dayIndex) && (
                      <CardContent>
                        <div className="space-y-3">
                          {day.meals.map((meal, mealIndex) => (
                            <div
                              key={mealIndex}
                              className="p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-medium">{meal.name}</h4>
                                  <div className="text-sm text-gray-600">
                                    {meal.calories} calories
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                {meal.items.map((item, itemIndex) => {
                                  const swapKey = `${dayIndex}-${mealIndex}-${itemIndex}`;
                                  const currentAltIndex =
                                    itemAltIndex.get(swapKey) || 0;
                                  const hasAlternatives =
                                    item.alt_items && item.alt_items.length > 0;

                                  // Create combined array: [originalItem, ...alt_items]
                                  const allItems = hasAlternatives
                                    ? [item, ...item.alt_items!]
                                    : [item];

                                  const currentItem = allItems[currentAltIndex];

                                  return (
                                    <div
                                      key={itemIndex}
                                      className="flex items-center justify-between p-2 bg-white rounded border"
                                    >
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">
                                          {currentItem.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {currentItem.quantity}{" "}
                                          {currentItem.unit}
                                        </div>
                                      </div>
                                      {hasAlternatives && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            cycleItemSwap(
                                              dayIndex,
                                              mealIndex,
                                              itemIndex,
                                              allItems.length
                                            )
                                          }
                                          className="ml-2"
                                        >
                                          Swap
                                        </Button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Follow/Unfollow Button */}
      <div className="flex justify-center">
        <Button
          onClick={diet.is_currently_active ? unfollowDiet : followNow}
          disabled={!diet || isFollowing}
          size="lg"
          className="px-8"
        >
          {isFollowing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {diet.is_currently_active
                ? "Unfollowing..."
                : "Setting as Active..."}
            </>
          ) : diet.is_currently_active ? (
            "Unfollow"
          ) : (
            "Follow Now"
          )}
        </Button>
      </div>
    </div>
  );
}
