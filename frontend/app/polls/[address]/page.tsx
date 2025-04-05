"use client"

import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useWallet } from "@/hooks/use-wallet"
import { getPoll, castVote } from "@/lib/contract-interactions"
import { toast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle2, AlertCircle, Clock, User, BarChart3, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Poll {
  address: string
  title: string
  description: string
  options: string[]
  votes: number[]
  totalVotes: number
  endTime: number
  creator: string
}

export default function PollPage({ params }: { params: Promise<{ voteAddress: string }> }) {
  const { voteAddress } = use(params)
  const { address, isConnected } = useWallet()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const goHome = () => {
    router.push('/')
  }

  const isPollActive = poll ? Date.now() / 1000 < poll.endTime : false

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true)
        const pollData = await getPoll(`0x${voteAddress}`)
        if (!pollData) goHome()
        setPoll(pollData)

        // Check if user has voted
        if (isConnected && address) {
          // This would be implemented in the contract
          // setHasVoted(await hasUserVoted(id, address));
          setHasVoted(false) // Placeholder
        }
      } catch (err) {
        console.error("Error fetching poll:", err)
        setError("Failed to load poll data")
      } finally {
        setLoading(false)
      }
    }

    fetchPoll()
  }, [voteAddress, address, isConnected])

  const handleVote = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to vote",
        variant: "destructive",
      })
      return
    }

    if (selectedOption === null) {
      toast({
        title: "No option selected",
        description: "Please select an option to vote",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await castVote(id, selectedOption)

      toast({
        title: "Vote cast successfully!",
        description: "Your vote has been recorded on the blockchain",
      })

      setHasVoted(true)

      // Refresh poll data
      const updatedPoll = await getPoll(id)
      setPoll(updatedPoll)
    } catch (error) {
      console.error("Error casting vote:", error)
      toast({
        title: "Error casting vote",
        description: "There was an error recording your vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Card className="w-full max-w-2xl border border-primary/20 bg-black/5 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-40">
              <div className="animate-pulse text-lg flex items-center">
                <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin mr-2"></div>
                Loading poll data...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !poll) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Card className="w-full max-w-2xl border border-red-500/20 bg-black/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center">
              <AlertCircle className="mr-2" /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Poll not found"}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.history.back()} className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 relative">
      {/* Tech background elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl"></div>
      </div>

      <div className="mb-4 relative z-10">
        <Button asChild variant="outline" className="border-primary/20 bg-primary/5">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Polls
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto border border-primary/20 bg-black/5 backdrop-blur-sm relative z-10">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-gradient">{poll.title}</CardTitle>
              {poll.description && <CardDescription className="mt-2">{poll.description}</CardDescription>}
            </div>
            <Badge
              className={`${isPollActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"} border-0`}
            >
              {isPollActive ? "Active" : "Ended"}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mt-4 space-y-2">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              {isPollActive ? (
                <p>Ends {formatDistanceToNow(new Date(Number(poll.endTime) * 1000), { addSuffix: true })}</p>
              ) : (
                <p>Ended {formatDistanceToNow(new Date(Number(poll.endTime) * 1000), { addSuffix: true })}</p>
              )}
            </div>
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4 text-primary" />
              <p>
                Created by {poll.creator.substring(0, 6)}...{poll.creator.substring(38)}
              </p>
            </div>
            <div className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4 text-primary" />
              <p>Total votes: {poll.totalVotes}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="border-t border-primary/10 pt-6">
          {!hasVoted && isPollActive ? (
            <RadioGroup
              value={selectedOption?.toString()}
              onValueChange={(value) => setSelectedOption(Number.parseInt(value))}
              className="space-y-3"
            >
              {poll.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-primary/5 transition-colors"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} className="border-primary" />
                  <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-6">
              {poll.options.map((option, index) => {
                const percentage = poll.totalVotes > 0 ? Math.round((poll.votes[index] / poll.totalVotes) * 100) : 0
                const isHighest = poll.votes[index] === Math.max(...poll.votes)

                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between">
                      <span>{option}</span>
                      <span className={isHighest ? "font-bold text-primary" : ""}>
                        {poll.votes[index]} votes ({percentage}%)
                      </span>
                    </div>
                    <div className="relative h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full ${isHighest ? "bg-primary" : "bg-primary/50"} rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}

              {hasVoted && (
                <div className="flex items-center justify-center mt-4 p-3 bg-green-500/10 text-green-400 rounded-md border border-green-500/20">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span>You have voted on this poll</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
        {!hasVoted && isPollActive && (
          <CardFooter className="border-t border-primary/10">
            <Button
              onClick={handleVote}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting || !isConnected || selectedOption === null}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Cast Vote"
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

