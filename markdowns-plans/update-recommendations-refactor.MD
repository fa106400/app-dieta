# Update Diet Recommendations on Calorie Change - Implementation Plan

## Problem Summary

When a user's `estimated_calories` changes (via profile updates or weight changes), their existing diet recommendations become "invisible" because the recommended diets no longer match the new calorie level. We need to "migrate" their recommendations to the equivalent diets at the new calorie level.

**Example Scenario:**
- User has "Dieta Tradicional 3000kcal" as a recommendation
- User updates weight → Caloric needs recalculated to 2800kcal
- Problem: "Dieta Tradicional 3000kcal" is no longer shown in `/diets` page (calorie mismatch)
- Solution: Update recommendation to "Dieta Tradicional 2800kcal"

---

## Solution Overview

After updating `estimated_calories`, we'll **silently** update all the user's diet recommendations to point to the same diet titles but at the new calorie level. If an equivalent diet doesn't exist, we keep the old recommendation and log an error.

---

## 📝 Implementation Plan

### **Phase 1: Create Reusable Update Function**

**Location**: Create new function in `src/app/(app)/profile/page.tsx`

**Function Signature**: 
```typescript
const updateDietRecommendationsForNewCalories = async (
  userId: string, 
  oldCalories: number | null | undefined, 
  newCalories: number
) => Promise<void>
```

**Implementation Steps:**

1. **Early exit if calories haven't changed**
   ```typescript
   if (oldCalories === newCalories) return;
   ```

2. **Fetch existing recommendations**
   ```typescript
   const { data: recommendations, error: recError } = await supabase
     .from('diet_recommendations')
     .select('id, diet_id, score, reasoning')
     .eq('user_id', userId);
   ```

3. **Handle no recommendations gracefully**
   ```typescript
   if (!recommendations || recommendations.length === 0) {
     console.log('[updateDietRecs] No recommendations to update');
     return;
   }
   ```

4. **For each recommendation:**
   
   a. **Get current diet details**
   ```typescript
   const { data: currentDiet } = await supabase
     .from('diets')
     .select('id, title, calories_total')
     .eq('id', recommendation.diet_id)
     .single();
   ```
   
   b. **Find equivalent diet at new calorie level**
   ```typescript
   const { data: newDiet } = await supabase
     .from('diets')
     .select('id')
     .eq('title', currentDiet.title)
     .eq('calories_total', newCalories)
     .single();
   ```
   
   c. **Update or keep based on result**
   ```typescript
   if (newDiet && newDiet.id !== recommendation.diet_id) {
     // Update to new diet
     await supabase
       .from('diet_recommendations')
       .update({ 
         diet_id: newDiet.id,
         last_refreshed: new Date().toISOString()
       })
       .eq('id', recommendation.id);
     
     console.log(`✅ Updated recommendation: ${currentDiet.title} from ${currentDiet.calories_total} to ${newCalories} kcal`);
   } else if (!newDiet) {
     // Keep old recommendation, log error
     console.error(`⚠️ No equivalent diet found: "${currentDiet.title}" at ${newCalories} kcal. Keeping ${currentDiet.calories_total} kcal version.`);
   }
   ```

5. **Error handling**
   ```typescript
   try {
     // ... all logic above
   } catch (error) {
     console.error('[updateDietRecs] Error updating recommendations:', error);
     // Don't throw - fail silently to not break profile update
   }
   ```

6. **Logging summary**
   ```typescript
   console.log(`[updateDietRecs] Updated recommendations for user ${userId}: ${oldCalories} → ${newCalories} kcal`);
   ```

---

### **Phase 2: Integration Point 1 & 2 - Personal & Activity Tab Save**

**Location**: `src/app/(app)/profile/page.tsx` - `saveProfile()` function (around lines 266-335)

**Current Code** (lines 273-304):
```typescript
// Calculate estimated calories if relevant fields are being updated
let estimatedCalories: number | undefined;
try {
  // ... calculation logic
  estimatedCalories = calculateEstimatedCalories(profileForCalculation);
} catch (calorieError) {
  // ... error handling
}
```

**NEW Implementation**:

```typescript
// Calculate estimated calories if relevant fields are being updated
let estimatedCalories: number | undefined;
try {
  // ... existing calculation logic (keep as is)
  estimatedCalories = calculateEstimatedCalories(profileForCalculation);
} catch (calorieError) {
  // ... existing error handling (keep as is)
}

// 🆕 STORE OLD VALUE before update
const oldEstimatedCalories = profile?.estimated_calories;

const response = await fetch("/api/auth/me", {
  // ... existing code
});

if (!response.ok) {
  // ... existing error handling
}

// 🆕 UPDATE DIET RECOMMENDATIONS if calories changed
if (estimatedCalories !== undefined && estimatedCalories !== oldEstimatedCalories) {
  await updateDietRecommendationsForNewCalories(
    user.id,
    oldEstimatedCalories,
    estimatedCalories
  );
}

await fetchProfile(); // Existing - refresh profile data
toast.success("Perfil atualizado com sucesso!"); // Existing - single toast
```

