"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { User, Award, CreditCard, Shield } from "lucide-react";

export default function MePage() {
  const router = useRouter();

  const menuItems = [
    {
      title: "Meu Perfil",
      description: "Atualize seus dados pessoais, peso, objetivo, etc.",
      icon: User,
      href: "/profile",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Medalhas",
      description: "Veja suas conquistas e medalhas",
      icon: Award,
      href: "/badges",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      title: "Subscription",
      description: "Manage your subscription and billing",
      icon: CreditCard,
      href: "/me/subscription",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Security",
      description: "Manage your account security and password",
      icon: Shield,
      href: "/me/security",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Eu</h1>
        <p className="text-gray-600 font-lg">
          Gerencie seu perfil, acompanhe seu progresso e personalize sua
          experiência.
        </p>
      </div>

      {/* Navigation Tiles - Desktop: 2 columns, Mobile: 1 column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.title}
              className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] ${item.borderColor} ${item.bgColor}`}
              onClick={() => router.push(item.href)}
            >
              <CardContent className="p-6">
                {/* Desktop Layout: Large icon centered with label below */}
                <div className="hidden md:flex flex-col items-center text-center space-y-4">
                  <div
                    className={`p-4 rounded-full ${item.bgColor} ${item.borderColor} border-2`}
                  >
                    <Icon className={`h-8 w-8 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-md">{item.description}</p>
                  </div>
                </div>

                {/* Mobile Layout: Small icon on left, label on right */}
                <div className="md:hidden flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-lg ${item.bgColor} ${item.borderColor} border`}
                  >
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-md">{item.description}</p>
                  </div>
                  <div className="text-gray-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
