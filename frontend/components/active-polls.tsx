"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getActivePolls } from "@/lib/contract-interactions"
import { formatDistanceToNow } from "date-fns"
import { ChevronLeft, ChevronRight, Blocks, Vote } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Poll {
  id: string
  title: string
  description: string
  endTime: number
  totalVotes: number
}

export default function ActivePolls() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pollsPerPage = 4

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true)
        const activePolls = await getActivePolls()
        setPolls(activePolls)
        setTotalPages(Math.ceil(activePolls.length / pollsPerPage))
      } catch (error) {
        console.error("Error fetching active polls:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPolls()
  }, [])

  const paginatedPolls = polls.slice((currentPage - 1) * pollsPerPage, currentPage * pollsPerPage)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse border border-primary/20 bg-black/5 backdrop-blur-sm">
            <CardHeader>
              <div className="h-6 bg-primary/10 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-primary/10 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-primary/10 rounded w-full mb-2"></div>
              <div className="h-4 bg-primary/10 rounded w-5/6"></div>
            </CardContent>
            <CardFooter>
              <div className="h-10 bg-primary/10 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (polls.length === 0) {
    return (
      <Card className="border border-primary/20 bg-black/5 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Blocks className="h-12 w-12 text-primary/50 mb-4" />
          <p className="text-muted-foreground mb-4">No active polls found</p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/create">Create a Poll</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedPolls.map((poll) => (
          <Card
            key={poll.id}
            className="border border-primary/20 bg-black/5 backdrop-blur-sm hover:border-primary/40 transition-all"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-gradient">{poll.title}</CardTitle>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  <Vote className="h-3 w-3 mr-1" /> {poll.totalVotes}
                </Badge>
              </div>
              <CardDescription>
                Ends {formatDistanceToNow(new Date(poll.endTime * 1000), { addSuffix: true })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-muted-foreground">{poll.description || "No description provided"}</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href={`/polls/${poll.id}`}>View Poll</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="border-primary/20 bg-primary/5 hover:bg-primary/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="border-primary/20 bg-primary/5 hover:bg-primary/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

