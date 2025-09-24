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
        { error: "Não autorizado" },
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
        console.error("Erro ao buscar badges ganhos:", earnedError);
        return NextResponse.json(
          { error: "Falha ao buscar badges ganhos" },
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
        console.error("Erro ao buscar todos os badges:", allError);
        return NextResponse.json(
          { error: "Falha ao buscar badges" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        badges: allBadges || []
      });
    }

  } catch (error) {
    console.error("Erro ao buscar badges:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
