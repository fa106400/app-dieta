"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useBadgeNotificationTrigger } from "@/hooks/useBadgeNotification";
import { useExperience } from "@/contexts/ExperienceContext";
import { ExperienceService } from "@/lib/experience-service";
import { supabase } from "@/lib/supabase";
import { calculateEstimatedCalories } from "@/lib/calorie-calculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Save,
  User,
  Settings,
  Activity,
  Weight,
  //TrendingUp,
  // RefreshCw,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Shield,
  Sparkles,
  Check,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";

// Interfaces
interface ProfileData {
  age: number;
  weight_start_kg: number;
  height_cm: number;
  goal: "lose_weight" | "maintain" | "gain_muscle" | "health";
  dietary_preferences: string[];
  activity_level:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extra_active";
  food_dislikes: string;
  onboarding_completed: boolean;
  user_alias?: string;
  avatar_url?: string;
  estimated_calories?: number;
}

interface WeightEntry {
  id: string;
  user_id: string;
  weight_kg: number;
  measured_at: string;
  created_at: string | null;
}

interface ChartData {
  date: string;
  weight: number;
  displayDate: string;
}

const ACTIVITY_LEVELS = {
  sedentary: {
    label: "Sedentário",
    description:
      "Pouco ou nenhum exercício e um trabalho que envolve ficar sentado na maior parte do dia.",
    examples:
      "Trabalho de escritório, recepcionistas, motoristas ou indivíduos que passam a maior parte do dia em frente ao computador com pouco movimento",
  },
  lightly_active: {
    label: "Levemente Ativo",
    description: "Pouco exercício ou esportes 1-3 vezes por semana.",
    examples:
      "Um trabalho sedentário com pouco exercício, como uma caminhada curta ou um treino leve algumas vezes por semana.",
  },
  moderately_active: {
    label: "Moderadamente Ativo",
    description: "Exercício moderado ou esportes 3-5 vezes por semana.",
    examples:
      "Alguém com um trabalho que envolve ficar de pé por uma parte significativa do dia, junto com um exercício moderado algumas vezes por semana.",
  },
  very_active: {
    label: "Muito Ativo",
    description: "Exercício intenso ou esportes 6-7 vezes por semana.",
    examples: "Treinos intensos na maioria dos dias da semana.",
  },
  extra_active: {
    label: "Super Ativo",
    description:
      "Exercício intenso mais treino, um trabalho físico demandante ou treino duas vezes por dia.",
    examples:
      "Profissões com trabalhos físicos demandantes combinados com exercício intenso frequentemente.",
  },
};

