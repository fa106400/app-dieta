-- Database Schema for Nutrition & Diet Management SaaS
-- Based on specifications from plan-chatgpt.MD and screens-chatgpt.MD

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Tables

-- 1. Profiles table (user profile & preferences)
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 13 AND age <= 120),
    height_cm INTEGER NOT NULL CHECK (height_cm >= 100 AND height_cm <= 250),
    weight_start_kg NUMERIC(5,2) NOT NULL CHECK (weight_start_kg >= 30 AND weight_start_kg <= 300),
    goal TEXT NOT NULL CHECK (goal IN ('lose_weight', 'maintain', 'gain_muscle', 'health')),
    dietary_preferences TEXT[] DEFAULT '{}',
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active')),
    food_dislikes TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    user_alias TEXT DEFAULT 'alias_temp',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan TEXT NOT NULL CHECK (plan IN ('monthly', 'quarterly', 'semiannual')),
    status TEXT NOT NULL DEFAULT 'incomplete' CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'trialing')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Diets table (catalog)
create table diets (
  id uuid not null default extensions.uuid_generate_v4 (),
  slug text not null,
  title text not null,
  description text not null,
  tags text[] null default '{}'::text[],
  category text not null,
  difficulty text null,
  duration_weeks integer null,
  popularity_score integer null default 0,
  is_public boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  calories_total integer null,
  macros jsonb null,
  week_plan jsonb null,
  shopping_plan jsonb not null default '[]'::jsonb,
  constraint diets_pkey primary key (id),
  constraint diets_slug_key unique (slug),
  constraint diets_calories_total_check check (
    (
      (calories_total >= 800)
      and (calories_total <= 10000)
    )
  ),
  constraint diets_duration_weeks_check check (
    (
      (duration_weeks >= 1)
      and (duration_weeks <= 52)
    )
  )
) TABLESPACE pg_default;

-- 4. Diet variants table (prebuilt calorie ranges)
CREATE TABLE diet_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diet_id UUID NOT NULL REFERENCES diets(id) ON DELETE CASCADE,
    calories_total INTEGER NOT NULL CHECK (calories_total >= 800 AND calories_total <= 5000),
    macros JSONB NOT NULL, -- {protein: 120, carbs: 150, fat: 60}
    week_plan JSONB NOT NULL, -- normalized representation: days → meals → items
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Meals table (optional if not embedding in week_plan)
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diet_variant_id UUID NOT NULL REFERENCES diet_variants(id) ON DELETE CASCADE,
    day_index INTEGER NOT NULL CHECK (day_index >= 0 AND day_index <= 6),
    meal_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    ingredients JSONB NOT NULL, -- [{name: "chicken", quantity: 200, unit: "g"}]
    macros JSONB NOT NULL, -- {protein: 30, carbs: 15, fat: 10}
    calories INTEGER NOT NULL,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Favorites table
CREATE TABLE favorites (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    diet_id UUID NOT NULL REFERENCES diets(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, diet_id)
);

-- 7. User current diet table
CREATE TABLE user_current_diet (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    diet_id UUID NOT NULL REFERENCES diets(id) ON DELETE CASCADE,
    diet_variant_id UUID NOT NULL REFERENCES diet_variants(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Add a unique constraint to ensure only one active diet per user
CREATE UNIQUE INDEX idx_user_current_diet_active ON user_current_diet(user_id) WHERE is_active = TRUE;

-- 8. User meal log table (for adherence tracking)
CREATE TABLE user_meal_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    diet_id UUID NOT NULL REFERENCES diets(id) ON DELETE CASCADE,
    meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, meal_id, date)
);

-- 9. Weights table
CREATE TABLE weights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    measured_at DATE NOT NULL,
    weight_kg NUMERIC(5,2) NOT NULL CHECK (weight_kg >= 30 AND weight_kg <= 300),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, measured_at)
);

-- 10. Badges table (catalog)
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT,
    criteria JSONB NOT NULL, -- e.g., {streak_days: 7, weight_lost_kg: 3}
    category TEXT CHECK (category IN ('consistency', 'milestone', 'achievement')),
    weight INT DEFAULT 0 CHECK (weight >= 0 AND weight <= 99),
    visibility BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. User badges table
CREATE TABLE user_badges (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    meta JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (user_id, badge_id)
);

