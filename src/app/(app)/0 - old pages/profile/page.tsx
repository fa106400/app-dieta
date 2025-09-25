"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
import { Save, User, Settings, Activity } from "lucide-react";

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

const ACTIVITY_LEVELS = {
  sedentary: {
    label: "Sedentary",
    description:
      "Little to no exercise and a job that involves sitting most of the day.",
    examples:
      "Office workers, receptionists, drivers, or individuals who spend most of their day in front of a computer with minimal movement",
    multiplier: "BMR × 1.375",
  },
  lightly_active: {
    label: "Lightly Active",
    description: "Light exercise or sports 1-3 days per week.",
    examples:
      "A sedentary job with light exercise, such as a short walk or a light workout a few times a week.",
    multiplier: "BMR × 1.375",
  },
  moderately_active: {
    label: "Moderately Active",
    description: "Moderate exercise or sports 3-5 days per week.",
    examples:
      "Someone with a job that involves standing for a significant portion of the day, like a sales assistant, along with moderate exercise a few times a week.",
    multiplier: "BMR × 1.55",
  },
  very_active: {
    label: "Very Active",
    description: "Hard exercise or sports 6-7 days per week.",
    examples: "Engaging in intense workouts for most days of the week.",
    multiplier: "BMR × 1.725",
  },
  extra_active: {
    label: "Extra Active",
    description:
      "Very intense exercise and training, a physically demanding job, or training twice a day.",
    examples:
      "Professions such as carpenters, paramedics, or individuals with physically demanding jobs combined with frequent, intense exercise.",
    multiplier: "BMR × 1.9",
  },
};

const DIETARY_PREFERENCES = [
  "vegan",
  "vegetarian",
  "lactose_intolerant",
  "gluten_free",
  "low_carb",
  "keto",
  "paleo",
  "mediterranean",
];

