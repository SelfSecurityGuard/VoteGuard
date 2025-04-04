"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { PlusCircle, MinusCircle, Save, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/hooks/use-wallet"
import { createPoll, createVote } from "@/lib/contract-interactions"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function CreatePoll() {
  const router = useRouter()
  const { address, isConnected } = useWallet()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [requireName, setRequireName] = useState(false)
  const [requireNationality, setRequireNationality] = useState(false)
  const [requireAge, setRequireAge] = useState(false)
  const [minimumAge, setMinimumAge] = useState(18)

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    if (options.length <= 2) return
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a poll",
        variant: "destructive",
      })
      return
    }

    if (!title || options.some((opt) => !opt) || !endDate) {
      toast({
        title: "Invalid form",
        description: "Please fill in all fields and provide at least two options",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Convert endDate to Unix timestamp (seconds)
      const endTimestamp = Math.floor(endDate.getTime() / 1000)

      const eligibilityRequirements = {
        name: requireName,
        nationality: requireNationality,
        age: requireAge ? minimumAge : null,
      }

      const voteAddress = await createVote(options)

      toast({
        title: "Poll created!",
        description: "Your poll has been successfully created on the blockchain",
      })

      router.push("/")
    } catch (error) {
      console.error("Error creating poll:", error)
      toast({
        title: "Error creating poll",
        description: "There was an error creating your poll. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
        <CardHeader className="border-b border-primary/10">
          <CardTitle className="text-gradient">Create a New Poll</CardTitle>
          <CardDescription>
            Create a new poll that will be stored on the blockchain for transparent and secure voting.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Poll Title</Label>
              <Input
                id="title"
                placeholder="Enter poll title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-primary/20 bg-primary/5 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter poll description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="border-primary/20 bg-primary/5 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Poll Options</Label>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    required
                    className="border-primary/20 bg-primary/5 focus:border-primary/50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                    disabled={options.length <= 2}
                    className="border-primary/20 bg-primary/5 hover:bg-primary/10"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2 border-primary/20 bg-primary/5 hover:bg-primary/10"
                onClick={addOption}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Option
              </Button>
            </div>

            <div className="space-y-4 p-4 border border-primary/20 rounded-md bg-primary/5">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Eligibility Requirements</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requireName"
                  checked={requireName}
                  onChange={(e) => setRequireName(e.target.checked)}
                  className="rounded border-primary/20 text-primary focus:ring-primary"
                />
                <Label htmlFor="requireName">Require Name</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requireNationality"
                  checked={requireNationality}
                  onChange={(e) => setRequireNationality(e.target.checked)}
                  className="rounded border-primary/20 text-primary focus:ring-primary"
                />
                <Label htmlFor="requireNationality">Require Nationality</Label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requireAge"
                    checked={requireAge}
                    onChange={(e) => setRequireAge(e.target.checked)}
                    className="rounded border-primary/20 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="requireAge">Require Minimum Age</Label>
                </div>

                {requireAge && (
                  <div className="flex items-center space-x-2 ml-6">
                    <Input
                      type="number"
                      id="minimumAge"
                      value={minimumAge}
                      onChange={(e) => setMinimumAge(Number.parseInt(e.target.value) || 18)}
                      min="1"
                      max="120"
                      className="w-20 border-primary/20 bg-primary/5 focus:border-primary/50"
                    />
                    <Label htmlFor="minimumAge">years</Label>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <DatePicker date={endDate} setDate={setEndDate} className="w-full border-primary/20 bg-primary/5" />
            </div>
          </CardContent>
          <CardFooter className="border-t border-primary/10">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting || !isConnected}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  Create Poll
                  <Save className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

