"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Network, Check } from "lucide-react"

// Define supported blockchain networks
const networks = [
  { id: 42220, name: "Celo", icon: "celo.svg" },
  { id: 44787, name: "Celo Alfajores", icon: "celoalfajores.svg" },
  { id: 1, name: "Ethereum", icon: "ethereum.svg" },
  { id: 137, name: "Polygon", icon: "polygon.svg" },
  { id: 42161, name: "Arbitrum", icon: "arbitrum.svg" },
  { id: 10, name: "Optimism", icon: "optimism.svg" },
  { id: 56, name: "BNB Chain", icon: "bnb.svg" },
]

// Update the component to be more compact for the header
export default function ChainSelector() {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0])

  // Listen for network changes in MetaMask
  useEffect(() => {
    const handleChainChanged = (chainIdHex: string) => {
      const chainId = Number.parseInt(chainIdHex, 16)
      const network = networks.find((n) => n.id === chainId)

      if (network) {
        setSelectedNetwork(network)
      } else {
        // If the network is not in our list, we could show "Unknown Network"
        // or add it dynamically
        console.log(`Switched to unsupported network: ${chainId}`)
      }
    }

    // Check current network on load
    const checkCurrentNetwork = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const chainIdHex = await window.ethereum.request({ method: "eth_chainId" })
          handleChainChanged(chainIdHex)
        } catch (error) {
          console.error("Error getting chain ID:", error)
        }
      }
    }

    checkCurrentNetwork()

    // Add event listener for chain changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("chainChanged", handleChainChanged)
    }

    // Cleanup
    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const handleNetworkChange = async (network: (typeof networks)[0]) => {
    try {
      // Request network change in MetaMask
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${network.id.toString(16)}` }],
      })

      // The state will be updated by the chainChanged event listener
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        console.log(`Add network ${network.name} to MetaMask`)
        // Here you could implement logic to add the network to MetaMask
      }
      console.error(`Error switching to ${network.name}:`, error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-primary/20 bg-primary/5 px-2">
          <Network className="h-3 w-3 text-primary mr-1" />
          <span className="text-xs">{selectedNetwork.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 border-primary/20 bg-background/95 backdrop-blur-sm">
        {networks.map((network) => (
          <DropdownMenuItem
            key={network.id}
            className={`flex items-center justify-between ${selectedNetwork.id === network.id ? "bg-primary/10" : ""}`}
            onClick={() => handleNetworkChange(network)}
          >
            <span>{network.name}</span>
            {selectedNetwork.id === network.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

