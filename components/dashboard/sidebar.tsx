"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  KeyRound,
  LayoutDashboard,
  Leaf,
  LockKeyhole,
  LogOut,
  Package,
  ShoppingCart,
  Users,
  WalletCards,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { getSiggaterRoleLabel, type SiggaterSessionPayload } from "@/lib/auth/siggater-session";

const navigation = [
  { href: "/", label: "Painel Geral", icon: LayoutDashboard },
  { href: "/ater-sociobio", label: "SIGGATER", icon: Leaf },
  { href: "/cadastros", label: "Cadastro Único", icon: Building2 },
  { href: "/projetos", label: "Projetos", icon: BriefcaseBusiness },
  { href: "/borderos", label: "Borderôs", icon: WalletCards },
  { href: "/financeiro", label: "Lançamentos", icon: WalletCards },
  { href: "/compras", label: "Compras e Contratos", icon: ShoppingCart },
  { href: "/rh", label: "Recursos Humanos", icon: Users },
  { href: "/patrimonio", label: "Patrimônio", icon: Package },
];

const siggaterNavigation = [
  { href: "/ater-sociobio", label: "Início", icon: Leaf },
  { href: "/ater-sociobio/dashboard", label: "Métricas", icon: BarChart3 },
  { href: "/ater-sociobio/familias", label: "UFPAs", icon: Users },
  { href: "/ater-sociobio/organizacoes", label: "Organizações", icon: Building2 },
  { href: "/ater-sociobio/atendimentos", label: "Atendimentos", icon: ClipboardList },
  { href: "/ater-sociobio/tecnicos", label: "Técnicos", icon: Users },
  { href: "/ater-sociobio/acessos", label: "Acessos", icon: KeyRound },
  { href: "/ater-sociobio/minha-senha", label: "Minha senha", icon: LockKeyhole },
];

type SidebarScope = "default" | "siggater";

export function Sidebar({
  scope = "default",
  user,
}: {
  scope?: SidebarScope;
  user?: Pick<SiggaterSessionPayload, "email" | "name" | "role"> | null;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const items = scope === "siggater" ? siggaterNavigation : navigation;
  const homeHref = scope === "siggater" ? "/ater-sociobio" : "/";

  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        "peer fixed left-0 top-0 z-40 flex h-full flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-50 transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex h-16 items-center border-b border-zinc-800 px-4">
        <Link href={homeHref} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                {scope === "siggater" ? "SIGGATER Web" : "SIGGA v5"}
              </p>
              <p className="text-sm font-bold text-white">
                {scope === "siggater" ? "ATER Acariquara" : "Instituto Acariquara"}
              </p>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const isHome = item.href === "/" || item.href === "/ater-sociobio";
            const active = isHome ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all",
                    active
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      active ? "text-white" : "text-zinc-500 group-hover:text-emerald-400",
                    )}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-zinc-800 p-3">
        {scope === "siggater" && user && !collapsed && (
          <div className="mb-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="truncate text-sm font-bold text-white">{user.name || user.email}</p>
            <p className="mt-1 truncate text-xs font-medium text-zinc-400">{getSiggaterRoleLabel(user.role)}</p>
          </div>
        )}
        {scope === "siggater" && user && (
          <a
            href="/logout"
            className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Sair</span>}
          </a>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>
    </aside>
  );
}
