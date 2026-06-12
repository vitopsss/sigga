"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeft, House } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AppBackButtonProps {
  className?: string;
  forceShow?: boolean;
}

function getParentHref(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length > 1 ? `/${segments.slice(0, -1).join("/")}` : "/";
}

function getSiggaterBackHref(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const section = segments[1];
  const third = segments[2];

  if (segments.length <= 2) {
    return "/ater-sociobio";
  }

  if (["dashboard", "controle", "fomento", "indices"].includes(section)) {
    return "/ater-sociobio";
  }

  if (["familias", "organizacoes", "atendimentos"].includes(section)) {
    if (third === "nova") return `/ater-sociobio/${section}`;
    if (segments.length === 3) return `/ater-sociobio/${section}`;
    return `/ater-sociobio/${section}/${third}`;
  }

  if (section === "tecnicos" || section === "extensionistas") {
    if (third === "novo") return "/ater-sociobio/tecnicos";
    if (segments.length >= 4) return "/ater-sociobio/tecnicos";
    return "/ater-sociobio";
  }

  return getParentHref(pathname);
}

function getSafeReturnHref(value: string | null) {
  if (!value?.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (!value.startsWith("/ater-sociobio")) return null;
  return value;
}

export function AppBackButton({ className, forceShow = false }: AppBackButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || !pathname) {
    return null;
  }

  if (pathname === "/" && !forceShow) {
    return null;
  }

  const isSiggater = pathname.startsWith("/ater-sociobio");
  const returnHref = isSiggater ? getSafeReturnHref(searchParams.get("from")) : null;
  const backHref = returnHref ?? (isSiggater ? getSiggaterBackHref(pathname) : getParentHref(pathname));
  const homeHref = isSiggater ? "/ater-sociobio" : "/";
  const homeLabel = isSiggater ? "SIGGATER" : "Início";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link href={backHref}>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="rounded-full px-3 shadow-sm hover:bg-zinc-100"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </Link>

      <Link href={homeHref}>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="rounded-full px-3 shadow-sm hover:bg-zinc-100"
          aria-label={isSiggater ? "Ir para o início do SIGGATER" : "Ir para a página inicial"}
        >
          <House className="h-4 w-4" />
          {homeLabel}
        </Button>
      </Link>
    </div>
  );
}
