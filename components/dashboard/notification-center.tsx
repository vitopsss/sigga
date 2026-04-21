"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, BellRing, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

type NotificationSeverity = "critical" | "warning" | "info";

type AppNotification = {
  id: string;
  title: string;
  description: string;
  href: string;
  severity: NotificationSeverity;
  createdAt: string;
};

type NotificationsPayload = {
  notifications: AppNotification[];
  databaseUnavailable: boolean;
};

const READ_STORAGE_KEY = "sigga.notifications.read";

function getSeverityClasses(severity: NotificationSeverity) {
  if (severity === "critical") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (severity === "warning") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-sky-200 bg-sky-50 text-sky-700";
}

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [databaseUnavailable, setDatabaseUnavailable] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unsupported");
  const [reloadToken, setReloadToken] = useState(0);
  const initializedRef = useRef(false);
  const notifiedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem(READ_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setReadIds(parsed.filter((item): item is string => typeof item === "string"));
        }
      }
    } catch {
      // Ignore malformed local storage.
    }

    if ("Notification" in window) {
      setPermission(window.Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(readIds));
  }, [readIds]);

  useEffect(() => {
    let cancelled = false;

    async function loadNotifications() {
      try {
        const response = await fetch("/api/notifications", {
          cache: "no-store",
        });
        const payload = (await response.json()) as NotificationsPayload;

        if (cancelled) {
          return;
        }

        setNotifications(payload.notifications);
        setDatabaseUnavailable(payload.databaseUnavailable);

        if (!initializedRef.current) {
          notifiedIdsRef.current = new Set(payload.notifications.map((item) => item.id));
          initializedRef.current = true;
          return;
        }

        if (permission !== "granted" || typeof window === "undefined" || !("Notification" in window)) {
          return;
        }

        const unreadSet = new Set(readIds);
        const fresh = payload.notifications.filter(
          (item) => !notifiedIdsRef.current.has(item.id) && !unreadSet.has(item.id),
        );

        for (const item of fresh.slice(0, 2)) {
          new window.Notification(item.title, {
            body: item.description,
            icon: "/favicon.ico",
            tag: item.id,
          });
        }

        for (const item of payload.notifications) {
          notifiedIdsRef.current.add(item.id);
        }
      } catch {
        if (!cancelled) {
          setDatabaseUnavailable(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadNotifications();
    const intervalId = window.setInterval(() => {
      void loadNotifications();
    }, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
    }, [permission, readIds, reloadToken]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !readIds.includes(item.id)).length,
    [notifications, readIds],
  );

  function markAllAsRead() {
    setReadIds(Array.from(new Set([...readIds, ...notifications.map((item) => item.id)])));
  }

  function markAsRead(id: string) {
    setReadIds((current) => (current.includes(id) ? current : [...current, id]));
  }

  async function enableBrowserAlerts() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }

    const result = await window.Notification.requestPermission();
    setPermission(result);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50"
        aria-label="Abrir alertas"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 w-[360px] rounded-2xl border border-zinc-200 bg-white shadow-xl">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
            <div>
              <p className="font-semibold text-zinc-950">Alertas do sistema</p>
              <p className="text-xs text-zinc-500">Financeiro e ATER em tempo quase real</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="text-xs text-teal-600 hover:text-teal-700"
                disabled={notifications.length === 0}
              >
                Marcar tudo
              </button>
            </div>
          </div>

          <div className="border-b border-zinc-200 px-4 py-3">
            {permission === "unsupported" ? (
              <p className="text-xs text-zinc-500">Este navegador não suporta a API de notificações.</p>
            ) : permission === "granted" ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                <BellRing className="h-4 w-4" />
                Alertas do navegador ativos enquanto o app estiver aberto.
              </div>
            ) : (
              <Button type="button" variant="secondary" size="sm" onClick={enableBrowserAlerts}>
                <BellRing className="h-4 w-4" />
                Ativar alertas do navegador
              </Button>
            )}
          </div>

          {databaseUnavailable ? (
            <div className="border-b border-zinc-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
              Os alertas não puderam ser atualizados porque o banco está indisponível.
            </div>
          ) : null}

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-10 text-center text-sm text-zinc-500">Carregando alertas...</div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-zinc-500">Nenhum alerta ativo no momento.</div>
            ) : (
              notifications.map((item) => {
                const unread = !readIds.includes(item.id);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      markAsRead(item.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "block border-b border-zinc-100 px-4 py-3 transition-colors hover:bg-zinc-50",
                      unread && "bg-teal-50/40",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase", getSeverityClasses(item.severity))}>
                            {item.severity === "critical" ? "Crítico" : item.severity === "warning" ? "Atenção" : "Info"}
                          </span>
                          <span className="text-[11px] text-zinc-400">{formatTimestamp(item.createdAt)}</span>
                        </div>
                        <p className="text-sm font-medium text-zinc-950">{item.title}</p>
                        <p className="text-xs leading-5 text-zinc-500">{item.description}</p>
                      </div>
                      {unread ? <span className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-500" /> : null}
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          <div className="border-t border-zinc-200 p-3">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                initializedRef.current = false;
                setReloadToken((current) => current + 1);
              }}
              className="inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              <RefreshCcw className="h-4 w-4" />
              Atualizar alertas
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
