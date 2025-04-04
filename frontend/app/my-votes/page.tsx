"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { History, AlertCircle } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import ConnectWallet from "@/components/connect-wallet"

// Mock data for my voting history
const mockVotingHistory = [
  {
    id: "2",
    title: "Choose the next community event",
    votedOption: "Social Meetup",
    votedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: "3",
    title: "Token allocation proposal",
    votedOption: "Community rewards",
    votedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
]

export default function MyVotes() {
  const { isConnected } = useWallet()
  const [votingHistory, setVotingHistory] = useState<typeof mockVotingHistory>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMyVotes = async () => {
      if (!isConnected) {
        setVotingHistory([])
        setLoading(false)
        return
      }

      // Simulate loading data
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setVotingHistory(mockVotingHistory)
      setLoading(false)
    }

    loadMyVotes()
  }, [isConnected])

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12 relative">
        <div className="text-center max-w-2xl mx-auto">
          <Card className="border border-primary/20 bg-black/5 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-primary/50 mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-gradient">Wallet Not Connected</h2>
              <p className="text-muted-foreground mb-6">Please connect your wallet to view your voting history</p>
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
            <span>Loading your voting history...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <History className="mr-2 text-primary" /> My Voting History
      </h1>

      {votingHistory.length === 0 ? (
        <Card className="border border-primary/20 bg-black/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">You haven't voted in any polls yet</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/">Browse Active Polls</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-primary/20 bg-black/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-primary/10">
              {votingHistory.map((vote) => (
                <div key={vote.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-medium text-gradient">{vote.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You voted: <span className="text-primary">{vote.votedOption}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(vote.votedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="border-primary/20 bg-primary/5">
                      <Link href={`/polls/${vote.id}`}>View Poll</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

