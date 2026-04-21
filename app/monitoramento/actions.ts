'use server'

import { redirect } from "next/navigation";

export async function salvarAtendimento() {
  // Funcionalidade temporariamente desabilitada
  // O modulo de monitoramento sera reformulado no novo ATER
  redirect("/monitoramento");
}
