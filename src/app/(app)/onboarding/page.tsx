"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBadgeNotificationTrigger } from "@/hooks/useBadgeNotification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface OnboardingData {
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

function OnboardingPageContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OnboardingData>({
    age: 0,
    weight_start_kg: 0,
    height_cm: 0,
    goal: "maintain",
    dietary_preferences: [],
    activity_level: "moderately_active",
    food_dislikes: "",
  });

  const { user } = useAuthContext();
  // const router = useRouter();
  const { triggerBadgeValidation } = useBadgeNotificationTrigger();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof OnboardingData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDietaryPreferenceChange = (
    preference: string,
    checked: boolean
  ) => {
    if (checked) {
      updateFormData("dietary_preferences", [
        ...formData.dietary_preferences,
        preference,
      ]);
    } else {
      updateFormData(
        "dietary_preferences",
        formData.dietary_preferences.filter((p) => p !== preference)
      );
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    console.log("🔍 Onboarding - Starting form submission");
    console.log("🔍 Onboarding - User state:", {
      user: user ? "Present" : "Missing",
      userMetadata: user?.user_metadata,
      email: user?.email,
    });
    console.log("🔍 Onboarding - Form data:", formData);

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔍 Onboarding - Making API request to /api/auth/me");
      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user?.user_metadata?.name || user?.email?.split("@")[0],
          ...formData,
          onboarding_completed: true,
        }),
      });

      console.log("🔍 Onboarding - API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("🔍 Onboarding - API error response:", errorData);
        throw new Error(
          `Failed to save profile: ${response.status} ${response.statusText}`
        );
      }

      console.log(
        "🔍 Onboarding - Profile saved successfully, onboarding_completed set to true"
      );

      // Insert initial weight entry
      try {
        console.log("🔍 Onboarding - Inserting initial weight entry...");
        const weightResponse = await fetch("/api/me/weight", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            weight: formData.weight_start_kg,
            date: new Date().toISOString().split("T")[0],
          }),
        });

        if (weightResponse.ok) {
          console.log(
            "🔍 Onboarding - Initial weight entry saved successfully"
          );
        } else {
          console.warn(
            "🔍 Onboarding - Failed to save initial weight entry, but continuing..."
          );
        }
      } catch (weightError) {
        console.warn(
          "🔍 Onboarding - Error saving initial weight:",
          weightError
        );
        // Don't fail the onboarding process if weight entry fails
      }

      // Generate initial AI recommendations
      try {
        console.log("🔍 Onboarding - Generating initial AI recommendations...");
        console.log(
          "🔍 Onboarding - Making request to:",
          "/api/ai/onboarding-recommendations"
        );

        const recommendationsResponse = await fetch(
          "/api/ai/onboarding-recommendations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(
          "🔍 Onboarding - Response status:",
          recommendationsResponse.status
        );
        console.log(
          "🔍 Onboarding - Response URL:",
          recommendationsResponse.url
        );

        if (recommendationsResponse.ok) {
          const recommendationsData = await recommendationsResponse.json();
          console.log(
            "🔍 Onboarding - Generated",
            recommendationsData.recommendations?.length || 0,
            "AI recommendations"
          );
        } else {
          console.warn(
            "🔍 Onboarding - Failed to generate AI recommendations, but continuing..."
          );
        }
      } catch (recommendationError) {
        console.warn(
          "🔍 Onboarding - Error generating recommendations:",
          recommendationError
        );
        // Don't fail the onboarding process if recommendations fail
      }

      // Trigger badge validation for onboarding completed
      try {
        await triggerBadgeValidation(
          "onboarding_completed",
          {}, //no payload
          {
            type: "redirect",
            payload: "/home",
          }
        );
      } catch (err) {
        console.error("Error triggering badge validation:", err);
        // Don't fail the main operation if badge validation fails
      }
    } catch (err) {
      console.error("🔍 Onboarding - Error during submission:", err);
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.age > 0 &&
          formData.weight_start_kg > 0 &&
          formData.height_cm > 0
        );
      case 2:
        return formData.goal !== undefined;
      case 3:
        return formData.activity_level !== undefined;
      case 4:
        return true; // Food dislikes is optional
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <p className="text-gray-600 mb-6">
          Let&apos;s start with some basic details about you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            min="13"
            max="120"
            value={formData.age || ""}
            onChange={(e) =>
              updateFormData("age", parseInt(e.target.value) || 0)
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
            value={formData.weight_start_kg || ""}
            onChange={(e) =>
              updateFormData("weight_start_kg", parseFloat(e.target.value) || 0)
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
            value={formData.height_cm || ""}
            onChange={(e) =>
              updateFormData("height_cm", parseInt(e.target.value) || 0)
            }
            placeholder="Enter your height"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Goal</h3>
        <p className="text-gray-600 mb-6">
          What&apos;s your primary objective?
        </p>
      </div>

      <RadioGroup
        value={formData.goal}
        onValueChange={(value) =>
          updateFormData("goal", value as OnboardingData["goal"])
        }
        className="space-y-4"
      >
        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="lose_weight" id="lose_weight" />
          <Label htmlFor="lose_weight" className="flex-1 cursor-pointer">
            <div className="font-medium">Lose Weight</div>
            <div className="text-sm text-gray-500">
              Reduce body weight and improve body composition
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="maintain" id="maintain" />
          <Label htmlFor="maintain" className="flex-1 cursor-pointer">
            <div className="font-medium">Maintain Weight</div>
            <div className="text-sm text-gray-500">
              Keep current weight while improving health
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="gain_muscle" id="gain_muscle" />
          <Label htmlFor="gain_muscle" className="flex-1 cursor-pointer">
            <div className="font-medium">Gain Muscle</div>
            <div className="text-sm text-gray-500">
              Build muscle mass and strength
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
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
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Activity Level</h3>
        <p className="text-gray-600 mb-6">
          How active are you on a typical week?
        </p>
      </div>

      <Select
        value={formData.activity_level}
        onValueChange={(value) =>
          updateFormData(
            "activity_level",
            value as OnboardingData["activity_level"]
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

      {formData.activity_level && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-900 text-lg">
              {ACTIVITY_LEVELS[formData.activity_level].label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="font-medium text-blue-800">Description:</div>
              <div className="text-blue-700">
                {ACTIVITY_LEVELS[formData.activity_level].description}
              </div>
            </div>
            <div>
              <div className="font-medium text-blue-800">Examples:</div>
              <div className="text-blue-700">
                {ACTIVITY_LEVELS[formData.activity_level].examples}
              </div>
            </div>
            <div>
              <div className="font-medium text-blue-800">
                Calorie Multiplier:
              </div>
              <div className="text-blue-700 font-mono">
                {ACTIVITY_LEVELS[formData.activity_level].multiplier}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Dietary Preferences & Restrictions
        </h3>
        <p className="text-gray-600 mb-6">
          Help us customize your diet recommendations.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">
            Dietary Preferences (Optional)
          </Label>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {DIETARY_PREFERENCES.map((preference) => (
              <div key={preference} className="flex items-center space-x-2">
                <Checkbox
                  id={preference}
                  checked={formData.dietary_preferences.includes(preference)}
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
          <Label htmlFor="food_dislikes">Food Dislikes (Optional)</Label>
          <Textarea
            id="food_dislikes"
            placeholder="List any foods you dislike or can't eat..."
            value={formData.food_dislikes}
            onChange={(e) => updateFormData("food_dislikes", e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Let&apos;s personalize your diet plan!
          </h1>
          <p className="text-lg text-gray-600">
            Answer a few questions so we can recommend the best diet options for
            you.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            {renderCurrentStep()}

            {error && (
              <div className="mt-6 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center space-x-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isLoading}
                  className="flex items-center space-x-2"
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save and Continue
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return <OnboardingPageContent />;
}
