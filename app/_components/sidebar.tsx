"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  FolderKanban,
  LayoutDashboard,
  LineChart,
  PiggyBank,
  Users,
  WalletCards,
} from "lucide-react";

const navigation: Array<{
  href: string;
  label: string;
  icon: LucideIcon;
}> = [
  { href: "/", label: "Painel Geral", icon: LayoutDashboard },
  { href: "/cadastros", label: "Cadastro Único", icon: BadgeCheck },
  { href: "/projetos", label: "Gestão de Projetos", icon: FolderKanban },
  { href: "/financeiro", label: "Financeiro e Compras", icon: WalletCards },
  { href: "/rh", label: "Recursos Humanos", icon: Users },
  { href: "/monitoramento", label: "Monitoramento ATER", icon: LineChart },
  { href: "/fundos", label: "Gestão de Fundos", icon: PiggyBank },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-white/70 bg-zinc-950 text-zinc-50 lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 px-6 py-6">
          <Link href="/" className="block">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-300">
              SIGGA v5
            </p>
            <h1 className="mt-3 text-xl font-semibold tracking-tight text-white">
              Gestão integrada da operação.
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Navegação unificada para cadastros, projetos, finanças, RH e fundos.
            </p>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-5">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const active = isActivePath(pathname, item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-white text-zinc-950 shadow-lg shadow-black/10"
                        : "text-zinc-300 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                        active
                          ? "bg-teal-100 text-teal-700"
                          : "bg-white/6 text-zinc-400 group-hover:bg-white/12 group-hover:text-teal-300"
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-6 py-5">
          <div className="rounded-[1.5rem] border border-teal-400/20 bg-teal-400/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-300">
              Ambiente
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-200">
              Painel operacional alinhado ao novo schema e aos módulos consolidados do sistema.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
