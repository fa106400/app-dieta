"use client";

import { useState } from "react";
import { BadgeAchievementPopup } from "@/components/badges/BadgeAchievementPopup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample badge data for testing
const sampleBadges = [
  {
    id: "1",
    slug: "first_week",
    title: "Primeira Semana Completa",
    description: "Complete sua primeira semana em um plano de dieta",
    icon_name: "calendar-check",
    criteria: {
      event: "streak_days",
      count: 7,
    },
    weight: 10,
    visibility: true,
    created_at: new Date().toISOString(),
    user_badges: [
      {
        user_id: "test-user",
        badge_id: "1",
        awarded_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "2",
    slug: "weight_loss_3kg",
    title: "Marco de 3kg",
    description: "Perca 3kg do seu peso inicial",
    icon_name: "trophy",
    criteria: {
      event: "weight_lost",
      threshold: 3,
    },
    weight: 20,
    visibility: true,
    created_at: new Date().toISOString(),
    user_badges: [
      {
        user_id: "test-user",
        badge_id: "2",
        awarded_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "3",
    slug: "perfect_week",
    title: "Semana Perfeita",
    description: "Complete todas as refeições por uma semana inteira",
    icon_name: "star",
    criteria: {
      event: "adherence",
      threshold: 100,
    },
    weight: 15,
    visibility: true,
    created_at: new Date().toISOString(),
    user_badges: [
      {
        user_id: "test-user",
        badge_id: "3",
        awarded_at: new Date().toISOString(),
      },
    ],
  },
];

export default function BadgeTestPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [badgeMode, setBadgeMode] = useState<"single" | "multiple">("single");

  const handleShowSingleBadge = () => {
    setBadgeMode("single");
    setIsModalVisible(true);
  };

  const handleShowMultipleBadges = () => {
    setBadgeMode("multiple");
    setIsModalVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Badge Modal Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This is a temporary test page to preview the badge achievement
              modal. Click the buttons below to see different badge
              configurations.
            </p>

            <div className="flex flex-col gap-4">
              <Button onClick={handleShowSingleBadge} size="lg">
                Show Badge Modal (1 Badge)
              </Button>

              <Button
                onClick={handleShowMultipleBadges}
                variant="secondary"
                size="lg"
              >
                Show Badge Modal (3 Badges - Carousel)
              </Button>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is a temporary test page. Delete
                  this page and the button on /home when done testing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge Modal - Dynamic based on mode */}
        <BadgeAchievementPopup
          badges={badgeMode === "single" ? [sampleBadges[0]] : sampleBadges}
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </div>
    </div>
  );
}
