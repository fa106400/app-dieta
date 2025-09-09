### Database Schema Update – Diet Simplification

**Objective:**  
Unify diet variants and meals into a single `diets` table to simplify schema and remove unused complexity.

---

#### Changes Applied

1. **Diets Table**
   - Added columns:
     - `calories_total` (INTEGER, range 800–5000).
     - `macros` (JSONB, e.g., `{ "protein": 120, "carbs": 150, "fat": 60 }`).
     - `week_plan` (JSONB, normalized diet plan: `days → meals → items`).
   - Variants that were stored in `diet_variants` are now flattened into new rows in `diets`.

2. **Removed Tables**
   - `diet_variants` (merged into `diets`).
   - `meals` (replaced by `week_plan` JSONB inside `diets`).
   - `user_meal_log` (feature no longer required).

3. **Updated Table**
   - `user_current_diet` no longer references `diet_variant_id`; users now directly reference a row in `diets`.

4. **Updated Views**
   - Recreated `diet_catalog_view` without dependency on `diet_variants`.
   - It now directly exposes `calories_total`, `macros`, and `week_plan` from `diets`.

---

#### Example `week_plan` JSON structure

The `week_plan` column (JSONB) stores the **entire weekly plan** for a diet.  
It is structured as:

- `days`: array of days in the plan (e.g., 0 = Monday, 1 = Tuesday, etc.).
- Each `day` contains:
  - `day_index`: integer (0–6).
  - `meals`: array of meals for that day.
- Each `meal` contains:
  - `name`: string (e.g., "Breakfast", "Lunch").
  - `items`: array of food items.
- Each `item` contains:
  - `name`: string, food name.
  - `quantity`: numeric, recommended portion.
  - `unit`: string, measurement unit (e.g., "g", "pcs", "ml").
  - `alt_items`: array of alternative items (same structure as `item`), used for substitutions.
- Each `meal` also includes:
  - `calories`: integer, estimated calories for that meal.

---

##### Example JSON

```json
{
  "days": [
    {
      "day_index": 0,
      "meals": [
        {
          "name": "Breakfast",
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
          ],
          "calories": 400
        }
      ]
    }
  ]
}
