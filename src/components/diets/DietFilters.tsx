"use client";

import { useState } from "react";
import { X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DietFilters as DietFiltersType } from "@/app/(app)/diets/page";

interface DietFiltersProps {
  filters: DietFiltersType;
  onChange: (filters: DietFiltersType) => void;
  onClear: () => void;
}

const categories = [
  { value: "traditional", label: "Tradicional" },
  { value: "vegan", label: "Vegano" },
  { value: "vegetarian", label: "Vegetariano" },
  { value: "lactose_intolerant", label: "Sem lactose" },
  { value: "gluten_free", label: "Sem glúten" },
  { value: "low_carb", label: "Low carb" },
  { value: "keto", label: "Cetogência (Keto)" },
  { value: "paleo", label: "Paleo" },
  { value: "mediterranean", label: "Mediterrâneo" },
  { value: "low_fat", label: "Pouca gordura" },
  { value: "high_protein", label: "Bastante proteína" },
];

const difficulties = [
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
];

/*const durations = [
  { value: "short", label: "Short-term (≤4 weeks)" },
  { value: "medium", label: "Medium-term (5-12 weeks)" },
  { value: "long", label: "Long-term (>12 weeks)" },
];*/

const goals = [
  { value: "lose_weight", label: "Perder peso" },
  { value: "maintain", label: "Manter peso" },
  { value: "gain_muscle", label: "Ganhar massa" },
  { value: "health", label: "Melhorar saúde" },
];

export function DietFilters({ filters, onChange, onClear }: DietFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.category, category]
      : filters.category.filter((c) => c !== category);

    onChange({ ...filters, category: newCategories });
  };

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    const newDifficulties = checked
      ? [...filters.difficulty, difficulty]
      : filters.difficulty.filter((d) => d !== difficulty);

    onChange({ ...filters, difficulty: newDifficulties });
  };

  /*const handleDurationChange = (duration: string, checked: boolean) => {
    const newDurations = checked
      ? [...filters.duration, duration]
      : filters.duration.filter((d) => d !== duration);

    onChange({ ...filters, duration: newDurations });
  };*/

  const handleGoalChange = (goal: string, checked: boolean) => {
    const newGoals = checked
      ? [...filters.goal, goal]
      : filters.goal.filter((g) => g !== goal);

    onChange({ ...filters, goal: newGoals });
  };

  const hasActiveFilters =
    filters.category.length > 0 ||
    filters.difficulty.length > 0 ||
    // filters.duration.length > 0 ||
    filters.goal.length > 0;

  const activeFilterCount =
    filters.category.length +
    filters.difficulty.length +
    // filters.duration.length +
    filters.goal.length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClear}>
                Limpar todos
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Colapsar" : "Expandir"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div className="space-y-3">
            <Label className="text-md font-medium">Categoria</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <div
                  key={category.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`category-${category.value}`}
                    checked={filters.category.includes(category.value)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`category-${category.value}`}
                    className="text-md cursor-pointer"
                  >
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          {/* <div className="space-y-3">
            <Label className="text-md font-medium">Dificuldade</Label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <div
                  key={difficulty.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`difficulty-${difficulty.value}`}
                    checked={filters.difficulty.includes(difficulty.value)}
                    onCheckedChange={(checked) =>
                      handleDifficultyChange(
                        difficulty.value,
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor={`difficulty-${difficulty.value}`}
                    className="text-md cursor-pointer"
                  >
                    {difficulty.label}
                  </Label>
                </div>
              ))}
            </div>
          </div> */}

          {/* Duration Filter 
          <div className="space-y-3">
            <Label className="text-md font-medium">Duration</Label>
            <div className="space-y-2">
              {durations.map((duration) => (
                <div
                  key={duration.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`duration-${duration.value}`}
                    checked={filters.duration.includes(duration.value)}
                    onCheckedChange={(checked) =>
                      handleDurationChange(duration.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`duration-${duration.value}`}
                    className="text-md cursor-pointer"
                  >
                    {duration.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>*/}

          {/* Goal Filter */}
          <div className="space-y-3">
            <Label className="text-md font-medium">Objetivo</Label>
            <div className="grid grid-cols-2 gap-2">
              {goals.map((goal) => (
                <div key={goal.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`goal-${goal.value}`}
                    checked={filters.goal.includes(goal.value)}
                    onCheckedChange={(checked) =>
                      handleGoalChange(goal.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`goal-${goal.value}`}
                    className="text-md cursor-pointer"
                  >
                    {goal.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            <Label className="text-md font-medium">Filtros selecionados:</Label>
            <div className="flex flex-wrap gap-2">
              {filters.category.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>
                    {categories.find((c) => c.value === category)?.label}
                  </span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleCategoryChange(category, false)}
                  />
                </Badge>
              ))}
              {filters.difficulty.map((difficulty) => (
                <Badge
                  key={difficulty}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>
                    {difficulties.find((d) => d.value === difficulty)?.label}
                  </span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleDifficultyChange(difficulty, false)}
                  />
                </Badge>
              ))}
              {/*filters.duration.map((duration) => (
                <Badge
                  key={duration}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>
                    {durations.find((d) => d.value === duration)?.label}
                  </span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleDurationChange(duration, false)}
                  />
                </Badge>
              ))*/}
              {filters.goal.map((goal) => (
                <Badge
                  key={goal}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{goals.find((g) => g.value === goal)?.label}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleGoalChange(goal, false)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
