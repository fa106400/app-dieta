"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn({ email, password });
      toast.success("Login realizado com sucesso!");
      // Redirect to home page after successful login
      router.push("/home");
    } catch (error: unknown) {
      const humanReadableError =
        "Erro ao entrar. Por favor, verifique suas credenciais.";
      const errorMessage =
        error instanceof Error ? error.message : humanReadableError;
      setError(errorMessage);
      // console.error("Erro ao entrar:", errorMessage);
      toast.error(humanReadableError);
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
        </div>

        <Card>
          <CardHeader>
            {/* <CardTitle className="text-center">Acessar sua conta</CardTitle> */}
            <CardDescription className="text-center text-lg">
              Digite suas credenciais para acessar sua conta
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

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
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

              {error && (
                <div className="p-3 text-md text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-4 space-y-2 text-center">
              <div>
                <Link
                  href="/forgot-password"
                  className="text-md text-sky-500 hover:text-sky-500"
                >
                  Esqueceu sua senha?
                </Link>
              </div>

              <div className="text-md ">
                Não tem uma conta?{" "}
                <Link
                  href="/signup"
                  className="text-sky-500 hover:text-sky-500 font-medium"
                >
                  Criar conta
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginPageContent />
    </PublicRoute>
  );
}
