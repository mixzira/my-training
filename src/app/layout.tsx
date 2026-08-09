import { SerwistProvider } from "@serwist/turbopack/react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { ServiceWorkerCleanup } from "@/components/sw-cleanup";
import { FloatingMenu } from "@/components/ui/floating-menu";
import { Header } from "@/components/ui/header";
import { NavHistoryProvider } from "@/components/ui/nav-history";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "my·training",
  description: "Criar, gerenciar e mapear meus treinos.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "my·training",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
};

export const DEFAULT_THEME = "dark";

const DEV = process.env.NODE_ENV === "development";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-theme={DEFAULT_THEME}
      className={`${inter.variable} h-full`}
    >
      <body className="flex min-h-dvh flex-col">
        <SerwistProvider swUrl="/serwist/sw.js" disable={DEV}>
          <main className="flex flex-1 flex-col">
            <NavHistoryProvider>
              <Header />
              {children}
            </NavHistoryProvider>
          </main>
          <FloatingMenu />
          {DEV ? <ServiceWorkerCleanup /> : null}
        </SerwistProvider>
      </body>
    </html>
  );
}
