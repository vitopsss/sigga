import path from "node:path";
import React from "react";
import { Document, renderToFile } from "@react-pdf/renderer";

import { BaselinePages } from "./generate-siggater-baseline-campos-pdf";
import { ProposalPages } from "./generate-siggater-revised-proposal-pdf";

const outputPath = path.resolve(
  process.cwd(),
  "docs",
  "acariquara",
  "contratacao",
  "Proposta_Tecnica_Comercial_SIGGATER_Web_Fase_1_Revisada_Adequada_Parecer_07_2026_Unificada.pdf",
);

function UnifiedProposalDocument() {
  return (
    <Document
      title="Proposta Técnica e Comercial Revisada - SIGGATER Web - Versão Unificada para Assinatura"
      author="João Victor Passos"
      subject="Proposta Técnica e Comercial Revisada com Anexo I - Baseline de Escopo em documento único"
      creator="SIGGA"
      producer="SIGGA"
    >
      <ProposalPages />
      <BaselinePages />
    </Document>
  );
}

async function main() {
  await renderToFile(<UnifiedProposalDocument />, outputPath);
  console.log(`PDF unificado gerado com sucesso em ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
