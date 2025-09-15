"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  User,
  Settings,
  Activity,
  Weight,
  //TrendingUp,
  RefreshCw,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
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
import { toast } from "sonner";

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
    label: "Sedentary",
    description:
      "Little to no exercise and a job that involves sitting most of the day.",
    examples: "Office worker, student, retired person",
  },
  lightly_active: {
    label: "Lightly Active",
    description: "Light exercise or sports 1-3 days per week.",
    examples: "Walking, light jogging, yoga, casual cycling",
  },
  moderately_active: {
    label: "Moderately Active",
    description: "Moderate exercise or sports 3-5 days per week.",
    examples: "Running, swimming, weight training, team sports",
  },
  very_active: {
    label: "Very Active",
    description: "Hard exercise or sports 6-7 days per week.",
    examples: "Intensive training, competitive sports, manual labor",
  },
  extra_active: {
    label: "Extra Active",
    description: "Very hard exercise, physical job, or training twice a day.",
    examples: "Professional athlete, construction worker, military training",
  },
};

const DIETARY_PREFERENCES = [
  "vegetarian",
  "vegan",
  "gluten_free",
  "dairy_free",
  "keto",
  "paleo",
  "mediterranean",
  "low_carb",
  "low_fat",
  "high_protein",
];

const GOALS = [
  { value: "lose_weight", label: "Lose Weight" },
  { value: "maintain", label: "Maintain Weight" },
  { value: "gain_muscle", label: "Gain Muscle" },
  { value: "health", label: "General Health" },
];

export default function ProfileManagePage() {
  const { user } = useAuthContext();

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
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data.profile);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setProfileError("Failed to load profile data");
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
      setWeightError("Failed to load weight data");
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
        throw new Error(errorData.error || "Failed to save profile");
      }

      await fetchProfile(); // Refresh profile data
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save profile";
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
      toast.error("Weight must be between 30 and 300 kg");
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
          toast.error("You already have a weight entry for this date");
          return;
        }
        throw error;
      }

      setNewWeight("");
      setSelectedDate("");
      await fetchWeights();
      toast.success("Weight entry added successfully!");
    } catch (err) {
      console.error("Error adding weight:", err);
      toast.error("Failed to add weight entry");
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
      toast.success("Weight entry deleted successfully!");
    } catch (err) {
      console.error("Error deleting weight:", err);
      toast.error("Failed to delete weight entry");
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
        throw new Error(errorData.error || "Failed to refresh recommendations");
      }

      toast.success("AI recommendations refreshed successfully!");
      await fetchAiCooldown();
    } catch (err) {
      console.error("Error refreshing AI:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to refresh recommendations";
      toast.error(errorMessage);
    } finally {
      setIsRefreshingAI(false);
    }
  };

  // Format cooldown display
  const formatCooldown = (hours: number): string => {
    if (hours < 1) return "Available now";
    if (hours < 24) return `${Math.ceil(hours)}h remaining`;
    return `${Math.ceil(hours / 24)}d remaining`;
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Error Loading Profile
            </h2>
            <p className="text-gray-600 mb-4">{profileError}</p>
            <Button onClick={fetchProfile} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Profile Found</h2>
            <p className="text-gray-600">
              Please complete your profile setup first.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <p className="text-gray-600 mb-4 lg:mb-0">
              Manage your personal information and track your progress
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
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span>Refresh AI Recommendations</span>
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                {aiCooldownHours && aiCooldownHours > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    {formatCooldown(aiCooldownHours)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="personal"
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger
              value="dietary"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Dietary</span>
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="flex items-center space-x-2"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex items-center space-x-2">
              <Weight className="h-4 w-4" />
              <span className="hidden sm:inline">Weight & Progress</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update your personal details and primary goal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age:</Label>
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
                    <Label htmlFor="weight_start">Starting Weight (kg):</Label>
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
                    <Label htmlFor="height">Height (cm):</Label>
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
                  <Label className="text-base font-medium">Primary Goal</Label>
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

                <Button
                  onClick={() => saveProfile(profile)}
                  disabled={profileSaving}
                  className="w-full"
                >
                  {profileSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dietary Tab */}
          <TabsContent value="dietary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dietary Preferences</CardTitle>
                <CardDescription>
                  Select your dietary preferences and list any food dislikes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  {/*<Label className="text-base font-medium">
                    Dietary Preferences
                  </Label>*/}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {DIETARY_PREFERENCES.map((preference) => (
                      <div
                        key={preference}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={preference}
                          checked={
                            profile.dietary_preferences?.includes(preference) ||
                            false
                          }
                          onCheckedChange={(checked) => {
                            setProfile((prev) => {
                              if (!prev) return null;
                              const current = prev.dietary_preferences || [];
                              const updated = checked
                                ? [...current, preference]
                                : current.filter((p) => p !== preference);
                              return { ...prev, dietary_preferences: updated };
                            });
                          }}
                        />
                        <Label
                          htmlFor={preference}
                          className="text-sm capitalize"
                        >
                          {preference.replace("_", " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
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
                </div>

                <Button
                  onClick={() => saveProfile(profile)}
                  disabled={profileSaving}
                  className="w-full"
                >
                  {profileSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Level</CardTitle>
                <CardDescription>
                  Select your current activity level to help calculate your
                  calorie needs
                </CardDescription>
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
                      <SelectValue placeholder="Select your activity level" />
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
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        {ACTIVITY_LEVELS[profile.activity_level].label}
                      </h4>
                      <p className="text-blue-800 text-sm mb-2">
                        {ACTIVITY_LEVELS[profile.activity_level].description}
                      </p>
                      <p className="text-blue-700 text-xs">
                        Examples:{" "}
                        {ACTIVITY_LEVELS[profile.activity_level].examples}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Button
                  onClick={() => saveProfile(profile)}
                  disabled={profileSaving}
                  className="w-full"
                >
                  {profileSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weight & Progress Tab */}
          <TabsContent value="weight" className="space-y-6">
            {/* Add Weight Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Weight Entry</CardTitle>
                <CardDescription>
                  Record your current weight for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="weight">Weight (kg):</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="Enter your weight"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="date">Date:</Label>
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
                  <p className="text-sm text-amber-600 mt-2">
                    You already have a weight entry for this date
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
                      <CardTitle>Weight Progress</CardTitle>
                      <CardDescription>
                        Track your weight changes over time
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
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
                            ? "1 Week"
                            : period === "1m"
                            ? "1 Month"
                            : "3 Months"}
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
                <CardTitle>Weight History</CardTitle>
                <CardDescription>
                  View and manage your weight entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {weightLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading weight entries...</span>
                  </div>
                ) : weightError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600 mb-4">{weightError}</p>
                    <Button onClick={fetchWeights} variant="outline">
                      Try Again
                    </Button>
                  </div>
                ) : weightEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <Weight className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No weight entries yet</p>
                    <p className="text-sm text-gray-500">
                      Add your first weight entry above to start tracking
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
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="font-medium">
                                {entry.weight_kg} kg
                              </p>
                              <p className="text-sm text-gray-600">
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
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
