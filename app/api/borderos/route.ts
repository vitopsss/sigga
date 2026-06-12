import { NextRequest, NextResponse } from "next/server";
import { BorderoInputDTO, BorderoService, LancamentoInputDTO } from "@/lib/services/bordero.service";

type BorderoApiInput = Omit<Partial<BorderoInputDTO>, "data"> & {
  data?: string | Date | null;
};

type LancamentoApiInput = Omit<Partial<LancamentoInputDTO>, "dataVencimento"> & {
  dataVencimento?: string | Date | null;
};

interface CreateBorderoBody {
  bordero?: BorderoApiInput;
  lancamentos?: LancamentoApiInput[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const busca = searchParams.get("busca") || undefined;
    const projetoId = searchParams.get("projetoId") || undefined;
    const status = searchParams.get("status") || undefined;

    const [borderos, projetos] = await BorderoService.list({ busca, projetoId, status });

    return NextResponse.json({ borderos, projetos });
  } catch (error) {
    console.error("[GET /api/borderos] Erro ao listar borderôs:", error);
    return NextResponse.json({ error: "Erro interno ao listar borderôs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateBorderoBody;
    const { bordero, lancamentos } = body;

    if (!bordero || !bordero.idBordero || !bordero.projetoId) {
      return NextResponse.json({ error: "Dados do borderô incompletos." }, { status: 400 });
    }

    if (!lancamentos || !Array.isArray(lancamentos) || lancamentos.length === 0) {
      return NextResponse.json({ error: "O borderô deve conter pelo menos um lançamento." }, { status: 400 });
    }

    // Convertendo datas de string (ISO) para objetos Date do JavaScript
    const borderoDTO = {
      ...bordero,
      idBordero: bordero.idBordero,
      projetoId: bordero.projetoId,
      tipoBordero: bordero.tipoBordero ?? null,
      data: new Date(bordero.data || new Date()),
    } satisfies BorderoInputDTO;

    const lancamentosDTO: LancamentoInputDTO[] = lancamentos.map((l) => ({
      ...l,
      nsu: l.nsu ?? "",
      favorecidoId: l.favorecidoId ?? "",
      fase: l.fase ?? null,
      etapa: l.etapa ?? null,
      valor: Number(l.valor ?? 0),
      dataVencimento: new Date(l.dataVencimento || new Date()),
      formaPagamento: l.formaPagamento ?? null,
    }));

    const novoBorderoId = await BorderoService.create(borderoDTO, lancamentosDTO);

    return NextResponse.json({ id: novoBorderoId, message: "Borderô criado com sucesso!" }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/borderos] Erro ao criar borderô:", error);
    const message = error instanceof Error ? error.message : "Erro interno ao criar borderô";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
