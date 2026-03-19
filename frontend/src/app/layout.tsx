import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Issue Tracker | Professional Task Management",
  description: "Minimal issue management platform with Gemini AI analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground h-screen overflow-hidden flex`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full relative lg:pl-64">
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
          <MobileBottomNav />
          <footer className="hidden md:flex h-12 px-8 border-t border-border bg-sidebar items-center justify-between text-[10px] text-text-muted uppercase tracking-widest font-bold z-20">
            <div className="flex items-center gap-4">
              <span>© {new Date().getFullYear()} Issue Tracker</span>
              <span className="w-1 h-1 bg-border rounded-full"></span>
              <span className="text-accent/80">v1.0.4-stable</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                System Operational
              </span>
              <span className="hidden md:inline text-white/20 hover:text-white transition-colors cursor-pointer tracking-tighter">
                Powered by Gemini AI • Build {new Date().getFullYear()}
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