function ProfilePageContent() {
  const [profileData, setProfileData] = useState<ProfileData>({
    age: 0,
    weight_start_kg: 0,
    height_cm: 0,
    goal: "maintain",
    dietary_preferences: [],
    activity_level: "moderately_active",
    food_dislikes: "",
    onboarding_completed: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { user } = useAuthContext();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfileData({
            age: data.profile.age || 0,
            weight_start_kg: data.profile.weight_start_kg || 0,
            height_cm: data.profile.height_cm || 0,
            goal: data.profile.goal || "maintain",
            dietary_preferences: data.profile.dietary_preferences || [],
            activity_level: data.profile.activity_level || "moderately_active",
            food_dislikes: data.profile.food_dislikes || "",
            onboarding_completed: data.profile.onboarding_completed || false,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileData = (field: keyof ProfileData, value: unknown) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDietaryPreferenceChange = (
    preference: string,
    checked: boolean
  ) => {
    if (checked) {
      updateProfileData("dietary_preferences", [
        ...profileData.dietary_preferences,
        preference,
      ]);
    } else {
      updateProfileData(
        "dietary_preferences",
        profileData.dietary_preferences.filter((p) => p !== preference)
      );
    }
  };

  const handleSave = async () => {
    console.debug("🔍 Profile - Starting profile update");
    console.debug("🔍 Profile - User state:", {
      user: user ? "Present" : "Missing",
      userMetadata: user?.user_metadata,
      email: user?.email,
    });
    console.debug("🔍 Profile - Profile data to update:", profileData);

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      console.debug("🔍 Profile - Making API request to /api/auth/me");
      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user?.user_metadata?.name || user?.email?.split("@")[0],
          ...profileData,
        }),
      });

      console.debug("🔍 Profile - API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("🔍 Profile - API error response:", errorData);
        throw new Error(
          `Failed to update profile: ${response.status} ${response.statusText}`
        );
      }

      console.debug("🔍 Profile - Profile updated successfully");
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("🔍 Profile - Error during update:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile & Preferences
          </h1>
          <p className="text-lg text-gray-600">
            Manage your personal information and dietary preferences
          </p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="personal"
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Personal</span>
            </TabsTrigger>
            <TabsTrigger
              value="dietary"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Dietary</span>
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="flex items-center space-x-2"
            >
              <Activity className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update your personal details and measurements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="13"
                      max="120"
                      value={profileData.age || ""}
                      onChange={(e) =>
                        updateProfileData("age", parseInt(e.target.value) || 0)
                      }
                      placeholder="Enter your age"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      min="30"
                      max="300"
                      step="0.1"
                      value={profileData.weight_start_kg || ""}
                      onChange={(e) =>
                        updateProfileData(
                          "weight_start_kg",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="Enter your weight"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm) *</Label>
                    <Input
                      id="height"
                      type="number"
                      min="100"
                      max="250"
                      value={profileData.height_cm || ""}
                      onChange={(e) =>
                        updateProfileData(
                          "height_cm",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="Enter your height"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    Primary Goal *
                  </Label>
                  <RadioGroup
                    value={profileData.goal}
                    onValueChange={(value) =>
                      updateProfileData("goal", value as ProfileData["goal"])
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="lose_weight" id="lose_weight" />
                      <Label
                        htmlFor="lose_weight"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">Lose Weight</div>
                        <div className="text-sm text-gray-500">
                          Reduce body weight and improve body composition
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="maintain" id="maintain" />
                      <Label
                        htmlFor="maintain"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">Maintain Weight</div>
                        <div className="text-sm text-gray-500">
                          Keep current weight while improving health
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="gain_muscle" id="gain_muscle" />
                      <Label
                        htmlFor="gain_muscle"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">Gain Muscle</div>
                        <div className="text-sm text-gray-500">
                          Build muscle mass and strength
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="health" id="health" />
                      <Label htmlFor="health" className="flex-1 cursor-pointer">
                        <div className="font-medium">Improve Health</div>
                        <div className="text-sm text-gray-500">
                          Focus on overall health and wellness
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dietary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dietary Preferences & Restrictions</CardTitle>
                <CardDescription>
                  Customize your diet recommendations based on your preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    Dietary Preferences (Optional)
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {DIETARY_PREFERENCES.map((preference) => (
                      <div
                        key={preference}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={preference}
                          checked={profileData.dietary_preferences.includes(
                            preference
                          )}
                          onCheckedChange={(checked) =>
                            handleDietaryPreferenceChange(
                              preference,
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor={preference}
                          className="text-sm capitalize cursor-pointer"
                        >
                          {preference.replace("_", " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="food_dislikes">
                    Food Dislikes (Optional)
                  </Label>
                  <Textarea
                    id="food_dislikes"
                    placeholder="List any foods you dislike or can't eat..."
                    value={profileData.food_dislikes}
                    onChange={(e) =>
                      updateProfileData("food_dislikes", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Level</CardTitle>
                <CardDescription>
                  Tell us about your daily activity and exercise routine
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    How active are you? *
                  </Label>

                  <Select
                    value={profileData.activity_level}
                    onValueChange={(value) =>
                      updateProfileData(
                        "activity_level",
                        value as ProfileData["activity_level"]
                      )
                    }
                  >
                    <SelectTrigger>
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

                  {profileData.activity_level && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-blue-900 text-lg">
                          {ACTIVITY_LEVELS[profileData.activity_level].label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="font-medium text-blue-800">
                            Description:
                          </div>
                          <div className="text-blue-700">
                            {
                              ACTIVITY_LEVELS[profileData.activity_level]
                                .description
                            }
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-blue-800">
                            Examples:
                          </div>
                          <div className="text-blue-700">
                            {
                              ACTIVITY_LEVELS[profileData.activity_level]
                                .examples
                            }
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-blue-800">
                            Calorie Multiplier:
                          </div>
                          <div className="text-blue-700 font-mono">
                            {
                              ACTIVITY_LEVELS[profileData.activity_level]
                                .multiplier
                            }
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-6 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md text-center">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
