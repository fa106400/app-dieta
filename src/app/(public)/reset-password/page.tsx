"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { PublicRoute } from "@/components/auth/PublicRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  // CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

function ResetPasswordPageContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { updatePassword } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user has a valid reset token (Supabase handles this automatically)
  useEffect(() => {
    // If no token in URL, redirect to login
    if (
      !searchParams.get("access_token") &&
      !searchParams.get("refresh_token")
    ) {
      router.push("/login");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      const errorMsg =
        "As senhas não correspondem. Por favor, tente novamente.";
      setMessage({
        type: "error",
        text: errorMsg,
      });
      toast.error(errorMsg);
      return;
    }

    if (password.length < 6) {
      const errorMsg = "A senha deve ter pelo menos 6 caracteres.";
      setMessage({
        type: "error",
        text: errorMsg,
      });
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await updatePassword({ password });
      const successMsg =
        "Senha atualizada com sucesso! Redirecionando para login...";
      setMessage({
        type: "success",
        text: successMsg,
      });
      toast.success(successMsg);

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Falha ao atualizar senha. Por favor, tente novamente.";
      setMessage({
        type: "error",
        text: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-5 lg:px-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Image
            className="h-12 sm:h-14 lg:h-16 w-auto max-w-full object-contain mx-auto"
            src="/imgs/logo/logo-rect.png"
            alt="Logo"
            width={450}
            height={113}
            priority
          />
          {/* <p className="mt-2 text-md ">
            Enter your new password below.
          </p>*/}
        </div>

        <Card>
          <CardHeader>
            {/* <CardTitle className="text-center">Nova Senha</CardTitle> */}
            <CardDescription className="text-center text-lg">
              Escolha uma senha forte para sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 " />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3  hover:"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 " />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3  hover:"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {message && (
                <div
                  className={`p-3 text-md border rounded-md ${
                    message.type === "success"
                      ? "text-green-600 bg-green-50 border-green-200"
                      : "text-red-600 bg-red-50 border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button
                variant="default"
                type="submit"
                size="default"
                className="w-full font-bold bg-green-500 text-white uppercase text-[0.8rem]"
                disabled={isLoading}
              >
                {isLoading ? "Atualizando..." : "Atualizar Senha"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-md text-sky-500 hover:text-sky-500"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <PublicRoute>
      <ResetPasswordPageContent />
    </PublicRoute>
  );
}