const DIETARY_PREFERENCES = [
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

const GOALS = [
  { value: "lose_weight", label: "Perder peso" },
  { value: "maintain", label: "Manter peso" },
  { value: "gain_muscle", label: "Ganhar massa" },
  { value: "health", label: "Saúde e bem-estar" },
];

export default function ProfileManagePage() {
  const { user } = useAuthContext();
  const { triggerBatchBadgeValidation } = useBadgeNotificationTrigger();
  const { refreshXP } = useExperience();

  // Profile state
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Weight state
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [weightLoading, setWeightLoading] = useState(true);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [newWeight, setNewWeight] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<"1w" | "1m" | "3m">("1m");

  // AI Refresh state
  const [aiCooldownHours, setAiCooldownHours] = useState<number | null>(null);
  const [isRefreshingAI, setIsRefreshingAI] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState("personal");

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      setProfileLoading(true);
      setProfileError(null);

      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        throw new Error("Falha ao carregar perfil. Tente novamente.");
      }

      const data = await response.json();
      setProfile(data.profile);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setProfileError("Falha ao carregar perfil. Tente novamente.");
    } finally {
      setProfileLoading(false);
    }
  }, [user]);

  // Fetch weight entries
  const fetchWeights = useCallback(async () => {
    if (!user || !supabase) return;

    try {
      setWeightLoading(true);
      setWeightError(null);

      const { data, error } = await supabase
        .from("weights")
        .select("*")
        .eq("user_id", user.id)
        .order("measured_at", { ascending: true });

      if (error) throw error;

      setWeightEntries(data || []);

      // Set the latest weight (last entry in the array since it's sorted ascending)
      if (data && data.length > 0) {
        setLatestWeight(data[data.length - 1].weight_kg);
      } else {
        setLatestWeight(null);
      }
    } catch (err) {
      console.error("Error fetching weights:", err);
      setWeightError("Falha ao carregar peso. Tente novamente.");
    } finally {
      setWeightLoading(false);
    }
  }, [user]);

  // Fetch AI cooldown
  const fetchAiCooldown = useCallback(async () => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from("diet_recommendations")
        .select("last_refreshed")
        .eq("user_id", user.id)
        .order("last_refreshed", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching AI cooldown:", error);
        return;
      }

      if (!data?.last_refreshed) {
        setAiCooldownHours(0);
      } else {
        const hoursSince =
          (Date.now() - new Date(data.last_refreshed).getTime()) /
          (1000 * 60 * 60);
        setAiCooldownHours(Math.max(0, 168 - hoursSince)); // 168 hours = 7 days
      }
    } catch (err) {
      console.error("Error fetching AI cooldown:", err);
      setAiCooldownHours(0); // Assume no cooldown on error
    }
  }, [user]);

  // Update diet recommendations when estimated calories change
  const updateDietRecommendationsForNewCalories = async (
    userId: string,
    oldCalories: number | null | undefined,
    newCalories: number
  ): Promise<void> => {
    // 1. Early exits
    if (oldCalories === newCalories) return;
    if (!supabase) {
      console.warn("[updateDietRecs] Supabase not available");
      return;
    }

    try {
      console.log(
        `[updateDietRecs] Updating recommendations: ${oldCalories} → ${newCalories} kcal`
      );

      // 2. Fetch recommendations
      const { data: recommendations, error: recError } = await supabase
        .from("diet_recommendations")
        .select("id, diet_id, score, reasoning")
        .eq("user_id", userId);

      if (recError) throw recError;

      if (!recommendations || recommendations.length === 0) {
        console.log("[updateDietRecs] No recommendations to update");
        return;
      }

      // 3. Process each recommendation individually (safer than batch)
      for (const rec of recommendations) {
        try {
          // 3a. Get current diet
          const { data: currentDiet, error: dietError } = await supabase
            .from("diets")
            .select("id, title, calories_total")
            .eq("id", rec.diet_id)
            .single();

          if (dietError || !currentDiet) {
            console.warn(`[updateDietRecs] Diet ${rec.diet_id} not found`);
            continue;
          }

          // 3b. Find equivalent at new calorie level
          const { data: newDiet, error: newDietError } = await supabase
            .from("diets")
            .select("id")
            .eq("title", currentDiet.title)
            .eq("calories_total", newCalories)
            .single();

          //log newDietError only if error exists
          if (newDietError) {
            console.log("newDietError", newDietError);
          }

          // 3c. Update or keep
          if (newDiet && newDiet.id !== rec.diet_id) {
            const { error: updateError } = await supabase
              .from("diet_recommendations")
              .update({
                diet_id: newDiet.id,
                last_refreshed: new Date().toISOString(),
              })
              .eq("id", rec.id);

            if (updateError) {
              console.error(
                `[updateDietRecs] Failed to update rec ${rec.id}:`,
                updateError
              );
            } else {
              console.log(
                `✅ Updated: "${currentDiet.title}" ${currentDiet.calories_total} → ${newCalories} kcal`
              );
            }
          } else if (!newDiet) {
            console.error(
              `⚠️ No equivalent: "${currentDiet.title}" at ${newCalories} kcal. Keeping ${currentDiet.calories_total} kcal.`
            );
          }
        } catch (recError) {
          console.error(
            `[updateDietRecs] Error processing recommendation ${rec.id}:`,
            recError
          );
          // Continue with next recommendation
        }
      }

      console.log(`[updateDietRecs] Completed for user ${userId}`);
    } catch (error) {
      console.error("[updateDietRecs] Fatal error:", error);
      // Don't throw - fail silently to not break profile update
    }
  };

  // Save profile
  const saveProfile = async (updatedProfile: Partial<ProfileData>) => {
    if (!user) return;

    try {
      setProfileSaving(true);
      setProfileError(null);

      // Calculate estimated calories if relevant fields are being updated
      let estimatedCalories: number | undefined;
      try {
        // Merge current profile with updates to get complete data for calculation
        // Use latestWeight from weights table instead of weight_start_kg
        const profileForCalculation = {
          age: updatedProfile.age ?? profile?.age,
          weight: latestWeight ?? profile?.weight_start_kg,
          height: updatedProfile.height_cm ?? profile?.height_cm,
          activityLevel:
            updatedProfile.activity_level ?? profile?.activity_level,
          goals: updatedProfile.goal
            ? [updatedProfile.goal]
            : profile?.goal
            ? [profile.goal]
            : undefined,
        };

        // Only calculate if we have the required fields
        if (
          profileForCalculation.age &&
          profileForCalculation.weight &&
          profileForCalculation.height &&
          profileForCalculation.activityLevel
        ) {
          estimatedCalories = calculateEstimatedCalories(profileForCalculation);
        }
      } catch (calorieError) {
        console.error("Error calculating estimated calories:", calorieError);
        // Don't fail the profile update if calorie calculation fails
        // Keep the old value by not including estimated_calories in the update
      }

      // Store old value before update for recommendation migration
      const oldEstimatedCalories = profile?.estimated_calories;

      const requestBody = {
        ...updatedProfile,
        ...(estimatedCalories !== undefined && {
          estimated_calories: estimatedCalories,
        }),
      };

      console.log("[saveProfile] Request body being sent to API:", requestBody);

      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[saveProfile] API error response:", errorData);
        console.error("[saveProfile] Response status:", response.status);
        throw new Error(
          errorData.error || "Falha ao salvar perfil. Tente novamente."
        );
      }

      // Update diet recommendations if calories changed
      if (
        estimatedCalories !== undefined &&
        estimatedCalories !== oldEstimatedCalories
      ) {
        await updateDietRecommendationsForNewCalories(
          user.id,
          oldEstimatedCalories,
          estimatedCalories
        );
      }

      await fetchProfile(); // Refresh profile data
      toast.success("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Error saving profile:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Falha ao salvar perfil. Tente novamente.";
      setProfileError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProfileSaving(false);
    }
  };

  // Add weight entry
  const addWeight = async () => {
    if (!user || !supabase || !newWeight || !selectedDate) return;

    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight < 30 || weight > 300) {
      toast.error("Peso deve estar entre 30 e 300 kg");
      return;
    }

    try {
      setIsAddingWeight(true);

      const { error } = await supabase.from("weights").insert({
        user_id: user.id,
        weight_kg: weight,
        measured_at: selectedDate,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("Você já tem um registro de peso para esta data");
          return;
        }
        throw error;
      }

      setNewWeight("");
      setSelectedDate("");
      await fetchWeights();
      toast.success("Registro de peso adicionado com sucesso!");

      // Recalculate estimated calories with the new weight
      try {
        if (
          profile?.age &&
          profile?.height_cm &&
          profile?.activity_level &&
          profile?.goal
        ) {
          const estimatedCalories = calculateEstimatedCalories({
            age: profile.age,
            weight: weight, // Use the new weight entry
            height: profile.height_cm,
            activityLevel: profile.activity_level,
            goals: [profile.goal],
          });

          // Store old value before update for recommendation migration
          const oldEstimatedCalories = profile.estimated_calories;

          // Update profile with new estimated calories
          const response = await fetch("/api/auth/me", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              estimated_calories: estimatedCalories,
            }),
          });

          // Update diet recommendations if calories changed and update succeeded
          if (response.ok && estimatedCalories !== oldEstimatedCalories) {
            await updateDietRecommendationsForNewCalories(
              user.id,
              oldEstimatedCalories,
              estimatedCalories
            );
          }
        }
      } catch (calorieError) {
        console.error(
          "Error updating estimated calories after weight entry:",
          calorieError
        );
        // Don't fail the weight entry operation if calorie update fails
      }

      // Increase XP for weight logging
      try {
        await ExperienceService.increaseXP(user.id, 100);
        console.debug("XP increased by 100 for weight logging");
        // Refresh XP in the global context
        await refreshXP();
      } catch (xpError) {
        console.warn("Error increasing XP:", xpError);
        // Don't show error to user - XP increase is not critical
      }

      // Batch multiple badge events with single deferred action
      try {
        await triggerBatchBadgeValidation([
          {
            event: "weight_loss",
            payload: {
              weight_kg: weight,
              measured_at: selectedDate,
            },
          },
          { event: "experience", payload: { points: 100 } },
        ]);
      } catch (err) {
        console.error("Error triggering badge validation:", err);
        // Don't fail the main operation if badge validation fails
      }
    } catch (err) {
      console.error("Error adding weight:", err);
      toast.error("Falha ao adicionar registro de peso. Tente novamente.");
    } finally {
      setIsAddingWeight(false);
    }
  };

  // Delete weight entry
  const deleteWeight = async (id: string) => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from("weights")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      await fetchWeights();
      toast.success("Registro de peso deletado com sucesso!");
    } catch (err) {
      console.error("Error deleting weight:", err);
      toast.error("Falha ao deletar registro de peso. Tente novamente.");
    }
  };

  // Refresh AI recommendations
  const handleRefreshAI = async () => {
    if (!user || (aiCooldownHours && aiCooldownHours > 0)) return;

    try {
      setIsRefreshingAI(true);

      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            "Falha ao atualizar recomendações. Tente novamente."
        );
      }

      toast.success("Recomendações atualizadas com sucesso!");
      await fetchAiCooldown();
    } catch (err) {
      console.error("Error refreshing AI:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Falha ao atualizar recomendações. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setIsRefreshingAI(false);
    }
  };

  // Format cooldown display
  const formatCooldown = (hours: number | null): string => {
    if (hours === null) return "";
    if (hours < 1) return "";
    if (hours < 24) return ` em ${Math.ceil(hours)}h`;
    return ` em ${Math.ceil(hours / 24)}d`;
  };

  // Prepare chart data
  const prepareChartData = (): ChartData[] => {
    if (!weightEntries.length) return [];

    const now = new Date();
    const periodDays =
      chartPeriod === "1w" ? 7 : chartPeriod === "1m" ? 30 : 90;
    const startDate = new Date(
      now.getTime() - periodDays * 24 * 60 * 60 * 1000
    );

    const filteredEntries = weightEntries.filter((entry) => {
      const entryDate = new Date(entry.measured_at);
      return entryDate >= startDate;
    });

    return filteredEntries.map((entry) => ({
      date: entry.measured_at,
      weight: entry.weight_kg,
      displayDate: new Date(entry.measured_at).toLocaleDateString(),
    }));
  };

  // Check if date has existing entry
  const hasEntryForDate = (date: string): boolean => {
    return weightEntries.some((entry) => entry.measured_at === date);
  };

  // Get local date in YYYY-MM-DD format for Brazil
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Initialize data
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchWeights();
      fetchAiCooldown();

      // Set today's date as default (local Brazilian date)
      setSelectedDate(getLocalDateString());
    }
  }, [user, fetchProfile, fetchWeights, fetchAiCooldown]);

  if (profileLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className=" text-lg">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Erro ao carregar perfil
            </h2>
            <p className=" mb-4 text-lg">{profileError}</p>
            <Button onClick={fetchProfile} variant="outline">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12  mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Nenhum perfil encontrado
            </h2>
            <p className="">
              Por favor, complete sua configuração de perfil primeiro.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold  mb-2">Perfil</h1>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <p className=" mb-4 lg:mb-0 text-lg">
              Gerencie suas informações pessoais e acompanhe seu progresso
            </p>

            {/* AI Refresh Button */}
            <div className="flex flex-row items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleRefreshAI}
                  disabled={
                    isRefreshingAI ||
                    (aiCooldownHours !== null && aiCooldownHours > 0)
                  }
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  {isRefreshingAI ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span>
                    Novas recomendações{formatCooldown(aiCooldownHours)}
                  </span>
                </Button>
              </div>
              {/* <div className="flex items-center space-x-2">
                {aiCooldownHours !== null && aiCooldownHours > 0 && (
                  <Badge variant="secondary" className="text-md">
                    {formatCooldown(aiCooldownHours)}
                  </Badge>
                )}
              </div> */}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="personal"
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Pessoal</span>
            </TabsTrigger>
            <TabsTrigger
              value="dietary"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Nutricional</span>
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="flex items-center space-x-2"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Atividade</span>
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex items-center space-x-2">
              <Weight className="h-4 w-4" />
              <span className="hidden sm:inline">Peso & Progresso</span>
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Exibição</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                {/* <CardDescription>
                  Atualize suas informações pessoais e objetivo principal
                </CardDescription> */}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Idade:</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profile.age || ""}
                      onChange={(e) =>
                        setProfile((prev) =>
                          prev
                            ? { ...prev, age: parseInt(e.target.value) || 0 }
                            : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight_start">Peso Atual (kg):</Label>
                    <Input
                      id="weight_start"
                      type="number"
                      step="0.1"
                      value={latestWeight ?? profile.weight_start_kg ?? ""}
                      disabled={true}
                      onChange={(e) =>
                        setProfile((prev) =>
                          prev
                            ? {
                                ...prev,
                                weight_start_kg:
                                  parseFloat(e.target.value) || 0,
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm):</Label>
                    <Input
                      id="height"
                      type="number"
                      value={profile.height_cm || ""}
                      onChange={(e) =>
                        setProfile((prev) =>
                          prev
                            ? {
                                ...prev,
                                height_cm: parseInt(e.target.value) || 0,
                              }
                            : null
                        )
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-base font-medium">
                    Objetivo Principal
                  </Label>
                  <RadioGroup
                    value={profile.goal}
                    onValueChange={(value) =>
                      setProfile((prev) =>
                        prev
                          ? { ...prev, goal: value as ProfileData["goal"] }
                          : null
                      )
                    }
                    className="mt-2"
                  >
                    {GOALS.map((goal) => (
                      <div
                        key={goal.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={goal.value} id={goal.value} />
                        <Label htmlFor={goal.value}>{goal.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={() => saveProfile(profile)}
                disabled={profileSaving}
                className="min-w-[120px]"
              >
                {profileSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Dietary Tab */}
          <TabsContent value="dietary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências Alimentares</CardTitle>
                {/* <CardDescription>
                  Select your dietary preferences and list any food dislikes
                </CardDescription> */}
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  {/*<Label className="text-base font-medium">
                    Dietary Preferences
                  </Label>*/}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {DIETARY_PREFERENCES.map((preference) => (
                      <div
                        key={preference.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={preference.value}
                          checked={
                            profile.dietary_preferences?.includes(
                              preference.value
                            ) || false
                          }
                          onCheckedChange={(checked) => {
                            setProfile((prev) => {
                              if (!prev) return null;
                              const current = prev.dietary_preferences || [];
                              const updated = checked
                                ? [...current, preference.value]
                                : current.filter((p) => p !== preference.value);
                              return { ...prev, dietary_preferences: updated };
                            });
                          }}
                        />
                        <Label
                          htmlFor={preference.value}
                          className="text-md capitalize"
                        >
                          {preference.label}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-yellow-500 mt-4 font-bold">
                    Dica: Altere suas preferências alimentares apenas no dia de
                    solicitar novas recomendações de IA.
                  </p>
                </div>

                {/* <div>
                  <Label htmlFor="food_dislikes">Food Dislikes</Label>
                  <Textarea
                    id="food_dislikes"
                    placeholder="List any foods you dislike or want to avoid..."
                    value={profile.food_dislikes || ""}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev ? { ...prev, food_dislikes: e.target.value } : null
                      )
                    }
                    className="mt-2"
                  />
                </div> */}
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button
                onClick={() => saveProfile(profile)}
                disabled={profileSaving}
                className="w-min-[120px]"
              >
                {profileSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nível de Atividade</CardTitle>
                {/* <CardDescription>
                  Select your current activity level to help calculate your
                  calorie needs
                </CardDescription> */}
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  {/*<Label htmlFor="activity_level">Activity Level</Label>*/}
                  <Select
                    value={profile.activity_level}
                    onValueChange={(value) =>
                      setProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              activity_level:
                                value as ProfileData["activity_level"],
                            }
                          : null
                      )
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione seu nível de atividade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ACTIVITY_LEVELS).map(([key, level]) => (
                        <SelectItem key={key} value={key}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {profile.activity_level && (
                  <Card className="bg-green-50 border-green-200">
                    {/* <h4 className="font-semibold text-green-900 mb-2">
                        {ACTIVITY_LEVELS[profile.activity_level].label}
                      </h4> */}

                    <CardContent className="space-y-3">
                      <div>
                        <div className="font-medium text-green-800">
                          Descrição:
                        </div>
                        <div className="text-green-700">
                          {ACTIVITY_LEVELS[profile.activity_level].description}
                        </div>
                      </div>
                      <div>
                        {/* <div className="font-medium text-sky-500">Exemplos:</div> */}
                        <div className="text-green-700">
                          {ACTIVITY_LEVELS[profile.activity_level].examples}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button
                onClick={() => saveProfile(profile)}
                disabled={profileSaving}
                className="w-min-[120px]"
              >
                {profileSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Weight & Progress Tab */}
          <TabsContent value="weight" className="space-y-6">
            {/* Add Weight Form */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Registro de Peso</CardTitle>
                {/* <CardDescription>
                  Registre seu peso atual para hoje
                </CardDescription> */}
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="weight">Peso (kg):</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="date">Data:</Label>
                    <Input
                      disabled={true}
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={addWeight}
                      disabled={
                        isAddingWeight ||
                        !newWeight ||
                        !selectedDate ||
                        hasEntryForDate(selectedDate)
                      }
                      className="w-full sm:w-auto"
                    >
                      {isAddingWeight ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {selectedDate && hasEntryForDate(selectedDate) && (
                  <p className="text-md text-amber-600 mt-2">
                    Você já tem um registro de peso para esta data
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Weight Chart */}
            {weightEntries.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Progresso de Peso</CardTitle>
                      {/* <CardDescription>
                        Track your weight changes over time
                      </CardDescription> */}
                    </div>
                    {/* disponivel somente no desktop */}
                    <div className="hidden md:flex space-x-2">
                      {(["1w", "1m", "3m"] as const).map((period) => (
                        <Button
                          key={period}
                          variant={
                            chartPeriod === period ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setChartPeriod(period)}
                        >
                          {period === "1w"
                            ? "1 Semana"
                            : period === "1m"
                            ? "1 Mês"
                            : "3 Meses"}
                        </Button>
                      ))}
                    </div>
                    {/* disponivel somente no mobile */}
                    <div className="flex md:hidden space-x-2">
                      {(["1w", "1m", "3m"] as const).map((period) => (
                        <Button
                          key={period}
                          variant={
                            chartPeriod === period ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setChartPeriod(period)}
                        >
                          {period === "1w"
                            ? "1sem"
                            : period === "1m"
                            ? "1m"
                            : "3m"}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={prepareChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="displayDate"
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weight Entries List */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Peso</CardTitle>
                {/* <CardDescription>
                  View and manage your weight entries
                </CardDescription> */}
              </CardHeader>
              <CardContent>
                {weightLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Carregando registros de peso...</span>
                  </div>
                ) : weightError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600 mb-4 text-lg">{weightError}</p>
                    <Button onClick={fetchWeights} variant="outline">
                      Tentar Novamente
                    </Button>
                  </div>
                ) : weightEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <Weight className="h-8 w-8  mx-auto mb-2" />
                    <p className="">Nenhum registro de peso ainda</p>
                    <p className="text-md ">
                      Adicione seu primeiro registro de peso acima para começar
                      a rastrear
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {weightEntries
                      .slice()
                      .reverse()
                      .map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-4 w-4 " />
                            <div>
                              <p className="font-medium">
                                {entry.weight_kg} kg
                              </p>
                              <p className="text-md ">
                                {new Date(
                                  entry.measured_at + "T00:00:00"
                                ).toLocaleDateString("pt-BR", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "numeric",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteWeight(entry.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy & Display Tab (inlined) */}
          <TabsContent value="privacy" className="space-y-6">
            <ProfilePrivacyDisplayInline
              initialAlias={profile.user_alias || ""}
              initialAvatar={profile.avatar_url || ""}
              onSaved={(updates) => {
                setProfile((prev) => (prev ? { ...prev, ...updates } : prev));
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}

// Inline implementation of Privacy & Display for profile page (persists to API)
function ProfilePrivacyDisplayInline({
  initialAlias = "",
  initialAvatar = "",
  onSaved,
}: {
  initialAlias?: string;
  initialAvatar?: string;
  onSaved?: (data: { user_alias: string; avatar_url: string }) => void;
}) {
  const [alias, setAlias] = useState(initialAlias);
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aliasValidation, setAliasValidation] = useState<{
    isValid: boolean | null;
    message: string;
  }>({ isValid: null, message: "" });

  const PREDEFINED_AVATARS = [
    { id: "avatar_1.png", path: "/imgs/avatars/avatar_1.png" },
    { id: "avatar_2.png", path: "/imgs/avatars/avatar_2.png" },
    { id: "avatar_3.png", path: "/imgs/avatars/avatar_3.png" },
    { id: "avatar_4.png", path: "/imgs/avatars/avatar_4.png" },
    { id: "avatar_5.png", path: "/imgs/avatars/avatar_5.png" },
    { id: "avatar_6.png", path: "/imgs/avatars/avatar_6.png" },
    { id: "avatar_7.png", path: "/imgs/avatars/avatar_7.png" },
    { id: "avatar_8.png", path: "/imgs/avatars/avatar_8.png" },
  ];

  useEffect(() => {
    const validateAlias = async () => {
      if (!alias || alias.length < 6) {
        setAliasValidation({
          isValid: false,
          message: "Nome de usuário deve ter pelo menos 6 caracteres",
        });
        return;
      }
      if (alias.length > 20) {
        setAliasValidation({
          isValid: false,
          message: "Nome de usuário deve ter no máximo 20 caracteres",
        });
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(alias)) {
        setAliasValidation({
          isValid: false,
          message:
            "Nome de usuário pode conter apenas letras, números e underscores",
        });
        return;
      }
      if (alias === initialAlias) {
        setAliasValidation({
          isValid: true,
          message: "Nome de usuário disponível",
        });
        return;
      }
      setIsValidating(true);
      try {
        const response = await fetch("/api/auth/validate-alias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alias }),
        });
        const data = await response.json();
        setAliasValidation({
          isValid: data.available,
          message: data.available
            ? "Nome de usuário disponível"
            : "Nome de usuário já utilizado",
        });
      } catch (error) {
        console.error("Error validating alias:", error);
        setAliasValidation({
          isValid: false,
          message:
            "Erro ao verificar disponibilidade do nome de usuário, tente novamente",
        });
      } finally {
        setIsValidating(false);
      }
    };
    const timeoutId = setTimeout(validateAlias, 500);
    return () => clearTimeout(timeoutId);
  }, [alias, initialAlias]);

  const handleSave = async () => {
    if (!alias || !selectedAvatar) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    if (aliasValidation.isValid !== true) {
      toast.error(
        "Por favor, corrija os erros de validação do nome de usuário"
      );
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_alias: alias, avatar_url: selectedAvatar }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            "Falha ao salvar configurações de exibição. Tente novamente."
        );
      }
      toast.success("Configurações de exibição salvas com sucesso!");
      onSaved?.({ user_alias: alias, avatar_url: selectedAvatar });
      //refresh after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Falha ao salvar configurações de exibição. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = alias && selectedAvatar && aliasValidation.isValid === true;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exibição Pública</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alias">Nome de usuário</Label>
            <div className="relative">
              <Input
                id="alias"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className={`pr-10 ${
                  aliasValidation.isValid === false
                    ? "border-red-500"
                    : aliasValidation.isValid === true
                    ? "border-green-500"
                    : ""
                }`}
              />
              {isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin " />
                </div>
              )}
            </div>
            {aliasValidation.message && (
              <p
                className={`text-md ${
                  aliasValidation.isValid === true
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {aliasValidation.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selecionar seu avatar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {PREDEFINED_AVATARS.map((avatar) => (
              <div
                key={avatar.id}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedAvatar === avatar.id
                    ? "border-blue-500 ring-2 ring-sky-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedAvatar(avatar.id)}
              >
                <Image
                  src={avatar.path}
                  alt={`Avatar ${avatar.id}`}
                  width={96}
                  height={96}
                  className="object-cover"
                />
                {selectedAvatar === avatar.id && (
                  <div className="absolute opacity-40 inset-0 bg-sky-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!canSave || isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>Salvar</>
          )}
        </Button>
      </div>
    </div>
  );
}
