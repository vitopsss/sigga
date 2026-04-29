"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { NotificationCenter } from "@/components/dashboard/notification-center";
import { AppBackButton } from "@/components/system/app-back-button";
import { usePathname } from "next/navigation";

interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  showBack?: boolean;
}

export function Header({ title, description, actions, showBack }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  // Se showBack não for passado, mostramos se não for a home
  const shouldShowBack = showBack ?? pathname !== "/";

  return (
    <header className="sticky top-0 z-30 flex h-20 flex-col justify-center border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md lg:h-24 lg:px-8">
      <div className="flex items-center justify-between">
        {/* Left - Title & Back */}
        <div className="flex items-center gap-4">
          {shouldShowBack && (
            <AppBackButton className="mr-2 hidden lg:flex" />
          )}
          <div>
            <div className="flex items-center gap-3">
              {shouldShowBack && (
                <AppBackButton className="lg:hidden" />
              )}
              <h1 className="text-xl font-semibold text-zinc-950 lg:text-2xl">{title}</h1>
            </div>
            {description && <p className="text-sm text-zinc-500 lg:text-base">{description}</p>}
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <div className="hidden items-center gap-2 sm:flex">
            {actions}
          </div>

          {/* Search */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 lg:h-11 lg:w-11"
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
      </div>
      
      {/* Mobile Actions */}
      {actions && (
        <div className="mt-2 flex sm:hidden">
          {actions}
        </div>
      )}
    </header>
  );
}
