"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  WalletCards,
  ShoppingCart,
  Building2,
  Package,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Painel Geral", icon: LayoutDashboard },
  { href: "/cadastros", label: "Cadastro Único", icon: Building2 },
  { href: "/ater-sociobio", label: "ATER Sociobio", icon: Leaf },
  { href: "/projetos", label: "Projetos", icon: BriefcaseBusiness },
  { href: "/borderos", label: "Borderôs", icon: WalletCards },
  { href: "/financeiro", label: "Lançamentos", icon: WalletCards },
  { href: "/compras", label: "Compras e Contratos", icon: ShoppingCart },
  { href: "/rh", label: "Recursos Humanos", icon: Users },
  { href: "/patrimonio", label: "Patrimônio", icon: Package },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-50 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b border-zinc-800 px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">SIGGA v5</p>
              <p className="text-sm font-medium text-white">Instituto Acariquara</p>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                    active
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      active ? "text-white" : "text-zinc-500 group-hover:text-teal-400"
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
        <button
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
