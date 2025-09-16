import { NextRequest, NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabase-route";
import type { Database, Json } from "../../../../../supabase";

type BadgeCriteria = {
  event: string;
  operator?: "gte" | "gt" | "eq" | "lte" | "lt";
  count?: number;
  distinct?: boolean;
  threshold?: number;
  unit?: string;
  duration_days?: number;
  window_days?: number;
  target?: string | number | null;
  description?: string;
  meta?: Record<string, unknown>;
};

type Badge = Database["public"]["Tables"]["badges"]["Row"];

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    
    // Handle both single event and batch events
    let events: Array<{ event: string; payload: Record<string, unknown> }>;
    
    if (requestBody.events && Array.isArray(requestBody.events)) {
      // Batch mode: multiple events
      events = requestBody.events;
    } else if (requestBody.event) {
      // Single event mode (backward compatibility)
      events = [{ event: requestBody.event, payload: requestBody.payload || {} }];
    } else {
      return NextResponse.json(
        { error: "Event or events array is required" },
        { status: 400 }
      );
    }
    
    if (events.length === 0) {
      return NextResponse.json(
        { error: "At least one event is required" },
        { status: 400 }
      );
    }

    const res = NextResponse.next();
    const supabase = createRouteSupabaseClient(request, res);
    
    if (!supabase) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 }
      );
    }
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Process all events and collect all newly unlocked badges
    const allNewlyUnlocked: Badge[] = [];
    
    for (const { event, payload } of events) {
      const eventBadges = await validateBadgesForUser(supabase, user.id, event, payload);
      allNewlyUnlocked.push(...eventBadges);
    }
    
    // Remove duplicates based on badge ID
    const uniqueNewlyUnlocked = allNewlyUnlocked.filter((badge, index, self) => 
      index === self.findIndex(b => b.id === badge.id)
    );
    
    return NextResponse.json({
      success: true,
      newlyUnlocked: uniqueNewlyUnlocked.length,
      count: uniqueNewlyUnlocked.length,
      badges: uniqueNewlyUnlocked // Return the actual badge data for notifications
    });

  } catch (error) {
    console.error("Error validating badges:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function validateBadgesForUser(
  supabase: NonNullable<ReturnType<typeof createRouteSupabaseClient>>,
  userId: string,
  event: string,
  _payload: Record<string, unknown> = {}
): Promise<Badge[]> {
  // 1. Fetch candidate badges for this event
  const { data: badges, error: badgesError } = await supabase
    .from("badges")
    .select("id, criteria, title, description, slug")
    .eq("criteria->>event", event);

  if (badgesError) {
    console.error("Error fetching badges:", badgesError);
    return [];
  }

  if (!badges || badges.length === 0) {
    return [];
  }

  const newlyUnlocked: Badge[] = [];

  for (const badge of badges) {
    try {
      const criteria: BadgeCriteria = badge.criteria as BadgeCriteria;
      const meets = await evaluateCriteria(supabase, userId, criteria, _payload);
      
      if (meets) {
        // Check if user already has this badge
        const { data: existingBadge, error: checkError } = await supabase
          .from("user_badges")
          .select("badge_id")
          .eq("user_id", userId)
          .eq("badge_id", badge.id)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          console.error("Error checking existing badge:", checkError);
          continue;
        }

        if (!existingBadge) {
          // Award the badge
          const { error: insertError } = await supabase
            .from("user_badges")
            .insert({
              user_id: userId,
              badge_id: badge.id,
              awarded_at: new Date().toISOString(),
              meta: {
                method: event,
                event: event,
                value: _payload
              } as Json
            });

          if (insertError) {
            console.error("Error inserting user badge:", insertError);
            continue;
          }

          newlyUnlocked.push(badge as Badge);
        }
      }
    } catch (error) {
      console.error(`Error evaluating badge ${badge.id}:`, error);
      continue;
    }
  }

  return newlyUnlocked;
}

