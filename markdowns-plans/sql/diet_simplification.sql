-- ========================================
-- Migration: Simplify diet schema
-- ========================================

-- 1. Add new columns to diets
ALTER TABLE diets
    ADD COLUMN calories_total INTEGER CHECK (calories_total >= 800 AND calories_total <= 10000),
    ADD COLUMN macros JSONB, -- {protein: 120, carbs: 150, fat: 60}
    ADD COLUMN week_plan JSONB; -- normalized representation: days → meals → items

-- 2. Migrate data from diet_variants into diets
-- For each variant, insert as a new row in diets
INSERT INTO diets (slug, title, description, tags, category, difficulty, duration_weeks, popularity_score, is_public, created_at, updated_at, calories_total, macros, week_plan)
SELECT 
    d.slug || '-' || dv.calories_total,  -- make slug unique
    d.title || ' (' || dv.calories_total || ' kcal)',
    d.description,
    d.tags,
    d.category,
    d.difficulty,
    d.duration_weeks,
    d.popularity_score,
    d.is_public,
    d.created_at,
    d.updated_at,
    dv.calories_total,
    dv.macros,
    dv.week_plan
FROM diets d
INNER JOIN diet_variants dv ON dv.diet_id = d.id;

-- 3. Drop dependent constraints in user_current_diet
ALTER TABLE user_current_diet DROP CONSTRAINT user_current_diet_diet_variant_id_fkey;
ALTER TABLE user_current_diet DROP COLUMN diet_variant_id;

-- 4. Drop unused tables
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS user_meal_log CASCADE;
DROP TABLE IF EXISTS diet_variants CASCADE;

-- 5. Update diet_catalog_view to remove dependency on diet_variants
DROP VIEW IF EXISTS diet_catalog_view;

CREATE VIEW diet_catalog_view AS
SELECT 
    d.id,
    d.slug,
    d.title,
    d.description,
    d.tags,
    d.category,
    d.difficulty,
    d.duration_weeks,
    d.popularity_score,
    d.calories_total,
    d.macros,
    d.week_plan
FROM diets d
WHERE d.is_public = TRUE;
