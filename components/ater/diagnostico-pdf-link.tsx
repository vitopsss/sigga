"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { DiagnosticoReportPdf } from "@/components/ater/diagnostico-report-pdf";
import { useState, useEffect } from "react";
import type { FamiliaWithCadastro } from "@/lib/services/ater-sociobio.service";

export function DiagnosticoPdfLink({ familia }: { familia: FamiliaWithCadastro }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    let mounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (mounted) setIsClient(true);
    return () => { mounted = false; };
  }, []);

  if (!isClient) {
    return (
      <Button variant="secondary" size="sm" disabled>
        Carregando PDF...
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<DiagnosticoReportPdf familia={familia} />}
      fileName={`Diagnostico_${familia.nomeFamilia.replace(/\s+/g, "_")}.pdf`}
    >
      {({ loading }) => (
        <Button variant="secondary" size="sm" disabled={loading}>
          {loading ? "Gerando..." : "Baixar Diagnóstico PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
