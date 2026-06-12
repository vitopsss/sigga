import { NextRequest, NextResponse } from "next/server";
import { BorderoService } from "@/lib/services/bordero.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const busca = searchParams.get("busca") || undefined;

    const favorecidos = await BorderoService.listFavorecidos(busca);

    return NextResponse.json(favorecidos);
  } catch (error) {
    console.error("[GET /api/favorecidos] Erro ao buscar favorecidos:", error);
    return NextResponse.json({ error: "Erro interno ao buscar favorecidos" }, { status: 500 });
  }
}
