# Calorie Estimative Refactor - Implementation Plan

## Overview
This document outlines the detailed implementation plan for adding the `estimated_calories` column to the `profiles` table and externalizing the calorie calculation method from `ai-service.ts` to be used across the application.

## Phase 1: Database Schema Updates ✅ COMPLETED

### 1. Update Supabase Type Definitions (`supabase.ts`) ✅
- ✅ Add `estimated_calories: number | null` to the `profiles` table Row type
- ✅ Add `estimated_calories?: number | null` to the `profiles` table Insert type  
- ✅ Add `estimated_calories?: number | null` to the `profiles` table Update type

## Phase 2: Externalize Calorie Calculation Method

### 2. Create New Utility Service (`src/lib/calorie-calculator.ts`)
- Extract the `calculateEstimatedCalories` method from `ai-service.ts`
- Make it a standalone, reusable function
- Define proper TypeScript interfaces for the user profile data
- Keep the existing default value logic (returns 2000 if missing required fields)
- Export the function for use across the application

### 3. Update AI Service (`src/lib/ai-service.ts`)
- Remove the private `calculateEstimatedCalories` method
- Import and use the externalized function instead
- Update any internal references

## Phase 3: Update Profile Management

### 4. Update User Profile Service (`src/lib/user-profile.ts`)
- Add `estimated_calories` to the `CreateProfileData` interface
- Update the `create` method to accept and store `estimated_calories`
- Update the `update` method to handle `estimated_calories` updates

### 5. Update API Endpoint (`src/app/api/auth/me/route.ts`)
- Add `estimated_calories` to the `validProfileFields` object in the PUT method
- Ensure the field is properly handled in profile updates

## Phase 4: Onboarding Integration

### 6. Update Onboarding Page (`src/app/(app)/onboarding/page.tsx`)
- Import the externalized calorie calculation function
- Update the `OnboardingData` interface to include `estimated_calories`
- In the `handleSubmit` function, after collecting all form data:
  - Call `calculateEstimatedCalories(formData)` to get the estimated calories
  - Include the calculated value in the profile data sent to the API
  - **Error Handling**: If calculation fails, show error message to user and prevent onboarding completion
  - **Retry Logic**: Allow user to try again if calculation fails

## Phase 5: Profile Page Integration

### 7. Update Profile Page (`src/app/(app)/profile/page.tsx`)
- Import the externalized calorie calculation function
- Update the `ProfileData` interface to include `estimated_calories`
- Modify the `saveProfile` function to:
  - Calculate estimated calories using current profile data
  - Include `estimated_calories` in the update payload
  - **Error Handling**: If calculation fails, keep the old value in the database (don't update the field)
- Update the `addWeight` function to:
  - **Use the new weight entry** (not `weight_start_kg`) for calorie calculation
  - Recalculate estimated calories after adding a new weight entry
  - Update the profile with the new estimated calories
  - **Error Handling**: If calculation fails, keep the old value in the database

### 8. Update Weight API (`src/app/api/me/weight/route.ts`)
- In the POST method (after successful weight insertion):
  - Fetch the user's current profile data
  - **Use the newly inserted weight** for calorie calculation (not `weight_start_kg`)
  - Calculate new estimated calories using the externalized function
  - Update the profile with the new `estimated_calories` value
  - **Error Handling**: If calculation fails, log error but don't fail the weight insertion
- In the PUT method (after successful weight update):
  - Same logic as POST method
  - **Use the updated weight** for calorie calculation

## Phase 6: Specific Tab Integration

### 9. Personal Tab Integration
- When "Salvar" button is clicked on Personal tab:
  - Recalculate `estimated_calories` using updated personal data
  - Update the profile with new estimated calories
  - **Error Handling**: Keep old value if calculation fails

### 10. Activity Tab Integration
- When "Salvar" button is clicked on Activity tab:
  - Recalculate `estimated_calories` using updated activity level
  - Update the profile with new estimated calories
  - **Error Handling**: Keep old value if calculation fails

### 11. Weight and Progress Tab Integration
- When new weight entry is added:
  - **Use the new weight value** for calorie calculation
  - Recalculate `estimated_calories` using the new weight
  - Update the profile with new estimated calories
  - **Error Handling**: Keep old value if calculation fails

## Phase 7: Interface Updates

### 12. Update Profile Interfaces
- Update any TypeScript interfaces that reference profile data
- Ensure `estimated_calories` is included in all relevant type definitions
- Update any components that display or use profile data

## Phase 8: Error Handling Implementation

### 13. Onboarding Error Handling
- Wrap calorie calculation in try-catch
- Display user-friendly error message if calculation fails
- Prevent form submission until calculation succeeds
- Provide retry mechanism

### 14. Profile Page Error Handling
- Wrap calorie calculations in try-catch blocks
- Log errors for debugging
- **Preserve existing `estimated_calories` value** if calculation fails
- Continue with normal profile update flow even if calorie calculation fails

## Phase 9: Testing and Validation

### 15. Test Integration Points
- Test onboarding flow with calorie calculation (success and failure cases)
- Test profile updates in all three tabs (Personal, Activity, Weight and Progress)
- Test weight entry additions and updates with new weight values
- Verify estimated calories are calculated using the correct weight values
- Test error scenarios and ensure old values are preserved
- Test edge cases (missing data, invalid values)

## Key Implementation Notes

- **Weight Usage**: Always use the most recent weight entry for calorie calculations, not `weight_start_kg`
- **Error Strategy**: 
  - Onboarding: Fail fast with user notification
  - Profile updates: Fail silently, preserve old values
- **Recalculation Triggers**: Personal tab save, Activity tab save, Weight entry addition/update
- **Data Flow**: New weight → Calculate calories → Update profile → Continue normal flow

## User Requirements Summary

1. **Default Value**: The method `calculateEstimatedCalories()` already has a block of code for a default value return in that case
2. **Recalculation Trigger**: Since it is not a heavy process, recalculate and update the table when the submit button is called on the personal tab, on the activity tab and when the user inserts a new weight registry on weight and progress tab
3. **Weight Logic**: ALWAYS use the new weight registry that the user inserted. The logic is that the user is telling us that his weight changed on the scale so we should consider a new calorie estimative for him
4. **Error Handling**: If it fails on the onboarding process, an error message should be presented to the user, for him to try again. If it fails on the /profiles page, the old value should remain in the table
5. **Display**: Just for internal use

This plan ensures robust error handling while maintaining data integrity and providing a smooth user experience across all interaction points.
