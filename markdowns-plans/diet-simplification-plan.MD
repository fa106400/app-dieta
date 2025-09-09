# 📋 **Comprehensive Diet Simplification Refactor Plan**

Based on the diet simplification changes documented in `diet_simplification.MD`, here's a detailed plan for updating the entire application:

## **🔍 Key Changes Summary:**
- **Removed tables**: `diet_variants`, `meals`, `user_meal_log`
- **Enhanced `diets` table**: Added `calories_total`, `macros`, `week_plan` (JSONB)
- **Simplified `user_current_diet`**: Now directly references `diets` table
- **Updated `diet_catalog_view`**: Now exposes new fields directly from `diets`

---

## **1. 📁 Update Supabase TypeScript Types** - ✅ **COMPLETED**

### **Files to Update:**
- `supabase.ts` → Replace with `markdowns-plans/sql/new_supabase.ts`

### **Changes:**
- ✅ **COMPLETED** - Replace entire file with new generated types
- ✅ **COMPLETED** - New `diets` table structure with `calories_total`, `macros`, `week_plan`
- ✅ **COMPLETED** - Removed `diet_variants`, `meals`, `user_meal_log` table types
- ✅ **COMPLETED** - Updated `user_current_diet` without `diet_variant_id`
- ✅ **COMPLETED** - Updated `diet_catalog_view` with new fields

**Status:** ✅ **STEP 1 COMPLETED** - Supabase TypeScript types successfully updated. Build errors now correctly identify missing tables (e.g., `diet_variants`), confirming the new types are working.

---

## **2. 🔧 Update Type Definitions and Interfaces** - ✅ **COMPLETED**

### **Files to Update:**
- ✅ **COMPLETED** - `src/app/(app)/diets/page.tsx` (Diet interface)
- ✅ **COMPLETED** - `src/app/(app)/diets/[dietId]/page.tsx` (DietDetail, DietVariant, Meal interfaces)
- ✅ **COMPLETED** - `src/app/(app)/diets/favorites/page.tsx` (FavoriteDiet interface)

### **Changes:**

#### **Diet Interface Updates:**
```typescript
// OLD - Remove these fields
variant_count?: number | null;
min_calories?: number | null;
max_calories?: number | null;

// NEW - Add these fields
calories_total?: number | null;
macros?: Json | null;
week_plan?: Json | null;
```

#### **Remove Obsolete Interfaces:**
- ✅ **COMPLETED** - `DietVariant` interface (no longer exists)
- ✅ **COMPLETED** - `Meal` interface (replaced by week_plan JSONB)
- ✅ **COMPLETED** - `MealPlan`, `DayPlan`, `WeekPlan` interfaces (replaced by week_plan structure)

#### **New Week Plan Structure:**
```typescript
interface WeekPlan {
  days: Array<{
    day_index: number;
    meals: Array<{
      name: string;
      calories: number;
      items: Array<{
        name: string;
        quantity: number;
        unit: string;
        alt_items?: Array<{
          name: string;
          quantity: number;
          unit: string;
        }>;
      }>;
    }>;
  }>;
}
```

**Status:** ✅ **STEP 2 COMPLETED** - All type definitions and interfaces successfully updated. Build passes with no TypeScript errors. Updated Diet interface, removed obsolete interfaces, and updated UI components to use new schema fields.

---

## **3. 📄 Refactor `/diets` Page** - ✅ **COMPLETED**

### **File:** `src/app/(app)/diets/page.tsx`

### **Changes:**

#### **A. Update Diet Interface:**
- ✅ **COMPLETED** - Add `calories_total`, `macros`, `week_plan` fields
- ✅ **COMPLETED** - Remove `variant_count`, `min_calories`, `max_calories` fields

#### **B. Update Data Fetching:**
```typescript
// OLD - Using diet_catalog_view with variant aggregation
const { data, error } = await supabase
  .from("diet_catalog_view")
  .select("*")

// NEW - Use diet_catalog_view with new structure
const { data, error } = await supabase
  .from("diet_catalog_view")
  .select(`
    id,
    title,
    description,
    category,
    difficulty,
    duration_weeks,
    popularity_score,
    calories_total,
    macros,
    week_plan,
    tags,
    slug
  `)
```

#### **C. Update Filtering Logic:**
- ✅ **COMPLETED** - Update calorie filtering to use `calories_total` instead of `min_calories`/`max_calories`
- ✅ **COMPLETED** - Remove variant-related filtering logic

#### **D. Update DietCard Props:**
- ✅ **COMPLETED** - Pass `calories_total` instead of `min_calories`/`max_calories`
- ✅ **COMPLETED** - Remove variant-related props

**Status:** ✅ **STEP 3 COMPLETED** - `/diets` page successfully refactored to use new simplified schema. Updated data fetching queries to use new `diet_catalog_view` structure with `calories_total`, `macros`, and `week_plan` fields. Build passes with no errors.

---

## **4. 🍽️ Refactor `/diets/[dietId]` Page** - ✅ **COMPLETED**

### **File:** `src/app/(app)/diets/[dietId]/page.tsx`

