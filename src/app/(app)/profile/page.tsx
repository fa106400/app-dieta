"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useBadgeNotificationTrigger } from "@/hooks/useBadgeNotification";
import { useExperience } from "@/contexts/ExperienceContext";
import { ExperienceService } from "@/lib/experience-service";
import { supabase } from "@/lib/supabase";
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
import { Badge } from "@/components/ui/badge";
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
      "Pouco ou nenhum exercício e um trabalho que envolve sentar a maior parte do dia.",
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

  // Save profile
  const saveProfile = async (updatedProfile: Partial<ProfileData>) => {
    if (!user) return;

    try {
      setProfileSaving(true);
      setProfileError(null);

      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Falha ao salvar perfil. Tente novamente."
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
                    <Label htmlFor="weight_start">Peso Inicial (kg):</Label>
                    <Input
                      id="weight_start"
                      type="number"
                      step="0.1"
                      value={profile.weight_start_kg || ""}
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
                                  month: "long",
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  className="w-full h-24 object-cover"
                />
                {selectedAvatar === avatar.id && (
                  <div className="absolute opacity-70 inset-0 bg-sky-500 flex items-center justify-center">
                    <Check className="h-6 w-6 text-sky-500" />
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
