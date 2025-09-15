"use client";

//import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent /*CardHeader, CardTitle */,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  User,
  //Weight,
  Award,
  CreditCard,
  //Settings,
  Shield,
  Eye,
  //Target,
} from "lucide-react";

export default function MePage() {
  const router = useRouter();

  const menuItems = [
    /*{
      title: "Weight Log",
      description: "Track your weight progress over time",
      icon: Weight,
      href: "/me/weight-log",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },*/
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
    {
      title: "Privacy",
      description: "Control your privacy settings and data",
      icon: Eye,
      href: "/me/privacy",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Eu</h1>
        <p className="text-gray-600">
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
                    <p className="text-gray-600 text-sm">{item.description}</p>
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
                    <p className="text-gray-600 text-sm">{item.description}</p>
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

      {/* Additional Quick Actions 
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow border-gray-200"
            onClick={() => router.push("/my-plan")}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Current Diet</h3>
                  <p className="text-sm text-gray-600">View your active plan</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow border-gray-200"
            onClick={() => router.push("/shopping-list")}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-50 border border-teal-200 rounded-lg">
                  <svg
                    className="h-5 w-5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Shopping List</h3>
                  <p className="text-sm text-gray-600">Generate grocery list</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow border-gray-200"
            onClick={() => router.push("/diets")}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-50 border border-pink-200 rounded-lg">
                  <svg
                    className="h-5 w-5 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Browse Diets</h3>
                  <p className="text-sm text-gray-600">Explore diet options</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      */}
    </div>
  );
}