**Notes:**
- Silent update (no additional toast)
- Both Personal and Activity tabs use same `saveProfile()` function, so this covers both
- Update happens AFTER profile save succeeds

---

### **Phase 3: Integration Point 3 - Weight Entry Addition**

**Location**: `src/app/(app)/profile/page.tsx` - `addWeight()` function (around lines 342-425)

**Current Code** (lines 373-405):
```typescript
// Recalculate estimated calories with the new weight
try {
  if (profile?.age && profile?.height_cm && profile?.activity_level && profile?.goal) {
    const estimatedCalories = calculateEstimatedCalories({...});
    
    // Update profile with new estimated calories
    await fetch("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estimated_calories: estimatedCalories }),
    });
  }
} catch (calorieError) {
  console.error("Error updating estimated calories after weight entry:", calorieError);
}
```

**NEW Implementation**:

```typescript
// Recalculate estimated calories with the new weight
try {
  if (profile?.age && profile?.height_cm && profile?.activity_level && profile?.goal) {
    const estimatedCalories = calculateEstimatedCalories({
      age: profile.age,
      weight: weight, // Use the new weight entry
      height: profile.height_cm,
      activityLevel: profile.activity_level,
      goals: [profile.goal],
    });

    // 🆕 STORE OLD VALUE before update
    const oldEstimatedCalories = profile.estimated_calories;

    // Update profile with new estimated calories
    const response = await fetch("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estimated_calories: estimatedCalories }),
    });

    // 🆕 UPDATE DIET RECOMMENDATIONS if calories changed and update succeeded
    if (response.ok && estimatedCalories !== oldEstimatedCalories) {
      await updateDietRecommendationsForNewCalories(
        user.id,
        oldEstimatedCalories,
        estimatedCalories
      );
    }
  }
} catch (calorieError) {
  console.error("Error updating estimated calories after weight entry:", calorieError);
  // Don't fail the weight entry operation if calorie update fails
}
```

**Notes:**
- Silent update (no additional toast, existing "Registro de peso adicionado com sucesso!" remains)
- Update happens AFTER profile update succeeds
- Wrapped in existing try-catch, won't break weight entry if update fails

---

### **Phase 4: Error Handling & Edge Cases**

**Edge Case 1: No equivalent diet at new calorie level** ✅
- **Action**: Keep old recommendation
- **Logging**: `console.error('⚠️ No equivalent diet found: "{title}" at {newCalories} kcal. Keeping {oldCalories} kcal version.')`
- **Benefit**: User keeps seeing recommendation, you get logs to add missing diets later

**Edge Case 2: User has no recommendations** ✅
- **Action**: Early return, no-op
- **Logging**: `console.log('[updateDietRecs] No recommendations to update')`
- **Benefit**: Graceful handling, no errors

