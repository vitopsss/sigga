import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { InstallAppButton } from "@/components/system/install-app-button";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const dynamic = "force-dynamic";

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
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-zinc-50 font-sans antialiased">
        {children}
        <InstallAppButton />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
