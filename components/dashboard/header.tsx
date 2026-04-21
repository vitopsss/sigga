"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { NotificationCenter } from "@/components/dashboard/notification-center";

interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Header({ title, description, actions }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md">
      {/* Left - Title */}
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">{title}</h1>
        {description && <p className="text-sm text-zinc-500">{description}</p>}
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        {actions}

        {/* Search */}
        <div className="relative">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50"
          >
            <Search className="h-4 w-4" />
          </button>
          {searchOpen && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl">
              <input
                type="search"
                placeholder="Buscar no sistema..."
                className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                autoFocus
              />
            </div>
          )}
        </div>

        <NotificationCenter />
      </div>
    </header>
  );
}
