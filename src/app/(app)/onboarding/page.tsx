"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBadgeNotificationTrigger } from "@/hooks/useBadgeNotification";
import { useExperience } from "@/contexts/ExperienceContext";
import { ExperienceService } from "@/lib/experience-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent /*CardHeader, CardTitle */,
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
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

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
  //food_dislikes: string; //nao vou mais usar dado que tem swap na diet details
  user_alias: string;
  avatar_url: string;
}

const ACTIVITY_LEVELS = {
  sedentary: {
    label: "Sedentário",
    description:
      "Pouco ou nenhum exercício e um trabalho que envolve ficar sentado na maior parte do dia.",
    examples:
      "Trabalho de escritório, recepcionistas, motoristas ou indivíduos que passam a maior parte do dia em frente ao computador com pouco movimento",
    multiplier: "BMR × 1.375",
  },
  lightly_active: {
    label: "Levemente Ativo",
    description: "Pouco exercício ou esportes 1-3 vezes por semana.",
    examples:
      "Um trabalho sedentário com pouco exercício, como uma caminhada curta ou um treino leve algumas vezes por semana.",
    multiplier: "BMR × 1.375",
  },
  moderately_active: {
    label: "Moderadamente Ativo",
    description: "Exercício moderado ou esportes 3-5 vezes por semana.",
    examples:
      "Alguém com um trabalho que envolve ficar de pé por uma parte significativa do dia, junto com um exercício moderado algumas vezes por semana.",
    multiplier: "BMR × 1.55",
  },
  very_active: {
    label: "Muito Ativo",
    description: "Exercício intenso ou esportes 6-7 vezes por semana.",
    examples: "Treinos intensos na maioria dos dias da semana.",
    multiplier: "BMR × 1.725",
  },
  extra_active: {
    label: "Super Ativo",
    description:
      "Exercício intenso mais treino, um trabalho físico demandante ou treino duas vezes por dia.",
    examples:
      "Profissões com trabalhos físicos demandantes combinados com exercício intenso frequentemente.",
    multiplier: "BMR × 1.9",
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
    //food_dislikes: "", //nao vou mais usar dado que tem swap na diet details
    user_alias: "",
    avatar_url: "",
  });

  const { user } = useAuthContext();
  // const router = useRouter();
  const { triggerBatchBadgeValidation } = useBadgeNotificationTrigger();
  const { refreshXP } = useExperience();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof OnboardingData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Step 5: Privacy & Display (alias + avatar)
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
  const [isValidatingAlias, setIsValidatingAlias] = useState(false);
  const [aliasValidation, setAliasValidation] = useState<{
    isValid: boolean | null;
    message: string;
  }>({ isValid: null, message: "" });

  // Validate alias in real-time (debounced)
  useEffect(() => {
    const validateAlias = async () => {
      const alias = formData.user_alias || "";
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
      setIsValidatingAlias(true);
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
      } catch (_error) {
        console.error("Error validating alias:", _error);
        setAliasValidation({
          isValid: false,
          message:
            "Erro ao verificar disponibilidade do nome de usuário, tente novamente",
        });
      } finally {
        setIsValidatingAlias(false);
      }
    };
    const timeoutId = setTimeout(validateAlias, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.user_alias]);

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
    setIsLoading(true);
    setError(null);

    try {
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

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API error response:", errorData);
        throw new Error(
          `Falha ao salvar perfil: ${response.status} ${response.statusText}`
        );
      }

      // Initialize user metrics with XP
      try {
        if (user?.id) {
          await ExperienceService.initializeUserMetrics(user.id, 100);
          // Refresh XP in the global context
          await refreshXP();
        }
      } catch (xpError) {
        console.error("Error initializing XP:", xpError);
        // Don't fail the onboarding process if XP initialization fails
      }

      // Insert initial weight entry
      try {
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

        if (!weightResponse.ok) {
          console.error(
            "Failed to save initial weight entry, but continuing..."
          );
        }
      } catch (weightError) {
        console.error("Onboarding - Error saving initial weight:", weightError);
        // Don't fail the onboarding process if weight entry fails
      }

      // Generate initial AI recommendations
      try {
        await fetch("/api/ai/onboarding-recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (recommendationError) {
        console.error(
          "Onboarding - Error generating recommendations:",
          recommendationError
        );
        // Don't fail the onboarding process if recommendations fail
      }

      // Batch multiple badge events with single deferred action
      try {
        await triggerBatchBadgeValidation(
          [
            { event: "onboarding_completed", payload: {} }, //no payload
            { event: "experience", payload: { points: 100 } },
          ],
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
      console.error("Onboarding - Error during submission:", err);
      setError(err instanceof Error ? err.message : "Falha ao salvar perfil");
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
      case 5:
        return Boolean(formData.avatar_url) && aliasValidation.isValid === true; // Require picked avatar and a valid alias
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Informações básicas</h3>
        {/* <p className=" mb-6">
          Vamos começar com algumas informações básicas sobre você.
        </p> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Idade *</Label>
          <Input
            id="age"
            type="number"
            min="10"
            max="99"
            value={formData.age || ""}
            onChange={(e) =>
              updateFormData("age", parseInt(e.target.value) || 0)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg) *</Label>
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
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Altura (cm) *</Label>
          <Input
            id="height"
            type="number"
            min="100"
            max="250"
            value={formData.height_cm || ""}
            onChange={(e) =>
              updateFormData("height_cm", parseInt(e.target.value) || 0)
            }
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Qual é o seu objetivo?</h3>
        {/* <p className=" mb-6">
          Qual é o seu objetivo?
        </p> */}
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
            <div className="font-medium">Perder peso</div>
            <div className="hidden lg:block text-md ">
              Reduzir o peso e melhorar a composição corporal
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="maintain" id="maintain" />
          <Label htmlFor="maintain" className="flex-1 cursor-pointer">
            <div className="font-medium">Manter peso</div>
            <div className="hidden lg:block text-md ">
              Manter o peso atual enquanto melhora a saúde
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="gain_muscle" id="gain_muscle" />
          <Label htmlFor="gain_muscle" className="flex-1 cursor-pointer">
            <div className="font-medium">Ganhar massa</div>
            <div className="hidden lg:block text-md ">
              Construir massa muscular e força
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="health" id="health" />
          <Label htmlFor="health" className="flex-1 cursor-pointer">
            <div className="font-medium">Melhorar saúde</div>
            <div className="hidden lg:block text-md ">
              Foco na saúde e bem-estar geral
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Nível de atividade</h3>
        {/* <p className=" mb-6">
          Quão ativo você é em uma semana típica?
        </p> */}
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
        <Card className="bg-green-50 border-green-200">
          {/* <CardHeader className="pb-3">
            <CardTitle className="text-sky-500 text-lg">
              {ACTIVITY_LEVELS[formData.activity_level].label}
            </CardTitle>
          </CardHeader> */}
          <CardContent className="space-y-3">
            <div>
              <div className="font-medium text-green-800">Descrição:</div>
              <div className="text-green-700">
                {ACTIVITY_LEVELS[formData.activity_level].description}
              </div>
            </div>
            <div>
              {/* <div className="font-medium text-sky-500">Exemplos:</div> */}
              <div className="text-green-700">
                {ACTIVITY_LEVELS[formData.activity_level].examples}
              </div>
            </div>
            {/* <div>
              <div className="font-medium text-sky-500">
                Multiplicador de calorias:
              </div>
              <div className="text-sky-500 font-mono">
                {ACTIVITY_LEVELS[formData.activity_level].multiplier}
              </div>
            </div> */}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Preferências e restrições alimentares
        </h3>
        {/* <p className=" mb-6">
          Help us customize your diet recommendations.
        </p> */}
      </div>

      <div className="space-y-4">
        <div>
          {/* <Label className="text-base font-medium">
            Preferências e restrições alimentares (Opcional)
          </Label> */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            {DIETARY_PREFERENCES.map((preference) => (
              <div
                key={preference.value}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={preference.value}
                  checked={formData.dietary_preferences.includes(
                    preference.value
                  )}
                  onCheckedChange={(checked) =>
                    handleDietaryPreferenceChange(
                      preference.value,
                      checked as boolean
                    )
                  }
                />
                <Label
                  htmlFor={preference.value}
                  className="text-md capitalize cursor-pointer"
                >
                  {preference.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="food_dislikes">Food Dislikes (Optional)</Label>
          <Textarea
            id="food_dislikes"
            placeholder="List any foods you dislike or can't eat..."
            value={formData.food_dislikes}
            onChange={(e) => updateFormData("food_dislikes", e.target.value)}
            rows={3}
          />
        </div> */}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-3">
      {/* Alias */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="alias"
                value={formData.user_alias}
                onChange={(e) => updateFormData("user_alias", e.target.value)}
                className={`pr-10 ${
                  aliasValidation.isValid === false
                    ? "border-red-500"
                    : aliasValidation.isValid === true
                    ? "border-green-500"
                    : ""
                }`}
              />
              {isValidatingAlias && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin " />
                </div>
              )}
              {!isValidatingAlias && aliasValidation.isValid === true && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              )}
              {!isValidatingAlias && aliasValidation.isValid === false && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
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

      {/* Avatar picker */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {PREDEFINED_AVATARS.map((avatar) => (
              <div
                key={avatar.id}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  formData.avatar_url === avatar.id
                    ? "border-blue-500 ring-2 ring-sky-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => updateFormData("avatar_url", avatar.id)}
              >
                <Image
                  src={avatar.path}
                  alt={`Avatar ${avatar.id}`}
                  width={96}
                  height={96}
                  className="object-cover"
                />
                {formData.avatar_url === avatar.id && (
                  <div className="absolute opacity-40 inset-0 bg-sky-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold  mb-2">Bem vindo!</h1>
          <p className="text-xl ">Conte nos um pouco sobre você.</p>
        </div>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-md font-medium ">
              Passo {currentStep} de {totalSteps}
            </span>
            <span className="text-md ">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        {/* Form Card */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-4">
            {renderCurrentStep()}

            {error && (
              <div className="mt-6 p-3 text-md text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Anterior
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center space-x-2"
                >
                  Próximo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isLoading}
                  className="flex items-center space-x-2"
                >
                  {isLoading ? (
                    "Salvando..."
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Salvar
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
