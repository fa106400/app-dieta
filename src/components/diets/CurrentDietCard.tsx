"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent /*CardHeader, CardTitle */,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  /*Target, */ Users,
  Star,
  Flame,
  ArrowRight,
} from "lucide-react";
import type { Json } from "../../../supabase";

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

interface CurrentDietCardProps {
  currentDiet: CurrentDiet;
  onDietChange?: () => void;
}

export function CurrentDietCard({ currentDiet }: CurrentDietCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/diets/${currentDiet.id}`);
  };

  /*const handleChangeDiet = () => {
    router.push("/diets");
  };*/

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysSinceStart = () => {
    const startDate = new Date(currentDiet.started_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="border-2 border-blue-200 bg-sky-50/30">
      {/*<CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-sky-500" />
            <CardTitle className="text-lg">Current Diet Plan</CardTitle>
          </div>
          <Badge variant="default" className="bg-sky-600">
            Active
          </Badge>
        </div>
      </CardHeader> */}
      <CardContent className="space-y-4">
        {/* Diet Info */}
        <div>
          <h3 className="font-semibold text-lg ">{currentDiet.title}</h3>
          <p className=" text-md mt-1">{currentDiet.description}</p>
        </div>

        {/* Diet Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm ">Calorias</span>
            </div>
            <div className="text-md font-semibold">
              {currentDiet.calories_total}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm ">Dificuldade</span>
            </div>
            <div className="text-md font-semibold">
              {currentDiet.difficulty?.toUpperCase()}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-sm ">Duração</span>
            </div>
            <div className="text-md font-semibold">
              {currentDiet.duration_weeks}w
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm ">Popularidade</span>
            </div>
            <div className="text-md font-semibold">
              {currentDiet.popularity_score}
            </div>
          </div>
        </div>

        {/* Progress Info */}
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center justify-between text-md">
            <span className="">Iniciado em</span>
            <span className="font-medium">
              {formatDate(currentDiet.started_at)}
            </span>
          </div>
          <div className="flex items-center justify-between text-md mt-1">
            <span className="">Dias seguindo</span>
            <span className="font-medium">{getDaysSinceStart()} dia(s)</span>
          </div>
        </div>

        {/* Tags */}
        {currentDiet.tags && currentDiet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {currentDiet.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
            {currentDiet.tags.length > 3 && (
              <Badge variant="secondary" className="text-sm">
                +{currentDiet.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1"
          >
            Ver Detalhes
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          {/*
          <Button
            variant="outline"
            size="sm"
            onClick={handleChangeDiet}
            className="flex-1"
          >
            Change Diet
          </Button>
          */}
        </div>
      </CardContent>
    </Card>
  );
}