async function evaluateCriteria(
  supabase: NonNullable<ReturnType<typeof createRouteSupabaseClient>>,
  userId: string,
  criteria: BadgeCriteria,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  payload: Record<string, unknown>
): Promise<boolean> {
  const operator = criteria.operator || "gte";
  
  try {
    switch (criteria.event) {
      case "diet_chosen":
        return await evaluateDietChosen(supabase, userId, criteria, operator);
      
      case "diet_switches":
        return await evaluateDietSwitches(supabase, userId, criteria, operator);
      
      case "diet_duration":
        return await evaluateDietDuration(supabase, userId, criteria, operator);
      
      case "shopping_exported":
        return await evaluateShoppingExported(supabase, userId, criteria, operator);
      
      case "weight_loss":
        return await evaluateWeightLoss(supabase, userId, criteria, operator);
      
      case "experience":
        return await evaluateExperience(supabase, userId, criteria, operator);
      
      default:
        console.warn(`Unknown event type: ${criteria.event}`);
        return false;
    }
  } catch (error) {
    console.error(`Error evaluating criteria for event ${criteria.event}:`, error);
    return false;
  }
}

async function evaluateDietChosen(
  supabase: NonNullable<ReturnType<typeof createRouteSupabaseClient>>,
  userId: string,
  criteria: BadgeCriteria,
  operator: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_current_diet")
    .select("id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error evaluating diet_chosen:", error);
    return false;
  }

  const count = data?.length || 0;
  return compareValues(count, criteria.count || 1, operator);
}

async function evaluateDietSwitches(
  supabase: NonNullable<ReturnType<typeof createRouteSupabaseClient>>,
  userId: string,
  criteria: BadgeCriteria,
  operator: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_current_diet")
    .select("id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error evaluating diet_switches:", error);
    return false;
  }

  const count = data?.length || 0;
  return compareValues(count, criteria.count || 1, operator);
}

async function evaluateDietDuration(
  supabase: NonNullable<ReturnType<typeof createRouteSupabaseClient>>,
  userId: string,
  criteria: BadgeCriteria,
  operator: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_current_diet")
    .select("started_at")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single();

  if (error || !data?.started_at) {
    return false;
  }

  const startedAt = new Date(data.started_at);
  const now = new Date();
  const daysSince = Math.floor((now.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24));
  
  return compareValues(daysSince, criteria.duration_days || 7, operator);
}

async function evaluateShoppingExported(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _supabase: NonNullable<ReturnType<typeof createRouteSupabaseClient>>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _criteria: BadgeCriteria,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _operator: string
): Promise<boolean> {
  // For now, we'll use a simple count from user_badges meta
  // In a real implementation, you might have a separate table for tracking exports
  // This is a simplified implementation - in reality you'd track exports separately
  return true; // For MVP, we'll award this badge when the validation is called
}

async function evaluateWeightLoss(
  supabase: NonNullable<ReturnType<typeof createRouteSupabaseClient>>,
  userId: string,
  criteria: BadgeCriteria,
  operator: string
): Promise<boolean> {
  // Get user's starting weight from profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("weight_start_kg")
    .eq("user_id", userId)
    .single();

  if (profileError || !profile) {
    return false;
  }

  // Get minimum weight from weight entries
  const { data: weights, error: weightsError } = await supabase
    .from("weights")
    .select("weight_kg")
    .eq("user_id", userId)
    .order("weight_kg", { ascending: true })
    .limit(1);

  if (weightsError || !weights || weights.length === 0) {
    return false;
  }

  const weightLoss = profile.weight_start_kg - weights[0].weight_kg;
  return compareValues(weightLoss, criteria.threshold || 1, operator);
}

async function evaluateExperience(
  supabase: NonNullable<ReturnType<typeof createRouteSupabaseClient>>,
  userId: string,
  criteria: BadgeCriteria,
  operator: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_metrics")
    .select("exp")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return false;
  }

  return compareValues(data.exp, criteria.threshold || 1000, operator);
}

function compareValues(actual: number, expected: number, operator: string): boolean {
  switch (operator) {
    case "gte":
      return actual >= expected;
    case "gt":
      return actual > expected;
    case "eq":
      return actual === expected;
    case "lte":
      return actual <= expected;
    case "lt":
      return actual < expected;
    default:
      return actual >= expected;
  }
}