-- 12. Diet recommendations table (AI-generated)
CREATE TABLE diet_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    diet_id UUID NOT NULL REFERENCES diets(id) ON DELETE CASCADE,
    score FLOAT NOT NULL CHECK (score >= 0 AND score <= 1),
    reasoning TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    last_refreshed TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, diet_id)
);

-- 13. Leaderboard metrics table (precomputed)
CREATE TABLE leaderboard_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly')),
    metric TEXT NOT NULL CHECK (metric IN ('consistency', 'weight_loss_abs', 'weight_loss_pct')),
    snapshot_at DATE NOT NULL,
    entries JSONB NOT NULL, -- top N {user_id, display_name, value, rank}
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. User metrics table (for experience points)
CREATE TABLE user_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exp INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 15. Users metrics view (for leaderboard)
CREATE OR REPLACE VIEW public.users_metrics_view AS
SELECT
  um_latest.id,
  um_latest.user_id,
  um_latest.exp,
  p.user_alias,
  p.avatar_url
FROM (
  SELECT 
    um.user_id,
    um.id,
    um.exp
  FROM public.user_metrics um
  WHERE um.exp IS NOT NULL
) AS um_latest
JOIN public.profiles p
  ON p.user_id = um_latest.user_id;

-- Indexes for performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_diets_slug ON diets(slug);
CREATE INDEX idx_diets_category ON diets(category);
CREATE INDEX idx_diets_popularity ON diets(popularity_score DESC);
CREATE INDEX idx_diet_variants_diet_id ON diet_variants(diet_id);
CREATE INDEX idx_meals_diet_variant_id ON meals(diet_variant_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_user_current_diet_user_id ON user_current_diet(user_id);
CREATE INDEX idx_user_meal_log_user_date ON user_meal_log(user_id, date);
CREATE INDEX idx_weights_user_date ON weights(user_id, measured_at DESC);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_diet_recommendations_user_id ON diet_recommendations(user_id);
CREATE INDEX idx_leaderboard_metrics_period_metric ON leaderboard_metrics(period, metric);
CREATE INDEX idx_user_metrics_user_id ON user_metrics(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_current_diet ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meal_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can manage own favorites" ON favorites
    FOR ALL USING (auth.uid() = user_id);

-- User current diet policies
CREATE POLICY "Users can manage own current diet" ON user_current_diet
    FOR ALL USING (auth.uid() = user_id);

-- User meal log policies
CREATE POLICY "Users can manage own meal log" ON user_meal_log
    FOR ALL USING (auth.uid() = user_id);

-- Weights policies
CREATE POLICY "Users can manage own weights" ON weights
    FOR ALL USING (auth.uid() = user_id);

-- User badges policies
CREATE POLICY "Users can view own badges" ON user_badges
    FOR SELECT USING (auth.uid() = user_id);

-- Diet recommendations policies
CREATE POLICY "Users can view own recommendations" ON diet_recommendations
    FOR SELECT USING (auth.uid() = user_id);

-- User metrics policies
CREATE POLICY "Users can view own metrics" ON user_metrics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metrics" ON user_metrics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metrics" ON user_metrics
    FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for catalog tables (no RLS needed)
-- diets, diet_variants, meals, badges, leaderboard_metrics are publicly readable

-- Users metrics view policies (public read for leaderboard)
CREATE POLICY "Public can view users metrics for leaderboard" ON users_metrics_view
    FOR SELECT USING (true);

-- Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate user metrics
CREATE OR REPLACE FUNCTION calculate_user_metrics(
    p_user_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS VOID AS $$
DECLARE
    v_adherence_percentage NUMERIC(5,2);
    v_weight_lost_kg NUMERIC(5,2);
    v_meals_completed INTEGER;
    v_total_meals INTEGER;
BEGIN
    -- Calculate adherence percentage
    SELECT 
        COALESCE(
            ROUND(
                (COUNT(CASE WHEN completed THEN 1 END)::NUMERIC / 
                 NULLIF(COUNT(*), 0)::NUMERIC) * 100, 2
            ), 0
        )
    INTO v_adherence_percentage
    FROM user_meal_log
    WHERE user_id = p_user_id 
      AND date BETWEEN p_start_date AND p_end_date;

    -- Calculate weight lost
    SELECT 
        COALESCE(
            (SELECT weight_kg FROM weights 
             WHERE user_id = p_user_id AND measured_at = p_start_date) -
            (SELECT weight_kg FROM weights 
             WHERE user_id = p_user_id AND measured_at = p_end_date), 0
        )
    INTO v_weight_lost_kg;

    -- Count meals
    SELECT 
        COUNT(CASE WHEN completed THEN 1 END),
        COUNT(*)
    INTO v_meals_completed, v_total_meals
    FROM user_meal_log
    WHERE user_id = p_user_id 
      AND date BETWEEN p_start_date AND p_end_date;

    -- Insert or update metrics
    INSERT INTO user_metrics (
        user_id, period_start, period_end, adherence_percentage,
        weight_lost_kg, meals_completed, total_meals
    ) VALUES (
        p_user_id, p_start_date, p_end_date, v_adherence_percentage,
        v_weight_lost_kg, v_meals_completed, v_total_meals
    )
    ON CONFLICT (user_id, period_start, period_end)
    DO UPDATE SET
        adherence_percentage = EXCLUDED.adherence_percentage,
        weight_lost_kg = EXCLUDED.weight_lost_kg,
        meals_completed = EXCLUDED.meals_completed,
        total_meals = EXCLUDED.total_meals,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Sample data insertion (for testing)
-- This will be populated with real diet data later

-- Insert sample badges
INSERT INTO badges (slug, title, description, icon_name, criteria, category) VALUES
('first_week', 'First Week Complete', 'Complete your first week on a diet plan', 'calendar-check', '{"streak_days": 7}', 'consistency'),
('weight_loss_3kg', '3kg Milestone', 'Lose 3kg from your starting weight', 'trophy', '{"weight_lost_kg": 3}', 'milestone'),
('perfect_week', 'Perfect Week', 'Complete all meals for a full week', 'star', '{"adherence_percentage": 100}', 'achievement'),
('month_streak', 'Monthly Streak', 'Stay consistent for 30 days', 'fire', '{"streak_days": 30}', 'consistency');

-- Insert sample diets
INSERT INTO diets (slug, title, description, tags, category, difficulty, duration_weeks, popularity_score) VALUES
('low-carb', 'Low Carb Diet', 'A balanced low-carbohydrate diet for weight loss and health', ARRAY['low_carb', 'weight_loss', 'keto'], 'low_carb', 'beginner', 4, 85),
('mediterranean', 'Mediterranean Diet', 'Heart-healthy diet based on Mediterranean cuisine', ARRAY['mediterranean', 'heart_healthy', 'balanced'], 'balanced', 'beginner', 8, 92),
('vegetarian', 'Vegetarian Diet', 'Plant-based diet for health and sustainability', ARRAY['vegetarian', 'plant_based', 'health'], 'vegetarian', 'intermediate', 6, 78),
('keto', 'Ketogenic Diet', 'High-fat, very low-carb diet for rapid weight loss', ARRAY['keto', 'high_fat', 'weight_loss'], 'keto', 'advanced', 12, 88);

-- Insert sample diet variants
INSERT INTO diet_variants (diet_id, calories_total, macros, week_plan) VALUES
(
    (SELECT id FROM diets WHERE slug = 'low-carb'),
    1500,
    '{"protein": 120, "carbs": 100, "fat": 80}',
    '{"days": [{"meals": [{"name": "Breakfast", "calories": 400}, {"name": "Lunch", "calories": 500}, {"name": "Dinner", "calories": 600}]}]}'
),
(
    (SELECT id FROM diets WHERE slug = 'mediterranean'),
    1800,
    '{"protein": 100, "carbs": 200, "fat": 70}',
    '{"days": [{"meals": [{"name": "Breakfast", "calories": 450}, {"name": "Lunch", "calories": 600}, {"name": "Dinner", "calories": 750}]}]}'
);

-- 12. Announcements table (for admin-managed messages)
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  priority int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  expires_at timestamptz
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON profiles, favorites, user_current_diet, user_meal_log, weights, user_badges, diet_recommendations, user_metrics TO authenticated;
GRANT SELECT ON users_metrics_view TO anon, authenticated;
GRANT SELECT ON announcements TO anon, authenticated;
