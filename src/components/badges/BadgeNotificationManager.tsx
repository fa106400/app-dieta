"use client";

import React from "react";
import { useBadgeNotification } from "@/contexts/BadgeNotificationContext";
import { BadgeAchievementPopup } from "./BadgeAchievementPopup";

export function BadgeNotificationManager() {
  const { pendingBadges, isNotificationVisible, hideBadgeNotification } =
    useBadgeNotification();

  return (
    <BadgeAchievementPopup
      badges={pendingBadges}
      isVisible={isNotificationVisible}
      onClose={hideBadgeNotification}
    />
  );
}
