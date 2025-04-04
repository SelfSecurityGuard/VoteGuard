"use client";

import { useWallet } from "@/hooks/use-wallet";

export default function NetworkStatus() {
  const { isConnected } = useWallet();

  return (
    <div className="text-xs text-muted-foreground flex items-center">
      <div
        className={`h-1.5 w-1.5 rounded-full ${
          isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
        } mr-1`}
      />
      Network: {isConnected ? "Connected" : "Disconnected"}
    </div>
  );
}