**Edge Case 3: Multiple diets with same title** ✅
- **Action**: Not applicable (won't happen based on data model)
- **Query**: Uses `.single()` which enforces uniqueness

**Edge Case 4: Individual update fails** ✅
- **Action**: Wrap each recommendation update in try-catch
- **Logging**: Log error but continue with next recommendation
- **Benefit**: Partial success is better than total failure

**Edge Case 5: Supabase client not available** ✅
- **Action**: Early return with warning
- **Logging**: `console.warn('[updateDietRecs] Supabase not available')`

**Edge Case 6: Current diet not found (deleted?)** ✅
- **Action**: Skip that recommendation, log warning
- **Logging**: `console.warn('[updateDietRecs] Diet {id} not found in diets table')`

---

### **Phase 5: Complete Function Implementation**

**Function Structure**:
```typescript
const updateDietRecommendationsForNewCalories = async (
  userId: string,
  oldCalories: number | null | undefined,
  newCalories: number
): Promise<void> => {
  // 1. Early exits
  if (oldCalories === newCalories) return;
  if (!supabase) {
    console.warn('[updateDietRecs] Supabase not available');
    return;
  }

  try {
    console.log(`[updateDietRecs] Updating recommendations: ${oldCalories} → ${newCalories} kcal`);

    // 2. Fetch recommendations
    const { data: recommendations, error: recError } = await supabase
      .from('diet_recommendations')
      .select('id, diet_id, score, reasoning')
      .eq('user_id', userId);

    if (recError) throw recError;

    if (!recommendations || recommendations.length === 0) {
      console.log('[updateDietRecs] No recommendations to update');
      return;
    }

    // 3. Process each recommendation individually (safer than batch)
    for (const rec of recommendations) {
      try {
        // 3a. Get current diet
        const { data: currentDiet, error: dietError } = await supabase
          .from('diets')
          .select('id, title, calories_total')
          .eq('id', rec.diet_id)
          .single();

        if (dietError || !currentDiet) {
          console.warn(`[updateDietRecs] Diet ${rec.diet_id} not found`);
          continue;
        }

        // 3b. Find equivalent at new calorie level
        const { data: newDiet, error: newDietError } = await supabase
          .from('diets')
          .select('id')
          .eq('title', currentDiet.title)
          .eq('calories_total', newCalories)
          .single();

        // 3c. Update or keep
        if (newDiet && newDiet.id !== rec.diet_id) {
          const { error: updateError } = await supabase
            .from('diet_recommendations')
            .update({
              diet_id: newDiet.id,
              last_refreshed: new Date().toISOString()
            })
            .eq('id', rec.id);

          if (updateError) {
            console.error(`[updateDietRecs] Failed to update rec ${rec.id}:`, updateError);
          } else {
            console.log(`✅ Updated: "${currentDiet.title}" ${currentDiet.calories_total} → ${newCalories} kcal`);
          }
        } else if (!newDiet) {
          console.error(`⚠️ No equivalent: "${currentDiet.title}" at ${newCalories} kcal. Keeping ${currentDiet.calories_total} kcal.`);
        }
      } catch (recError) {
        console.error(`[updateDietRecs] Error processing recommendation ${rec.id}:`, recError);
        // Continue with next recommendation
      }
    }

    console.log(`[updateDietRecs] Completed for user ${userId}`);
  } catch (error) {
    console.error('[updateDietRecs] Fatal error:', error);
    // Don't throw - fail silently to not break profile update
  }
};
```

---

### **Phase 6: Testing Checklist**

After implementation, test these scenarios:

1. **✅ Personal Tab Save - Calories Change**
   - Change age/height → Calories change from 2000 to 2200
   - Expected: Recommendations silently updated to 2200 kcal versions

2. **✅ Personal Tab Save - Calories Same**
   - Change name only → Calories stay at 2000
   - Expected: No update, early return

3. **✅ Activity Tab Save - Calories Change**
   - Change activity level → Calories change from 2000 to 2400
   - Expected: Recommendations silently updated to 2400 kcal versions

4. **✅ Weight Entry - Calories Change**
   - Add new weight → Calories change from 2000 to 1800
   - Expected: Recommendations silently updated to 1800 kcal versions

5. **✅ No Equivalent Diet**
   - User has "Dieta X 3000kcal" but "Dieta X 2800kcal" doesn't exist
   - Expected: Keep 3000kcal version, log error

6. **✅ No Recommendations**
   - New user with no recommendations
   - Expected: Graceful early return, no errors

7. **✅ Check Logs**
   - Verify console logs show updates and any missing diets

---

## 🎯 Summary

### Files to Modify
- `src/app/(app)/profile/page.tsx` (1 new function + 2 integration points)

### New Function
- `updateDietRecommendationsForNewCalories()` (~80 lines)

### Integration Points
1. **`saveProfile()` function** - add ~7 lines
   - Handles Personal Tab (save button)
   - Handles Activity Tab (save button)

2. **`addWeight()` function** - add ~10 lines
   - Handles Weight and Progress Tab (add weight button)

### Behavior
- ✅ Silent updates (no extra toasts)
- ✅ Keep old recommendations if no equivalent found
- ✅ Log errors for missing diets
- ✅ Individual updates (safe, not batch)
- ✅ Graceful error handling
- ✅ Doesn't break profile/weight operations

### Decision Summary

| Question | Decision |
|----------|----------|
| **No equivalent diet found?** | Keep old recommendation, log error |
| **User notification?** | Silent update, no additional toasts |
| **Batch vs Individual updates?** | Individual (safer for 2 recommendations) |
| **Handle AI refresh button?** | No - AI refresh already generates new recommendations |
| **Transaction safety?** | Individual try-catch per recommendation |
| **Alternative approach?** | No - Don't delete and regenerate (cost issue) |

---

## 🚀 Implementation Status

- [ ] Phase 1: Create `updateDietRecommendationsForNewCalories()` function
- [ ] Phase 2: Integrate into `saveProfile()` function
- [ ] Phase 3: Integrate into `addWeight()` function
- [ ] Phase 4: Test all edge cases
- [ ] Phase 5: Verify console logs
- [ ] Phase 6: Mark complete

**Ready for implementation!**
