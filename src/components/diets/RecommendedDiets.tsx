"use client";

import { Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Diet } from "@/app/(app)/diets/page";

interface RecommendedDietsProps {
  diets: Diet[];
  onDietClick: (diet: Diet) => void;
}

export function RecommendedDiets({
  diets,
  onDietClick,
}: RecommendedDietsProps) {
  if (diets.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-yellow-600" />
          <span>Recommended for You</span>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            AI Powered
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Based on your profile and preferences, these diets are tailored for
          your goals.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {diets.map((diet, index) => (
            <div
              key={diet.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200 hover:border-yellow-300 transition-colors cursor-pointer"
              onClick={() => onDietClick(diet)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{diet.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {diet.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {diet.recommendation_score && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-yellow-700">
                      {Math.round(diet.recommendation_score * 100)}% match
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      High match
                    </div>
                  </div>
                )}
                <Badge variant="outline" className="text-xs">
                  {diet.category?.replace("_", " ") || "Unknown"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
