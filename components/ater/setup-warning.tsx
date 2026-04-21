import { Card } from "@/components/ui";
import { ATER_SETUP_ERROR } from "@/lib/ater-runtime";

type AterSetupWarningProps = {
  className?: string;
};

export function AterSetupWarning({ className }: AterSetupWarningProps) {
  return (
    <Card className={["border-amber-200 bg-amber-50 p-4", className].filter(Boolean).join(" ")}>
      <p className="text-sm font-semibold text-amber-950">Banco do módulo ATER ainda não está pronto.</p>
      <p className="mt-1 text-sm text-amber-800">{ATER_SETUP_ERROR}</p>
    </Card>
  );
}
