import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import ActivePolls from "@/components/active-polls"
import ConnectWallet from "@/components/connect-wallet"
import { ArrowRight, Vote, Shield, Network, Lock } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black/10 relative overflow-hidden">
      {/* Tech background elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/15 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/10 rounded-full"></div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Decentralized Voting Platform
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Create and participate in transparent, secure, and decentralized voting using blockchain technology.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <ConnectWallet />
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/create">
                Create Poll <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid w-full max-w-5xl gap-6 md:grid-cols-3">
            <Card className="border border-primary/20 bg-black/5 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All votes are recorded on the blockchain, ensuring complete transparency and auditability.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-primary/20 bg-black/5 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cryptographically secure voting ensures your vote cannot be tampered with or altered.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-primary/20 bg-black/5 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Network className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Decentralized</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No central authority controls the voting process, making it resistant to censorship.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="w-full max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold flex items-center">
                <Vote className="mr-2 text-primary" /> Active Polls
              </h2>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live Data</span>
              </div>
            </div>
            <ActivePolls />
          </div>
        </div>
      </div>
    </div>
  )
}

