import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DebateProvider } from "@/lib/store/debate-context";
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
  title: "AI 辩论 - The Arbitrator",
  description: "AI 驱动的双人辩论应用，支持人机对战",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DebateProvider>
          {children}
        </DebateProvider>
      </body>
    </html>
  );
}
