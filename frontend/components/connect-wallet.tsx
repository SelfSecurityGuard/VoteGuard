"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Wallet, LogOut, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ConnectWallet() {
  const { address, isConnected, connect, disconnect } = useWallet()

  return (
    <>
      {isConnected ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-primary/20 bg-primary/5">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              {address?.substring(0, 6)}...{address?.substring(38)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-primary/20 bg-background/95 backdrop-blur-sm">
            <DropdownMenuLabel>Wallet Connected</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(address || "")}>
              Copy Address
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(`https://etherscan.io/address/${address}`, "_blank")}>
              View on Explorer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={disconnect} className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" /> Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={connect} className="bg-primary hover:bg-primary/90">
          <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      )}
    </>
  )
}

