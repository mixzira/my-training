import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { FloatingMenu } from "@/components/ui/floating-menu";
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
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
};

export const DEFAULT_THEME = "dark";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-theme={DEFAULT_THEME}
      className={`${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <main className="flex-1">
          <NavHistoryProvider>{children}</NavHistoryProvider>
        </main>
        <FloatingMenu />
      </body>
    </html>
  );
}
