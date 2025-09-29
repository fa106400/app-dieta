/**
 * Calorie Calculator Utility
 * 
 * This module provides functions for calculating estimated daily calorie needs
 * based on user profile data. Extracted from ai-service.ts for reusability.
 */

export interface UserProfileForCalories {
  age?: number;
  weight?: number;
  height?: number;
  activityLevel?: string;
  goals?: string[];
}

/**
 * Calculate estimated daily calorie needs based on user profile
 * 
 * @param userProfile - User profile data containing age, weight, height, activity level, and goals
 * @returns Estimated daily calorie needs in calories
 */
export function calculateEstimatedCalories(userProfile: UserProfileForCalories): number {
  if (!userProfile.age || !userProfile.weight || !userProfile.height || !userProfile.activityLevel) {
    return 2000; // Default fallback
  }

  // Calculate BMR using Mifflin-St Jeor Equation
  const age = userProfile.age;
  const weight = userProfile.weight;
  const height = userProfile.height;
  
  // BMR calculation (simplified - using average for gender)
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  
  // Activity level multipliers
  const activityMultipliers = {
    'sedentary': 1.2,
    'lightly_active': 1.375,
    'moderately_active': 1.55,
    'very_active': 1.725,
    'extra_active': 1.9
  };
  
  const multiplier = activityMultipliers[userProfile.activityLevel as keyof typeof activityMultipliers] || 1.55;
  const tdee = bmr * multiplier;
  
  // Adjust based on goals
  let adjustedCalories = tdee;
  if (userProfile.goals?.includes('lose_weight')) {
    adjustedCalories = tdee - 500; // 1 lb per week deficit
  } else if (userProfile.goals?.includes('gain_muscle')) {
    adjustedCalories = tdee + 300; // Surplus for muscle gain
  }
  
  return Math.round(adjustedCalories);
}
