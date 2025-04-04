"use client";

import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { WalletProvider } from "@/hooks/use-wallet";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main-sidebar";
import NetworkStatus from "@/components/network-status";
import ChainSelector from "@/components/chain-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

function HeaderContent() {
  return (
    <>
      <div className="flex items-center gap-2">
        <SidebarTrigger>
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-primary"></div>
        </div>
        <span className="font-bold text-gradient">BlockVote</span>
      </div>
      <div className="flex items-center gap-3">
        <ChainSelector />
        <NetworkStatus />
      </div>
    </>
  );
}

function Header() {
  return (
    <header className="border-b border-primary/10 bg-black/20 backdrop-blur-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <HeaderContent />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-primary/10 py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto">Decentralized Voting Platform © {new Date().getFullYear()}</div>
    </footer>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { open, isMobile } = useSidebar();

  return (
    <div className="flex min-h-screen">
      {/* Only show sidebar when open on desktop, or always hide it on mobile (handled by Sheet) */}
      {open && !isMobile && (
        <div className="w-64 transition-all duration-300">
          <MainSidebar />
        </div>
      )}

      <div className="flex flex-1 flex-col transition-all duration-300">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <WalletProvider>
            <SidebarProvider>
              <AppLayout>{children}</AppLayout>
              <Toaster />
            </SidebarProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
