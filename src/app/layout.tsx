import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { FloatingMenu } from "@/components/ui/floating-menu";

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
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <main className="flex-1">{children}</main>
        <FloatingMenu />
      </body>
    </html>
  );
}
