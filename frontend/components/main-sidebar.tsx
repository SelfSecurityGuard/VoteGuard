"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWallet } from "@/hooks/use-wallet"
import { Vote, PlusCircle, History, User, BookOpen, Settings, HelpCircle, Search } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function MainSidebar() {
  const pathname = usePathname()
  const { address, isConnected } = useWallet()
  const { isMobile } = useSidebar()
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration errors
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  // For mobile, we still use the Sheet component from the Sidebar
  if (isMobile) {
    return (
      <Sidebar>
        <SidebarHeader>
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search polls..."
                className="w-full pl-8 bg-primary/5 border-primary/20"
              />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"} tooltip="Home">
                <Link href="/">
                  <Vote className="h-4 w-4" />
                  <span>Active Polls</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/create"} tooltip="Create Poll">
                <Link href="/create">
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Poll</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {isConnected && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/my-polls"} tooltip="My Polls">
                    <Link href="/my-polls">
                      <User className="h-4 w-4" />
                      <span>My Polls</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/my-votes"} tooltip="My Votes">
                    <Link href="/my-votes">
                      <History className="h-4 w-4" />
                      <span>My Voting History</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>

          <SidebarSeparator />

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/documentation"} tooltip="Documentation">
                <Link href="/documentation">
                  <BookOpen className="h-4 w-4" />
                  <span>Documentation</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/help"} tooltip="Help">
                <Link href="/help">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help & Support</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <div className="p-2">
            {isConnected ? (
              <div className="flex items-center justify-between gap-2 rounded-md bg-primary/10 px-3 py-2">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Connected as</span>
                  <span className="text-sm font-medium">
                    {address?.substring(0, 6)}...{address?.substring(38)}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="h-8 border-primary/20 bg-primary/5 px-2">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground">
                Connect your wallet to see your polls and voting history
              </div>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
    )
  }

  // For desktop, we render a regular div with the sidebar content
  return (
    <div className="h-screen w-full border-r border-primary/10 bg-background overflow-hidden flex flex-col">
      <div className="flex h-14 items-center border-b border-primary/10 px-4">
        <div className="p-2 w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search polls..." className="w-full pl-8 bg-primary/5 border-primary/20" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <div className="px-3 py-2">
          <div className="mb-1">
            <Link
              href="/"
              className={`flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none ${pathname === "/" ? "bg-primary/10 text-primary" : "text-foreground"}`}
            >
              <Vote className="h-4 w-4" />
              <span>Active Polls</span>
            </Link>
          </div>
          <div className="mb-1">
            <Link
              href="/create"
              className={`flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none ${pathname === "/create" ? "bg-primary/10 text-primary" : "text-foreground"}`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Poll</span>
            </Link>
          </div>

          {isConnected && (
            <>
              <div className="mb-1">
                <Link
                  href="/my-polls"
                  className={`flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none ${pathname === "/my-polls" ? "bg-primary/10 text-primary" : "text-foreground"}`}
                >
                  <User className="h-4 w-4" />
                  <span>My Polls</span>
                </Link>
              </div>
              <div className="mb-1">
                <Link
                  href="/my-votes"
                  className={`flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none ${pathname === "/my-votes" ? "bg-primary/10 text-primary" : "text-foreground"}`}
                >
                  <History className="h-4 w-4" />
                  <span>My Voting History</span>
                </Link>
              </div>
            </>
          )}
        </div>

        <Separator className="my-2 bg-primary/10" />

        <div className="px-3 py-2">
          <div className="mb-1">
            <Link
              href="/documentation"
              className={`flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none ${pathname === "/documentation" ? "bg-primary/10 text-primary" : "text-foreground"}`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Documentation</span>
            </Link>
          </div>
          <div className="mb-1">
            <Link
              href="/help"
              className={`flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none ${pathname === "/help" ? "bg-primary/10 text-primary" : "text-foreground"}`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help & Support</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center border-t border-primary/10 p-4">
        <div className="w-full">
          {isConnected ? (
            <div className="flex items-center justify-between gap-2 rounded-md bg-primary/10 px-3 py-2">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Connected as</span>
                <span className="text-sm font-medium">
                  {address?.substring(0, 6)}...{address?.substring(38)}
                </span>
              </div>
              <Button variant="outline" size="sm" className="h-8 border-primary/20 bg-primary/5 px-2">
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              Connect your wallet to see your polls and voting history
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