### **Major Changes:**

#### **A. Remove Variant Logic:**
- ✅ **COMPLETED** - Remove `selectedVariant` state
- ✅ **COMPLETED** - Remove variant selection UI
- ✅ **COMPLETED** - Remove `DietVariant` interface usage

#### **B. Update Data Fetching:**
```typescript
// OLD - Complex query with variants and meals
const { data: dietData, error: dietError } = await supabase
  .from("diets")
  .select(`
    *,
    variants:diet_variants(*),
    meals:meals(*)
  `)

// NEW - Simple query with new structure
const { data: dietData, error: dietError } = await supabase
  .from("diets")
  .select(`
    id,
    title,
    description,
    category,
    difficulty,
    duration_weeks,
    popularity_score,
    calories_total,
    macros,
    week_plan,
    tags,
    slug,
    is_public,
    created_at,
    updated_at
  `)
```

#### **C. Update UI Components:**
- ✅ **COMPLETED** - Replace variant selection with direct diet display
- ✅ **COMPLETED** - Update meal plan display to use `week_plan` JSONB structure
- ✅ **COMPLETED** - Update macros display to use `macros` JSONB
- ✅ **COMPLETED** - Update calorie display to use `calories_total`

#### **D. Update Follow Diet Logic:**
```typescript
// OLD - Using diet_variant_id
const { error } = await supabase
  .from("user_current_diet")
  .upsert({
    user_id: user.id,
    diet_variant_id: selectedVariant.id,
    is_active: true,
    started_at: new Date().toISOString()
  })

// NEW - Direct diet reference
const { error } = await supabase
  .from("user_current_diet")
  .upsert({
    user_id: user.id,
    diet_id: diet.id,
    is_active: true,
    started_at: new Date().toISOString()
  })
```

**Status:** ✅ **COMPLETED** - Follow diet logic updated to use direct diet reference instead of variant ID.

#### **E. Update Meal Plan Rendering:**
- ✅ **COMPLETED** - Parse `week_plan` JSONB structure
- ✅ **COMPLETED** - Render days and meals from the new structure
- ✅ **COMPLETED** - Handle `items` and `alt_items` arrays
- ✅ **COMPLETED** - Display meal calories from the structure
- ✅ **COMPLETED** - Implement Swap functionality for items with alternatives
- ✅ **COMPLETED** - Add state management for tracking swapped items
- ✅ **COMPLETED** - Show visual feedback for swapped items

**Status:** ✅ **STEP 4 COMPLETED** - `/diets/[dietId]` page successfully refactored to use new simplified schema. Removed variant logic, updated data fetching, implemented meal plan rendering with `alt_items` support and Swap functionality. Build passes with no errors.

---

## **5. ❤️ Refactor `/diets/favorites` Page** - ✅ **COMPLETED**

### **File:** `src/app/(app)/diets/favorites/page.tsx`

### **Changes:**

#### **A. Update Data Fetching:**
```typescript
// OLD - Complex join with variants
const { data, error } = await supabase
  .from("favorites")
  .select(`
    diet_id,
    created_at,
    diets:diet_id (
      id,
      slug,
      title,
      description,
      tags,
      category,
      difficulty,
      duration_weeks,
      popularity_score,
      is_public,
      created_at,
      updated_at
    )
  `)

// NEW - Include new fields
const { data, error } = await supabase
  .from("favorites")
  .select(`
    diet_id,
    created_at,
    diets:diet_id (
      id,
      slug,
      title,
      description,
      tags,
      category,
      difficulty,
      duration_weeks,
      popularity_score,
      calories_total,
      macros,
      week_plan,
      is_public,
      created_at,
      updated_at
    )
  `)
```

#### **B. Update FavoriteDiet Interface:**
- ✅ **COMPLETED** - Add new fields from simplified schema (inherited from Diet interface)
- ✅ **COMPLETED** - Remove variant-related fields (inherited from Diet interface)

**Status:** ✅ **STEP 5 COMPLETED** - `/diets/favorites` page successfully refactored to use new simplified schema. Updated data fetching query to include new fields (`calories_total`, `macros`, `week_plan`). The `FavoriteDiet` interface automatically inherited the updated `Diet` interface from Step 2. Build passes with no errors.

---

## **6. 🎨 Update UI Components**


### **Files to Update:**
- `src/components/diets/DietCard.tsx`
- `src/components/diets/FavoriteDietCard.tsx`

### **Changes:**

#### **A. DietCard Component:**
- ✅ **COMPLETED** - Update props to include `calories_total`, `macros`, `week_plan` (inherited from Diet interface)
- ✅ **COMPLETED** - Remove `min_calories`, `max_calories`, `variant_count` props (done in Step 2)
- ✅ **COMPLETED** - Update calorie display logic (now uses `calories_total`)
- ✅ **COMPLETED** - Update macros display (if shown) (inherited from Diet interface)

#### **B. FavoriteDietCard Component:**
- ✅ **COMPLETED** - Same updates as DietCard (inherited from Diet interface)
- ✅ **COMPLETED** - Ensure consistency with new schema (done in Step 2)

