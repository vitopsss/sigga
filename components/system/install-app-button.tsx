"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Smartphone } from "lucide-react";

import { Button } from "@/components/ui";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    installed: true,
    isIos: false,
    isSafari: false,
    isMobile: false,
  });

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;

    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIos = /iphone|ipad|ipod/.test(userAgent);
      const isSafari = /safari/.test(userAgent) && !/chrome|android/.test(userAgent);
      const isMobile = /android|iphone|ipad|ipod/.test(userAgent);

      const standaloneMedia = window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
      const standaloneNavigator = "standalone" in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
      const installed = standaloneMedia || standaloneNavigator;

      timeoutId = window.setTimeout(() => {
        if (!cancelled) {
          setDeviceInfo({ installed, isIos, isSafari, isMobile });
        }
      }, 0);
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setDeviceInfo((current) => ({ ...current, installed: true }));
      setDeferredPrompt(null);
      setShowHelp(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const helpText = useMemo(() => {
    if (deviceInfo.isIos && deviceInfo.isSafari) {
      return "No Safari do iPhone/iPad, toque em Compartilhar e depois em Adicionar à Tela de Início.";
    }

    return "Se o navegador não mostrar o prompt, use o menu do Chrome ou Edge e escolha Instalar aplicativo.";
  }, [deviceInfo.isIos, deviceInfo.isSafari]);

  if (deviceInfo.installed) {
    return null;
  }

  // Only show the button if we actually have a prompt, OR if it's a mobile device (where manual "Add to Home Screen" is common).
  // This prevents desktop browsers without PWA support from showing a useless button.
  if (!deferredPrompt && !deviceInfo.isMobile) {
    return null;
  }

  async function handleInstall() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeviceInfo((current) => ({ ...current, installed: true }));
      }
      setDeferredPrompt(null);
      return;
    }

    setShowHelp((current) => !current);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3">
      {showHelp ? (
        <div className="w-80 rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-zinc-950">Instalar SIGGA v5</p>
              <p className="text-sm leading-6 text-zinc-600">{helpText}</p>
              <button type="button" onClick={() => setShowHelp(false)} className="text-xs font-medium text-teal-600 hover:text-teal-700">
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Button type="button" variant="primary" onClick={handleInstall} className="rounded-full px-5 shadow-xl shadow-teal-600/25">
        <Download className="h-4 w-4" />
        Instalar app
      </Button>
    </div>
  );
}
