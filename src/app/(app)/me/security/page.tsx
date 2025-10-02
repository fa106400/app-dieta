"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent /*CardHeader, CardTitle*/,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

interface PasswordValidation {
  isValid: boolean;
  message: string;
}

export default function SecurityPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user: _user } = useAuthContext();
  const [formData, setFormData] = useState<PasswordFormData>({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    new: true, //TO-DO: change to false
    confirm: true,
  });

  // Password validation
  const validatePassword = (password: string): PasswordValidation => {
    if (password.length < 8) {
      return {
        isValid: false,
        message: "Senha deve ter pelo menos 8 caracteres",
      };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return {
        isValid: false,
        message: "Senha deve conter pelo menos uma letra minúscula",
      };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return {
        isValid: false,
        message: "Senha deve conter pelo menos uma letra maiúscula",
      };
    }
    if (!/(?=.*\d)/.test(password)) {
      return {
        isValid: false,
        message: "Senha deve conter pelo menos um número",
      };
    }
    return {
      isValid: true,
      message: "Senha válida",
    };
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.newPassword) {
      errors.push("Nova senha é obrigatória");
    }
    if (!formData.confirmPassword) {
      errors.push("Confirmação de senha é obrigatória");
    }

    // Validate new password strength
    if (formData.newPassword) {
      const passwordValidation = validatePassword(formData.newPassword);
      if (!passwordValidation.isValid) {
        errors.push(passwordValidation.message);
      }
    }

    // Check if passwords match
    if (formData.newPassword && formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        errors.push("Nova senha e confirmação não coincidem");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleInputChange = (field: keyof PasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    const validation = validateForm();

    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if supabase is available
      if (!supabase) {
        toast.error("Erro ao conectar ao banco de dados. Tente novamente.");
        return;
      }

      // Update password using Supabase auth
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes("Password should be at least")) {
          toast.error("Senha não atende aos requisitos mínimos");
        } else if (error.message.includes("Invalid login credentials")) {
          toast.error("Senha atual está incorreta");
        } else if (
          error.message.includes(
            "New password should be different from the old password"
          )
        ) {
          toast.error("Nova senha deve ser diferente da senha atual");
        } else {
          toast.error("Erro ao atualizar senha. Tente novamente.");
        }
        return;
      }

      // Success
      toast.success("Senha atualizada com sucesso!");

      // Clear form
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });

      // Optional: Redirect back to me page after a short delay
      setTimeout(() => {
        router.push("/me");
      }, 2000);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleCancel = () => {
  //   router.push("/me");
  // };

  const newPasswordValidation = formData.newPassword
    ? validatePassword(formData.newPassword)
    : null;
  const passwordsMatch =
    formData.newPassword && formData.confirmPassword
      ? formData.newPassword === formData.confirmPassword
      : null;

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-0">
        {/* Header */}
        <div className="mb-2">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-600">Segurança</h1>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() => router.push("/me")}
                className="flex items-center space-x-2 font-bold bg-gray-600 text-white uppercase text-[0.8rem]"
              >
                {/* <ArrowLeft className="h-4 w-4" /> */}
                <span>voltar</span>
              </Button>
            </div>
            <p className=" mt-2 text-lg">
              Gerencie a segurança da sua conta e senha.
            </p>
          </div>
        </div>

        {/* Password Change Form */}
        <Card className="max-w-2xl mx-auto mt-4">
          {/* <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
          </CardHeader> */}
          <CardContent className="space-y-6">
            {/* Current Password 
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    handleInputChange("currentPassword", e.target.value)
                  }
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>*/}

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange("newPassword", e.target.value)
                  }
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {newPasswordValidation && (
                <p
                  className={`text-md ${
                    newPasswordValidation.isValid
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {newPasswordValidation.message}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {passwordsMatch !== null && (
                <p
                  className={`text-md ${
                    passwordsMatch ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {passwordsMatch ? "Senhas coincidem" : "Senhas não coincidem"}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium  mb-2">Requisitos de Senha:</h4>
              <ul className="text-md  space-y-1">
                <li>• Pelo menos 8 caracteres</li>
                <li>• Pelo menos uma letra minúscula</li>
                <li>• Pelo menos uma letra maiúscula</li>
                <li>• Pelo menos um número</li>
                <li>• Diferente da senha atual</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !validateForm().isValid}
                size="default"
                variant="default"
                className="flex-1 font-bold bg-yellow-500 text-white uppercase text-[0.8rem]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  "Atualizar Senha"
                )}
              </Button>
              {/* <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
