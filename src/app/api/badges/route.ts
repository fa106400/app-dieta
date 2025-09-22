import { NextRequest, NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabase-route";

export async function GET(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createRouteSupabaseClient(request, res);
    
    if (!supabase) {
      return NextResponse.json(
        { error: "Erro ao conectar ao banco de dados. Tente novamente." },
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

    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "all"; // "earned" or "all"

    if (type === "earned") {
      // Fetch earned badges
      const { data: earnedBadges, error: earnedError } = await supabase
        .from("badges")
        .select(`
          *,
          user_badges!inner(awarded_at)
        `)
        .eq("user_badges.user_id", user.id)
        .order("weight", { ascending: true });

      if (earnedError) {
        console.error("Error fetching earned badges:", earnedError);
        return NextResponse.json(
          { error: "Failed to fetch earned badges" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        badges: earnedBadges || []
      });
    } else {
      // Fetch all badges
      const { data: allBadges, error: allError } = await supabase
        .from("badges")
        .select(`
          *,
          user_badges(awarded_at)
        `)
        .eq("user_badges.user_id", user.id)
        .order("weight", { ascending: true });

      if (allError) {
        console.error("Error fetching all badges:", allError);
        return NextResponse.json(
          { error: "Failed to fetch badges" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        badges: allBadges || []
      });
    }

  } catch (error) {
    console.error("Error fetching badges:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
