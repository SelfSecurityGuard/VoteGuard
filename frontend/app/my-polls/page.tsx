"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Vote, AlertCircle } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { Badge } from "@/components/ui/badge"
import ConnectWallet from "@/components/connect-wallet"

// Mock data for my polls
const mockMyPolls = [
  {
    id: "1",
    title: "Should we implement feature X?",
    description: "Voting on whether to implement feature X in the next release",
    endTime: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
    totalVotes: 25,
    isActive: true,
  },
  {
    id: "4",
    title: "Project Budget Allocation",
    description: "Vote on how to allocate the project budget for Q2",
    endTime: Math.floor(Date.now() / 1000) - 172800, // 48 hours ago (ended)
    totalVotes: 42,
    isActive: false,
  },
]

export default function MyPolls() {
  const { isConnected } = useWallet()
  const [polls, setPolls] = useState<typeof mockMyPolls>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMyPolls = async () => {
      if (!isConnected) {
        setPolls([])
        setLoading(false)
        return
      }

      // Simulate loading data
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setPolls(mockMyPolls)
      setLoading(false)
    }

    loadMyPolls()
  }, [isConnected])

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12 relative">
        <div className="text-center max-w-2xl mx-auto">
          <Card className="border border-primary/20 bg-black/5 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-primary/50 mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-gradient">Wallet Not Connected</h2>
              <p className="text-muted-foreground mb-6">Please connect your wallet to view your polls</p>
              <ConnectWallet />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 relative">
        <div className="text-center">
          <div className="flex justify-center items-center">
            <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin mr-2"></div>
            <span>Loading your polls...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Vote className="mr-2 text-primary" /> My Polls
      </h1>

      <div className="mb-6">
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/create">Create New Poll</Link>
        </Button>
      </div>

      {polls.length === 0 ? (
        <Card className="border border-primary/20 bg-black/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">You haven't created any polls yet</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/create">Create Your First Poll</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {polls.map((poll) => (
            <Card
              key={poll.id}
              className="border border-primary/20 bg-black/5 backdrop-blur-sm hover:border-primary/40 transition-all"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-gradient">{poll.title}</CardTitle>
                  <Badge
                    variant="outline"
                    className={`${
                      poll.isActive ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"
                    }`}
                  >
                    {poll.isActive ? "Active" : "Ended"}
                  </Badge>
                </div>
                <CardDescription>
                  {poll.isActive
                    ? `Ends ${formatDistanceToNow(new Date(poll.endTime * 1000), { addSuffix: true })}`
                    : `Ended ${formatDistanceToNow(new Date(poll.endTime * 1000), { addSuffix: true })}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-muted-foreground">{poll.description}</p>
                <p className="mt-2 text-sm">Total votes: {poll.totalVotes}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href={`/polls/${poll.id}`}>View Poll</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

