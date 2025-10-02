"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

function ForgotPasswordPageContent() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { resetPassword } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await resetPassword({ email });
      const successMsg =
        "Email de redefinição de senha enviado! Verifique sua caixa de entrada para obter mais instruções.";
      setMessage({
        type: "success",
        text: successMsg,
      });
      toast.success(successMsg);
      setEmail("");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Falha ao enviar email de redefinição de senha. Por favor, tente novamente.";
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
            Digite seu endereço de email e nós lhe enviaremos um link para
            redefinir sua senha.
          </p>*/}
        </div>

        <Card>
          <CardHeader>
            {/* <CardTitle className="text-center">Redefinir Senha</CardTitle> */}
            <CardDescription className="text-center text-lg">
              Digite seu endereço de email e nós lhe enviaremos um link para
              redefinir sua senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Endereço de Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 " />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
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
                {isLoading ? "Enviando..." : "Enviar Link de Redefinição"}
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

export default function ForgotPasswordPage() {
  return (
    <PublicRoute>
      <ForgotPasswordPageContent />
    </PublicRoute>
  );
}
