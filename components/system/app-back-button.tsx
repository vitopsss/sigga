"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, House } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui";

export function AppBackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [stablePathname, setStablePathname] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setStablePathname(pathname);
  }, [pathname]);

  const currentPath = stablePathname ?? pathname;

  const hiddenRouteMatchers = [
    /^\/$/,
    /^\/cadastros\/[^/]+$/,
    /^\/ater-sociobio\/tecnicos(?:\/novo|\/[^/]+\/editar)?$/,
    /^\/ater-sociobio\/familias\/nova$/,
    /^\/ater-sociobio\/familias\/[^/]+(?:\/editar)?$/,
    /^\/ater-sociobio\/atendimentos\/nova$/,
    /^\/ater-sociobio\/atendimentos\/[^/]+(?:\/editar)?$/,
  ];

  if (!mounted || !currentPath || currentPath !== pathname || hiddenRouteMatchers.some((matcher) => matcher.test(currentPath))) {
    return null;
  }

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
    <div className="fixed left-4 top-4 z-40 flex items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleBack}
        className="rounded-full px-3 shadow-md shadow-zinc-900/10"
        aria-label="Voltar"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      <Link href="/">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="rounded-full px-3 shadow-md shadow-zinc-900/10"
          aria-label="Ir para a página inicial"
        >
          <House className="h-4 w-4" />
          Início
        </Button>
      </Link>
    </div>
  );
}
