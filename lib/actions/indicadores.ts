"use server";

import { revalidatePath } from "next/cache";
import { AterSociobioService } from "@/lib/services/ater-sociobio.service";

export async function salvarIndicadoresUfpa(familiaId: string, payload: any) {
  try {
    if (payload.dataCadastro) {
      payload.dataCadastro = new Date(payload.dataCadastro);
    }
    
    // Parse numeric fields
    if (payload.valorBrutoProducaoUltimos12Meses) {
      payload.valorBrutoProducaoUltimos12Meses = Number(payload.valorBrutoProducaoUltimos12Meses);
    }
    if (payload.qtdVezesComeuMenos) {
      payload.qtdVezesComeuMenos = Number(payload.qtdVezesComeuMenos);
    }

    const { projeto, tecnico, dataCadastro, ...indicadoresData } = payload;
    
    // We update the FamiliaAter with the top level fields, and the rest to IndicadoresUfpa
    await AterSociobioService.upsertDiagnosticoUfpa(familiaId, {
      diagnostico: {
        projeto,
        tecnico,
        dataCadastro
      },
      indicadores: indicadoresData
    });

    revalidatePath(`/ater-sociobio/familias/${familiaId}`);
    return { data: true, error: null };
  } catch (error: any) {
    console.error(error);
    return { data: null, error: error.message };
  }
}
