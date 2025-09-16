import { NextRequest, NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabase-route";

export async function GET(request: NextRequest) {
  try {
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

    // Get all users with their ranks using window function
    const { data: allUsers, error: usersError } = await supabase
      .from("users_metrics_view")
      .select("user_id, exp, user_alias, avatar_url");

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { error: "Unable to load leaderboard" },
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

    return NextResponse.json({
      top5,
      currentUser,
      next4,
      totalUsers: sortedUsers.length,
    });

  } catch (error) {
    console.error("Error in leaderboard API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
