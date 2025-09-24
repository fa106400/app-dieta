import { NextRequest, NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabase-route";

export async function POST(request: NextRequest) {
  try {
    const { alias } = await request.json();

    if (!alias || typeof alias !== "string") {
      return NextResponse.json(
        { error: "Alias é obrigatório" },
        { status: 400 }
      );
    }

    // Validate alias format
    if (alias.length < 3 || alias.length > 20) {
      return NextResponse.json(
        { available: false, error: "Alias deve ter 3-20 caracteres" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(alias)) {
      return NextResponse.json(
        { available: false, error: "Alias pode conter apenas letras, números e underscores" },
        { status: 400 }
      );
    }

    // Create Supabase client
    const res = NextResponse.next();
    const supabase = createRouteSupabaseClient(request, res);

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase client não disponível" },
        { status: 503 }
      );
    }

    // Check if alias already exists
    const { data, error } = await supabase
      .from("profiles")
      .select("user_alias")
      .eq("user_alias", alias)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Erro ao verificar alias:", error);
      return NextResponse.json(
        { error: "Falha ao validar alias" },
        { status: 500 }
      );
    }

    // If no data found, alias is available
    const available = !data;

    return NextResponse.json({ available });

  } catch (error) {
    console.error("Erro no API de validate-alias:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
