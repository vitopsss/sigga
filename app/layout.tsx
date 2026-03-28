import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Sidebar } from "./_components/sidebar";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIGGA v5",
  description: "Plataforma integrada de gestão institucional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[linear-gradient(180deg,_#f4f7f6_0%,_#ecf2f1_100%)] text-zinc-950">
        <div className="min-h-screen lg:pl-72">
          <Sidebar />
          <main className="h-screen overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
