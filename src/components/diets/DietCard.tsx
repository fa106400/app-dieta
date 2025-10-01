"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  // Clock,
  // Users,
  // Star,
  Sparkles,
  // ChevronRight,
  // EyeClosed,
  // Flame,
} from "lucide-react";
import { Diet } from "@/app/(app)/diets/page";

interface DietCardProps {
  diet: Diet;
  viewMode: "grid" | "list";
  isRecommended?: boolean;
  isCurrentDiet?: boolean;
}

export function DietCard({
  diet,
  // viewMode,
  isRecommended = false,
  isCurrentDiet = false,
}: DietCardProps) {
  // lista com todos os valores possiveis para cada tag
  const tags = [
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
    { value: "lose_weight", label: "Perder peso" },
    { value: "maintain", label: "Manter peso" },
    { value: "gain_muscle", label: "Ganhar massa" },
    { value: "health", label: "Melhorar saúde" },
  ];

  //função que recebe uma tag e retorna o label
  const getTagLabel = (tag: string) => {
    return tags.find((t) => t.value === tag)?.label;
  };

  /*const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
       case "beginner":
         return "bg-green-100 text-green-800";
       case "intermediate":
         return "bg-yellow-100 text-yellow-800";
       case "advanced":
         return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 ";
    }
  };*/

  /*const getCategoryColor = (category: string | null) => {
    switch (category) {
       case "low_carb":
         return "bg-sky-100 text-sky-500";
       case "keto":
         return "bg-purple-100 text-purple-800";
       case "vegetarian":
         return "bg-green-100 text-green-800";
       case "balanced":
         return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 ";
    }
  };*/

  /*const formatCategory = (category: string | null) => {
    if (!category) return "Desconhecida";
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };*/

  // if (viewMode === "list") {
  //   return (
  //     <Card
  //       className={`transition-all duration-200 hover:shadow-md ${
  //         isRecommended
  //           ? "ring-2 ring-yellow-200 bg-gradient-to-r from-yellow-50 to-white"
  //           : ""
  //       }`}
  //     >
  //       <CardContent className="p-6">
  //         <div className="flex items-start justify-between">
  //           <div className="flex-1 space-y-3">
  //             <div className="flex items-start justify-between">
  //               <div className="space-y-2">
  //                 <div className="flex items-center space-x-2">
  //                   <h3 className="text-lg font-semibold ">
  //                     {diet.title || "Dieta Genérica"}
  //                   </h3>
  //                   {isRecommended && (
  //                     <Badge
  //                       variant="secondary"
  //                       className="bg-yellow-100 text-yellow-800"
  //                     >
  //                       <Sparkles className="h-3 w-3 mr-1" />
  //                       Recomendada
  //                     </Badge>
  //                   )}
  //                 </div>
  //                 <p className=" text-md line-clamp-2">
  //                   {diet.description || "Nenhuma descrição disponível"}
  //                 </p>
  //               </div>
  //               <div className="flex items-center space-x-1 text-md ">
  //                 <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
  //                 <span>{diet.popularity_score || 0}</span>
  //               </div>
  //             </div>

  //             <div className="flex flex-wrap items-center gap-2">
  //               <Badge className={getCategoryColor(diet.category)}>
  //                 {formatCategory(diet.category)}
  //               </Badge>
  //               {/* <Badge className={getDifficultyColor(diet.difficulty)}>
  //                 {diet.difficulty || "Desconhecida"}
  //               </Badge> */}
  //               <div className="flex items-center text-md ">
  //                 <Clock className="h-4 w-4 mr-1" />
  //                 {diet.duration_weeks || 0} semanas
  //               </div>
  //               {diet.calories_total && (
  //                 <div className="flex items-center text-md ">
  //                   <Flame className="h-4 w-4 mr-1" />
  //                   {diet.calories_total} kcal
  //                 </div>
  //               )}
  //             </div>

  //             {diet.tags && diet.tags.length > 0 && (
  //               <div className="flex flex-wrap gap-1">
  //                 {diet.tags.slice(0, 3).map((tag) => (
  //                   <Badge key={tag} variant="outline" className="text-sm">
  //                     {tag.replaceAll("_", " ")}
  //                   </Badge>
  //                 ))}
  //                 {diet.tags.length > 3 && (
  //                   <Badge variant="outline" className="text-sm">
  //                     +{diet.tags.length - 3}+
  //                   </Badge>
  //                 )}
  //               </div>
  //             )}
  //           </div>

  //           <div className="ml-4 flex flex-col items-end space-y-2">
  //             <Button asChild size="sm">
  //               <Link href={`/diets/${diet.id}`}>
  //                 Ver Detalhes
  //                 <ChevronRight className="h-4 w-4 ml-1" />
  //               </Link>
  //             </Button>
  //             {isRecommended && diet.recommendation_score && (
  //               <div className="text-sm ">
  //                 {Math.round(diet.recommendation_score * 100)}% match
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

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
              <h3 className="font-semibold  line-clamp-1">
                {diet.title || "Dieta Genérica"}
              </h3>
              {isRecommended && (
                <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
              )}
            </div>

            {/* <div className="flex items-center space-x-1 text-md ">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{diet.popularity_score || 0}</span>
              <Users className="h-4 w-4 ml-2" />
              <span>Popular</span>
            </div> */}
          </div>
          {isCurrentDiet && (
            <Badge
              variant="default"
              className="bg-green-500 text-white font-bold text-xs"
            >
              Seguindo
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <p className=" text-md line-clamp-3">
          {diet.description || "Nenhuma descrição disponível"}
        </p>

        <div className="space-y-3">
          {/* <div className="flex flex-wrap gap-2">
            <Badge className={getCategoryColor(diet.category)}>
              {formatCategory(diet.category)}
            </Badge>
            <Badge className={getDifficultyColor(diet.difficulty)}>
              {diet.difficulty || "Desconhecida"}
            </Badge>
          </div> */}
          {/* <div className="flex items-center justify-between text-md ">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {diet.duration_weeks || 0} semanas
            </div>
            {diet.calories_total && (
              <div className="flex items-center">
                <Flame className="h-4 w-4 mr-1" />
                {diet.calories_total}
              </div>
            )}
          </div> */}
          {diet.tags && diet.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {/* mostra até 3 tags */}
              {diet.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {/*tag.replaceAll("_", " ")*/}
                  {getTagLabel(tag)}
                </Badge>
              ))}
              {/* sempre teremos no max 3 tags ja exibidas acima */}
              {/*diet.tags.length > 3 && (
                <Badge variant="outline" className="text-sm">
                  +{diet.tags.length - 2}
                </Badge>
              )*/}
            </div>
          )}

          {/*showing slug for debugging*/}
          {/* <div className="flex items-center justify-between text-md bg-yellow-400 p-2 rounded-md">
            {diet.slug && <div className="flex items-center">{diet.slug}</div>}
          </div> */}
        </div>

        <div className="pt-2">
          <Button asChild className="w-full" size="sm">
            <Link href={`/diets/${diet.id}`}>
              Ver Detalhes
              {/* <EyeClosed className="h-4 w-4 ml-1" /> */}
            </Link>
          </Button>
          {isRecommended && diet.recommendation_score && (
            <div className="text-center text-md  mt-2">
              {Math.round(diet.recommendation_score * 100)}% match para você
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
