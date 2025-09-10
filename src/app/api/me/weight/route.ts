import { NextRequest, NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabase-route";

export async function POST(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createRouteSupabaseClient(request, res);
    
    if (!supabase) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 500 });
    }
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { weight, date } = body;

    // Validate input
    if (!weight || typeof weight !== 'number' || weight < 30 || weight > 300) {
      return NextResponse.json({ error: "Invalid weight. Must be between 30-300 kg" }, { status: 400 });
    }

    if (!date || typeof date !== 'string') {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    // Insert weight entry
    const { data, error } = await supabase
      .from("weights")
      .insert({
        user_id: user.id,
        weight_kg: weight,
        measured_at: date
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting weight entry:", error);
      
      // Handle duplicate date error specifically
      if (error.code === '23505') {
        return NextResponse.json({ 
          error: "You already have a weight entry for this date. Please edit the existing entry instead.",
          code: error.code 
        }, { status: 409 });
      }
      
      return NextResponse.json({ error: "Failed to save weight entry" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Error in weight POST:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createRouteSupabaseClient(request, res);
    
    if (!supabase) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 500 });
    }
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get weight entries for the user
    const { data, error } = await supabase
      .from("weights")
      .select("*")
      .eq("user_id", user.id)
      .order("measured_at", { ascending: true });

    if (error) {
      console.error("Error fetching weight entries:", error);
      return NextResponse.json({ error: "Failed to fetch weight entries" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error in weight GET:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createRouteSupabaseClient(request, res);
    
    if (!supabase) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 500 });
    }
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, weight, date } = body;

    // Validate input
    if (!id) {
      return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
    }

    if (!weight || typeof weight !== 'number' || weight < 30 || weight > 300) {
      return NextResponse.json({ error: "Invalid weight. Must be between 30-300 kg" }, { status: 400 });
    }

    if (!date || typeof date !== 'string') {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    // Update weight entry
    const { data, error } = await supabase
      .from("weights")
      .update({
        weight_kg: weight,
        measured_at: date
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating weight entry:", error);
      return NextResponse.json({ error: "Failed to update weight entry" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error in weight PUT:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createRouteSupabaseClient(request, res);
    
    if (!supabase) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 500 });
    }
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
    }

    // Delete weight entry
    const { error } = await supabase
      .from("weights")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting weight entry:", error);
      return NextResponse.json({ error: "Failed to delete weight entry" }, { status: 500 });
    }

    return NextResponse.json({ message: "Weight entry deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in weight DELETE:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