**Status:** ✅ **STEP 6 COMPLETED** - UI components (`DietCard` and `FavoriteDietCard`) were already properly updated in Step 2 when the Diet interface was refactored. Both components now use `calories_total` instead of `min_calories`/`max_calories` and inherit all new schema fields through the updated Diet interface. Build passes with no errors.

---

## **7. 📚 Update Documentation**

### **File:** `markdowns-plans/scope.MD`

### **Changes:**

#### **A. Update Database Schema Section:**
- ✅ **COMPLETED** - Document removal of `diet_variants`, `meals`, `user_meal_log` tables
- ✅ **COMPLETED** - Document new `diets` table structure with JSONB fields
- ✅ **COMPLETED** - Update `user_current_diet` table documentation
- ✅ **COMPLETED** - Update `diet_catalog_view` documentation

#### **B. Update Screen Specifications:**
- ✅ **COMPLETED** - Update Screen 4.1 (Diet Catalog) to reflect new schema
- ✅ **COMPLETED** - Update Screen 4.2 (Favorites) to reflect new schema  
- ✅ **COMPLETED** - Update Screen 5.1 (Diet Details) to reflect new schema
- ✅ **COMPLETED** - Remove variant-related functionality descriptions
- ✅ **COMPLETED** - Update meal plan display specifications

#### **C. Update API Documentation:**
- ✅ **COMPLETED** - Update database queries in screen specifications
- ✅ **COMPLETED** - Update data structures and interfaces
- ✅ **COMPLETED** - Update user flow descriptions

**Status:** ✅ **STEP 7 COMPLETED** - Documentation successfully updated in `scope.MD` to reflect the new simplified schema. Updated database schema section, screen specifications, API documentation, and code examples to use the new `diets` table structure with JSONB fields (`calories_total`, `macros`, `week_plan`). Removed all references to obsolete tables (`diet_variants`, `meals`, `user_meal_log`) and updated all functional requirements and code examples.

---

## **8. 🧪 Testing Considerations**

### **Areas to Test:**
- ✅ Diet catalog loading and filtering
- ✅ Diet detail page rendering
- ✅ Favorites functionality
- ✅ Follow diet functionality
- ✅ Meal plan display
- ✅ Macros display
- ✅ Calorie filtering
- ✅ Search and sorting

### **Edge Cases:**
- ✅ Diets without `week_plan` data
- ✅ Diets without `macros` data
- ✅ Large `week_plan` JSONB structures
- ✅ Alternative items in meal plans

---

## **9. 📋 Implementation Order**

1. **Update Supabase types** (`supabase.ts`)
2. **Update type definitions** (Diet interfaces)
3. **Refactor `/diets` page** (catalog)
4. **Refactor `/diets/[dietId]` page** (details)
5. **Refactor `/diets/favorites` page** (favorites)
6. **Update UI components** (DietCard, FavoriteDietCard)
7. **Update documentation** (scope.MD)
8. **Testing and validation**

---

## **10. ⚠️ Breaking Changes**

### **Database Schema:**
- ❌ `diet_variants` table removed
- ❌ `meals` table removed
- ❌ `user_meal_log` table removed
- ✅ `diets` table enhanced with JSONB fields
- ✅ `user_current_diet` simplified

### **API Changes:**
- ❌ Variant-based queries no longer work
- ❌ Meal-based queries no longer work
- ✅ Direct diet queries with new fields
- ✅ JSONB parsing for `week_plan` and `macros`

---

## **11. 📝 Example Week Plan JSON Structure**

Based on the documentation, the `week_plan` JSONB structure should follow this format:

```json
{
  "days": [
    {
      "day_index": 0,
      "meals": [
        {
          "name": "Breakfast",
          "calories": 400,
          "items": [
            {
              "name": "Eggs",
              "quantity": 2,
              "unit": "pcs",
              "alt_items": [
                { "name": "Oatmeal", "quantity": 50, "unit": "grams" },
                { "name": "Avocado", "quantity": 1, "unit": "pc" }
              ]
            },
            {
              "name": "Chicken",
              "quantity": 150,
              "unit": "grams",
              "alt_items": [
                { "name": "Steak", "quantity": 100, "unit": "grams" },
                { "name": "Fish", "quantity": 150, "unit": "grams" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## **12. 🎯 Success Criteria**

### **Functional Requirements:**
- ✅ All diet pages load without errors
- ✅ Diet catalog displays correctly with new schema
- ✅ Diet details show meal plans from JSONB structure
- ✅ Favorites functionality works with new schema
- ✅ Follow diet functionality works with direct diet reference
- ✅ Filtering and search work with new fields

### **Performance Requirements:**
- ✅ Page load times remain acceptable
- ✅ JSONB parsing doesn't cause performance issues
- ✅ Database queries are optimized for new schema

### **User Experience:**
- ✅ No breaking changes in user interface
- ✅ All existing functionality preserved
- ✅ Improved simplicity in diet management

---

This comprehensive plan ensures a smooth transition from the complex variant-based system to the simplified, unified diet structure while maintaining all existing functionality.
