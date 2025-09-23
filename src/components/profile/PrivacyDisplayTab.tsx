"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { /*ArrowLeft,*/ Check, Loader2, AlertCircle, Save } from "lucide-react";
import { toast } from "react-toastify";

interface PrivacyDisplayTabProps {
  onBack?: () => void;
  isOnboarding?: boolean;
  initialAlias?: string;
  initialAvatar?: string;
  onSave?: (data: { user_alias: string; avatar_url: string }) => void;
}

const PREDEFINED_AVATARS = [
  { id: "avatar_1.png", path: "/imgs/avatars/avatar_1.png" },
  { id: "avatar_2.png", path: "/imgs/avatars/avatar_2.png" },
  { id: "avatar_3.png", path: "/imgs/avatars/avatar_3.png" },
  { id: "avatar_4.png", path: "/imgs/avatars/avatar_4.png" },
];

export function PrivacyDisplayTab({
  // onBack,
  isOnboarding: _isOnboarding = false,
  initialAlias = "",
  initialAvatar = "",
  onSave,
}: PrivacyDisplayTabProps) {
  const [alias, setAlias] = useState(initialAlias);
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aliasValidation, setAliasValidation] = useState<{
    isValid: boolean | null;
    message: string;
  }>({ isValid: null, message: "" });

  // Validate alias in real-time
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

      // Check for invalid characters (only alphanumeric and underscore)
      if (!/^[a-zA-Z0-9_]+$/.test(alias)) {
        setAliasValidation({
          isValid: false,
          message:
            "Nome de usuário pode conter apenas letras, números e underscores",
        });
        return;
      }

      // If it's the same as initial alias, it's valid
      if (alias === initialAlias) {
        setAliasValidation({
          isValid: true,
          message: "Nome de usuário disponível",
        });
        return;
      }

      // Check uniqueness
      setIsValidating(true);
      try {
        const response = await fetch("/api/auth/validate-alias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

    const timeoutId = setTimeout(validateAlias, 500); // Debounce validation
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
      if (onSave) {
        // For onboarding flow
        onSave({ user_alias: alias, avatar_url: selectedAvatar });
      } else {
        // For profile page
        const response = await fetch("/api/auth/me", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_alias: alias,
            avatar_url: selectedAvatar,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              "Falha ao salvar configurações de privacidade. Tente novamente."
          );
        }

        toast.success("Configurações de privacidade salvas com sucesso!");
      }
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Falha ao salvar configurações de privacidade. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = alias && selectedAvatar && aliasValidation.isValid === true;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        {/* {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        )} */}
        <div hidden={!_isOnboarding}>
          <h3 className="text-lg font-semibold mb-4">Privacidade & Exibição</h3>
          {/* <p className="text-gray-600">
            Configure como você aparece para outros usuários
          </p> */}
        </div>
      </div>

      {/* Public Alias Section */}
      <Card>
        <CardHeader>
          <CardTitle>Nome de usuário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {/* <Label htmlFor="alias">Escolha um nome de usuário</Label> */}
            <div className="relative">
              <Input
                id="alias"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                // placeholder="Digite seu nome de usuário"
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
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
              {!isValidating && aliasValidation.isValid === true && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              )}
              {!isValidating && aliasValidation.isValid === false && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
              )}
            </div>
            {aliasValidation.message && (
              <p
                className={`text-sm ${
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

      {/* Avatar Selection Section */}
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
                    ? "border-blue-500 ring-2 ring-blue-200"
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
                  <div className="absolute opacity-70 inset-0 bg-blue-500 flex items-center justify-center">
                    <Check className="h-6 w-6 text-blue-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button - esconde se for onboarding */}
      <div className="flex justify-end" hidden={_isOnboarding}>
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
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
