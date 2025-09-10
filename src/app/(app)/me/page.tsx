"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { User, Weight, Target, BarChart3 } from "lucide-react";

export default function MePage() {
  const router = useRouter();

  const menuItems = [
    {
      title: "Weight Log",
      description: "Track your weight progress over time",
      icon: Weight,
      href: "/me/weight-log",
      color: "text-blue-600",
    },
    {
      title: "Profile Settings",
      description: "Manage your personal information",
      icon: User,
      href: "/profile",
      color: "text-green-600",
    },
    {
      title: "Current Diet",
      description: "View your active diet plan",
      icon: Target,
      href: "/my-week",
      color: "text-purple-600",
    },
    {
      title: "Progress Tracking",
      description: "View your overall progress",
      icon: BarChart3,
      href: "/me/progress",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and track your progress
        </p>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.title}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(item.href)}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Icon className={`h-6 w-6 ${item.color}`} />
                  <span>{item.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{item.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(item.href);
                  }}
                >
                  Open
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
