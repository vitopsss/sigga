import type { Metadata } from "next";

import { InstallAppButton } from "@/components/system/install-app-button";

import "./globals.css";

export const metadata: Metadata = {
  title: "SIGGA v5",
  description: "Plataforma integrada de gestao institucional - Instituto Acariquara",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-zinc-50 antialiased">
        {children}
        <InstallAppButton />
      </body>
    </html>
  );
}
