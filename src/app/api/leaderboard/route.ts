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

    // Check if this is a mini-ranking request
    const { searchParams } = new URL(request.url);
    const isMini = searchParams.get('mini') === 'true';

    // Get all users with their ranks using window function
    const { data: allUsers, error: usersError } = await supabase
      .from("users_metrics_view")
      .select("user_id, exp, user_alias, avatar_url");

    if (usersError) {
      console.error("Erro ao buscar usuários:", usersError);
      return NextResponse.json(
        { error: "Falha ao carregar leaderboard" },
        { status: 500 }
      );
    }

    if (!allUsers || allUsers.length === 0) {
      return NextResponse.json({
        top5: [],
        currentUser: [],
        next4: [],
        totalUsers: 0,
      });
    }

    // Sort by exp descending and calculate ranks
    const sortedUsers = allUsers
      .filter(user => user.exp !== null)
      .sort((a, b) => (b.exp || 0) - (a.exp || 0))
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    // Get top 5
    const top5 = sortedUsers.slice(0, 5);

    // Find current user
    const currentUserIndex = sortedUsers.findIndex(leaderboardUser => leaderboardUser.user_id === user.id);
    const currentUser = currentUserIndex >= 0 ? [sortedUsers[currentUserIndex]] : [];

    // Get next 4 after current user (if not in top 5)
    let next4: typeof sortedUsers = [];
    if (currentUserIndex >= 5) {
      next4 = sortedUsers.slice(currentUserIndex + 1, currentUserIndex + 5);
    } else if (currentUserIndex >= 0) {
      // If current user is in top 5, get next 4 after top 5
      next4 = sortedUsers.slice(5, 9);
    }

    // Handle mini-ranking request
    if (isMini) {
      const currentUserData = currentUser.length > 0 ? currentUser[0] : null;
      const isCurrentUserTop = currentUserData && currentUserData.rank === 1;
      
      if (isCurrentUserTop) {
        // If current user is #1, return only them with a special message
        return NextResponse.json({
          topUser: currentUserData,
          currentUser: currentUserData,
          isCurrentUserTop: true,
          totalUsers: sortedUsers.length,
        });
      } else {
        // Return top user and current user
        const topUser = top5.length > 0 ? top5[0] : null;
        return NextResponse.json({
          topUser,
          currentUser: currentUserData,
          isCurrentUserTop: false,
          totalUsers: sortedUsers.length,
        });
      }
    }

    return NextResponse.json({
      top5,
      currentUser,
      next4,
      totalUsers: sortedUsers.length,
    });

  } catch (error) {
    console.error("Erro no API de leaderboard:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
