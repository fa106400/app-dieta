"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Users,
  Star,
  Sparkles,
  ChevronRight,
  Flame,
} from "lucide-react";
import { Diet } from "@/app/(app)/diets/page";

interface DietCardProps {
  diet: Diet;
  viewMode: "grid" | "list";
  isRecommended?: boolean;
}

export function DietCard({
  diet,
  viewMode,
  isRecommended = false,
}: DietCardProps) {
  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "low_carb":
        return "bg-blue-100 text-blue-800";
      case "keto":
        return "bg-purple-100 text-purple-800";
      case "vegetarian":
        return "bg-green-100 text-green-800";
      case "balanced":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCategory = (category: string | null) => {
    if (!category) return "Unknown";
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (viewMode === "list") {
    return (
      <Card
        className={`transition-all duration-200 hover:shadow-md ${
          isRecommended
            ? "ring-2 ring-yellow-200 bg-gradient-to-r from-yellow-50 to-white"
            : ""
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {diet.title || "Untitled Diet"}
                    </h3>
                    {isRecommended && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {diet.description || "No description available"}
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{diet.popularity_score || 0}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getCategoryColor(diet.category)}>
                  {formatCategory(diet.category)}
                </Badge>
                <Badge className={getDifficultyColor(diet.difficulty)}>
                  {diet.difficulty || "Unknown"}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {diet.duration_weeks || 0} weeks
                </div>
                {diet.min_calories && diet.max_calories && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Flame className="h-4 w-4 mr-1" />
                    {diet.min_calories}-{diet.max_calories} cal
                  </div>
                )}
              </div>

              {diet.tags && diet.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {diet.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag.replace("_", " ")}
                    </Badge>
                  ))}
                  {diet.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{diet.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="ml-4 flex flex-col items-end space-y-2">
              <Button asChild size="sm">
                <Link href={`/diets/${diet.slug || diet.id}`}>
                  View Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              {isRecommended && diet.recommendation_score && (
                <div className="text-xs text-gray-500">
                  {Math.round(diet.recommendation_score * 100)}% match
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card
      className={`h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
        isRecommended
          ? "ring-2 ring-yellow-200 bg-gradient-to-b from-yellow-50 to-white"
          : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 line-clamp-1">
                {diet.title || "Untitled Diet"}
              </h3>
              {isRecommended && (
                <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{diet.popularity_score || 0}</span>
              <Users className="h-4 w-4 ml-2" />
              <span>Popular</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <p className="text-gray-600 text-sm line-clamp-3">
          {diet.description || "No description available"}
        </p>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge className={getCategoryColor(diet.category)}>
              {formatCategory(diet.category)}
            </Badge>
            <Badge className={getDifficultyColor(diet.difficulty)}>
              {diet.difficulty || "Unknown"}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {diet.duration_weeks || 0} weeks
            </div>
            {diet.min_calories && diet.max_calories && (
              <div className="flex items-center">
                <Flame className="h-4 w-4 mr-1" />
                {diet.min_calories}-{diet.max_calories}
              </div>
            )}
          </div>

          {diet.tags && diet.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {diet.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag.replace("_", " ")}
                </Badge>
              ))}
              {diet.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{diet.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="pt-2">
          <Button asChild className="w-full" size="sm">
            <Link href={`/diets/${diet.slug || diet.id}`}>
              View Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          {isRecommended && diet.recommendation_score && (
            <div className="text-center text-xs text-gray-500 mt-2">
              {Math.round(diet.recommendation_score * 100)}% match for you
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
