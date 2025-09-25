import { NextRequest, NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabase-route";

export async function POST(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createRouteSupabaseClient(request, res);
    
    if (!supabase) {
      return NextResponse.json({ error: "Erro ao conectar ao banco de dados. Tente novamente." }, { status: 500 });
    }
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { weight, date } = body;

    // Validate input
    if (!weight || typeof weight !== 'number' || weight < 30 || weight > 300) {
      return NextResponse.json({ error: "Peso inválido. Deve ser entre 30-300 kg" }, { status: 400 });
    }

    if (!date || typeof date !== 'string') {
      return NextResponse.json({ error: "Data inválida" }, { status: 400 });
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
      console.error("Erro ao inserir entrada de peso:", error);
      
      // Handle duplicate date error specifically
      if (error.code === '23505') {
        return NextResponse.json({ 
          error: "Você já tem uma entrada de peso para esta data. Por favor, edite a entrada existente em vez de inserir uma nova.",
          code: error.code 
        }, { status: 409 });
      }
      
      return NextResponse.json({ error: "Falha ao salvar entrada de peso" }, { status: 500 });
    }

    // Trigger badge validation for weight loss
    try {
      const badgeResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/badges/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "weight_loss",
          payload: { weight_kg: weight, measured_at: date }
        }),
      });

      if (badgeResponse.ok) {
        const badgeData = await badgeResponse.json();
        if (badgeData.newlyUnlocked && badgeData.newlyUnlocked.length > 0) {
          console.debug(`User ${user.id} unlocked ${badgeData.newlyUnlocked.length} badges`);
        }
      }
    } catch (badgeError) {
      console.error("Erro ao validar badges para perda de peso:", badgeError);
      // Don't fail the main operation if badge validation fails
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Erro no POST de peso:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createRouteSupabaseClient(request, res);
    
    if (!supabase) {
      return NextResponse.json({ error: "Erro ao conectar ao banco de dados. Tente novamente." }, { status: 500 });
    }
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Get weight entries for the user
    const { data, error } = await supabase
      .from("weights")
      .select("*")
      .eq("user_id", user.id)
      .order("measured_at", { ascending: true });

    if (error) {
      console.error("Erro ao buscar entradas de peso:", error);
      return NextResponse.json({ error: "Falha ao buscar entradas de peso" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Erro no GET de peso:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createRouteSupabaseClient(request, res);
    
    if (!supabase) {
      return NextResponse.json({ error: "Erro ao conectar ao banco de dados. Tente novamente." }, { status: 500 });
    }
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { id, weight, date } = body;

    // Validate input
    if (!id) {
      return NextResponse.json({ error: "ID da entrada é obrigatório" }, { status: 400 });
    }

    if (!weight || typeof weight !== 'number' || weight < 30 || weight > 300) {
      return NextResponse.json({ error: "Peso inválido. Deve ser entre 30-300 kg" }, { status: 400 });
    }

    if (!date || typeof date !== 'string') {
      return NextResponse.json({ error: "Data inválida" }, { status: 400 });
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
      console.error("Erro ao atualizar entrada de peso:", error);
      return NextResponse.json({ error: "Falha ao atualizar entrada de peso" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Erro no PUT de peso:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createRouteSupabaseClient(request, res);
    
    if (!supabase) {
      return NextResponse.json({ error: "Erro ao conectar ao banco de dados. Tente novamente." }, { status: 500 });
    }
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID da entrada é obrigatório" }, { status: 400 });
    }

    // Delete weight entry
    const { error } = await supabase
      .from("weights")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Erro ao deletar entrada de peso:", error);
      return NextResponse.json({ error: "Falha ao deletar entrada de peso" }, { status: 500 });
    }

    return NextResponse.json({ message: "Entrada de peso deletada com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro no DELETE de peso:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
