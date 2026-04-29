"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, House } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AppBackButtonProps {
  className?: string;
  forceShow?: boolean;
}

export function AppBackButton({ className, forceShow = false }: AppBackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || !pathname) {
    return null;
  }

  // Hide on home page unless forced
  if (pathname === "/" && !forceShow) {
    return null;
  }

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      router.push("/" + segments.slice(0, -1).join("/"));
    } else {
      router.push("/");
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleBack}
        className="rounded-full px-3 shadow-sm hover:bg-zinc-100"
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
          className="rounded-full px-3 shadow-sm hover:bg-zinc-100"
          aria-label="Ir para a página inicial"
        >
          <House className="h-4 w-4" />
          Início
        </Button>
      </Link>
    </div>
  );
}
