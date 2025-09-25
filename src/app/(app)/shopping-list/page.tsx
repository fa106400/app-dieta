"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBadgeNotificationTrigger } from "@/hooks/useBadgeNotification";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  // ArrowLeft,
  ShoppingCart,
  FileText,
  AlertCircle,
  Utensils,
} from "lucide-react";
import { toast } from "react-toastify";
import { generateShoppingListPDF } from "@/lib/pdf-export";

// Shopping Plan JSONB Structure Interfaces
interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  icon: null;
}

interface AltItem {
  name: string;
  icon: null;
}

interface ShoppingPlan {
  main_items: ShoppingItem[];
  alt_items: AltItem[];
}

interface CurrentDiet {
  id: string;
  title: string;
  description: string;
  shopping_plan: ShoppingPlan;
}

export default function ShoppingListPage() {
  const { user } = useAuthContext();
  const { triggerBadgeValidation } = useBadgeNotificationTrigger();
  const router = useRouter();
  const [currentDiet, setCurrentDiet] = useState<CurrentDiet | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">(
    "week"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current diet and shopping plan
  const fetchShoppingList = useCallback(async () => {
    if (!user) return;

    if (!supabase) {
      setError("Erro ao conectar ao banco de dados. Tente novamente.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First check if user has an active diet
      const { data: activeDietCheck, error: checkError } = await supabase
        .from("user_current_diet")
        .select("diet_id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (checkError) {
        if (checkError.code === "PGRST116") {
          // No active diet found
          setCurrentDiet(null);
          setLoading(false);
          return;
        }
        throw checkError;
      }

      if (!activeDietCheck?.diet_id) {
        setCurrentDiet(null);
        setLoading(false);
        return;
      }

      // Now fetch the diet details with shopping_plan
      const { data: dietData, error: dietError } = await supabase
        .from("diets")
        .select("id, title, description, shopping_plan")
        .eq("id", activeDietCheck.diet_id)
        .single();

      if (dietError) {
        console.error("Error fetching diet details:", dietError);
        throw dietError;
      }

      if (!dietData) {
        setCurrentDiet(null);
        setLoading(false);
        return;
      }

      // Parse shopping_plan JSONB
      const shoppingPlan = dietData.shopping_plan as unknown as ShoppingPlan;

      const diet: CurrentDiet = {
        id: dietData.id,
        title: dietData.title,
        description: dietData.description,
        shopping_plan: shoppingPlan || { main_items: [], alt_items: [] },
      };

      setCurrentDiet(diet);
    } catch (err) {
      console.error("Error fetching shopping list:", err);

      const error = err as {
        code?: string;
        message?: string;
        details?: string;
      };
      let errorMessage =
        "Erro ao carregar sua lista de compras. Tente novamente mais tarde.";

      if (error?.code === "406") {
        errorMessage = "Atualize a página e tente novamente.";
      } else if (error?.message?.includes("JWT")) {
        errorMessage = "Erro de autenticação. Por favor, faça login novamente.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchShoppingList();
  }, [fetchShoppingList]);

  // Calculate quantity based on selected period
  const calculateQuantity = (baseQuantity: number): number => {
    return selectedPeriod === "month" ? baseQuantity * 30 : baseQuantity * 7;
  };

  // Converte unidades caso passem de 1.000
  const converteMedidas = (quantidade: number, unidade: string): string => {
    let newQuantidade: number = quantidade;
    let newUnidade: string = unidade;

    switch (newUnidade) {
      case "g": //converte grama pra kilo
        if (newQuantidade > 999) {
          newQuantidade = newQuantidade / 1000;
          newUnidade = "kg";
        }

        break;
      case "grams": //converte grams pra g ou kilo
        if (newQuantidade > 999) {
          newQuantidade = newQuantidade / 1000;
          newUnidade = "kg";
        } else {
          newUnidade = "g";
        }

        break;
      case "ml": //converte ml pra litro
        if (newQuantidade > 999) {
          newQuantidade = newQuantidade / 1000;
          newUnidade = "l";
        }

        break;
      case "unidade": //corrige plural
        if (newQuantidade > 1) {
          newUnidade = "unidades";
        }

        break;
      case "pc": //converte pc pra unidade ou unidades
        if (newQuantidade > 1) {
          newUnidade = "unidades";
        } else {
          newUnidade = "unidade";
        }

        break;
      default:
        // não altera os valores e devolve a const
        break;
    }

    return `${newQuantidade} ${newUnidade}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando sua lista de compras...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Erro ao carregar lista de compras
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchShoppingList} variant="outline">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentDiet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum plano ativo</h2>
            <p className="text-gray-600 mb-4">
              Você precisa selecionar um plano primeiro para gerar sua lista de
              compras.
            </p>
            <Button onClick={() => router.push("/diets")}>
              Selecionar um plano
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/my-plan")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Week</span>
          </Button> */}
          <div>
            <h1 className="text-2xl font-bold">Lista de compras</h1>
            <p className="text-gray-600">{currentDiet.title}</p>
          </div>
        </div>
      </div>

      {/* Period Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Período</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedPeriod}
            onValueChange={(value) =>
              setSelectedPeriod(value as "week" | "month")
            }
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="week" id="week" />
              <Label htmlFor="week">7 Dias</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="month" id="month" />
              <Label htmlFor="month">30 Dias</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Main Ingredients List */}
      {currentDiet.shopping_plan.main_items.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>
                  Ingredientes principais (
                  {currentDiet.shopping_plan.main_items.length} itens)
                </span>
              </CardTitle>
              <Button
                onClick={async () => {
                  try {
                    // Generate PDF with current shopping list data
                    generateShoppingListPDF({
                      diet: currentDiet,
                      selectedPeriod,
                      calculateQuantity,
                      converteMedidas,
                    });

                    toast.success("PDF exportado com sucesso!");

                    // Trigger badge validation for shopping export
                    try {
                      await triggerBadgeValidation("shopping_exported");
                    } catch (badgeError) {
                      console.error("Error validating badges:", badgeError);
                      // Don't fail the main operation if badge validation fails
                    }
                  } catch (error) {
                    console.error("Error generating PDF:", error);
                    toast.error("Falha ao gerar PDF. Tente novamente.");
                  }
                }}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Exportar PDF</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentDiet.shopping_plan.main_items.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Utensils className="h-5 w-5 text-gray-500" />
                    <h3 className="font-medium text-lg">{item.name}</h3>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {/* {calculateQuantity(item.quantity)} {item.unit} */}
                    {converteMedidas(
                      calculateQuantity(item.quantity),
                      item.unit
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alternative Ingredients List */}
      {currentDiet.shopping_plan.alt_items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Utensils className="h-5 w-5" />
              <span>
                Ingredientes alternativos (
                {currentDiet.shopping_plan.alt_items.length} itens)
              </span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Este plano contém sugestões de ingredientes alternativos listadas
              aqui para que você possa considerar comprar em pequenas
              quantidades para uso diário.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentDiet.shopping_plan.alt_items.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <Utensils className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State for No Ingredients */}
      {currentDiet.shopping_plan.main_items.length === 0 &&
        currentDiet.shopping_plan.alt_items.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Nenhum ingrediente encontrado
              </h2>
              <p className="text-gray-600">
                Este plano não tem nenhum ingrediente definido em seu plano de
                compras.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
