import Link from "next/link";

import { Badge, Button, Card } from "@/components/ui";
import { DATABASE_UNAVAILABLE_ERROR } from "@/lib/prisma-runtime";

export function DatabaseWarning({
  title = "Banco indisponível",
  description = DATABASE_UNAVAILABLE_ERROR,
  actionHref,
  actionLabel,
}: {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <Card className="border-amber-200 bg-amber-50/80">
      <div className="p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Badge variant="warning" className="w-fit">
              Banco indisponível
            </Badge>
            <div>
              <h2 className="text-lg font-semibold text-amber-950">{title}</h2>
              <p className="mt-1 text-sm text-amber-900">{description}</p>
            </div>
          </div>

          {actionHref && actionLabel ? (
            <Link href={actionHref}>
              <Button variant="secondary">{actionLabel}</Button>
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
