// This file would contain the actual contract interactions
// For now, we'll use mock data for demonstration purposes
import { ethers, Log } from "ethers"
import { FACTORY_ABI, FACTORY_ADDRESS } from "./smart-contract"

interface Poll {
  id: string
  title: string
  description: string
  options: string[]
  votes: number[]
  totalVotes: number
  endTime: number
  creator: string
}

// Mock data
const mockPolls: Poll[] = [
  {
    id: "1",
    title: "Should we implement feature X?",
    description: "Voting on whether to implement feature X in the next release",
    options: ["Yes", "No", "Maybe later"],
    votes: [12, 5, 8],
    totalVotes: 25,
    endTime: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
    creator: "0x1234567890123456789012345678901234567890",
  },
  {
    id: "2",
    title: "Choose the next community event",
    description: "Vote for the type of event you'd like to see next",
    options: ["Hackathon", "AMA Session", "Workshop", "Social Meetup"],
    votes: [15, 10, 7, 20],
    totalVotes: 52,
    endTime: Math.floor(Date.now() / 1000) + 172800, // 48 hours from now
    creator: "0x0987654321098765432109876543210987654321",
  },
  {
    id: "3",
    title: "Token allocation proposal",
    description: "How should we allocate the remaining tokens?",
    options: ["Community rewards", "Development fund", "Marketing", "Burn"],
    votes: [30, 25, 15, 10],
    totalVotes: 80,
    endTime: Math.floor(Date.now() / 1000) + 259200, // 72 hours from now
    creator: "0x5678901234567890123456789012345678901234",
  },
]

// Mock function to get active polls
export async function getActivePolls(): Promise<Poll[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const currentTime = Math.floor(Date.now() / 1000)
  return mockPolls.filter((poll) => poll.endTime > currentTime)
}

// Mock function to get a specific poll
export async function getPoll(id: string): Promise<Poll> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const poll = mockPolls.find((p) => p.id === id)
  if (!poll) {
    throw new Error("Poll not found")
  }

  return poll
}

// Update the createPoll function signature to include eligibility requirements
export async function createPoll(
  title: string,
  description: string,
  options: string[],
  endTime: number,
  eligibilityRequirements?: {
    name: boolean
    nationality: boolean
    age: number | null
  },
): Promise<string> {
  // Simulate API delay and blockchain transaction
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // In a real implementation, this would interact with a smart contract
  console.log("Creating poll:", { title, description, options, endTime, eligibilityRequirements })

  // Return a mock transaction hash
  return "0x" + Math.random().toString(16).substring(2, 42)
}

// Mock function to cast a vote
export async function castVote(pollId: string, optionIndex: number): Promise<string> {
  // Simulate API delay and blockchain transaction
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In a real implementation, this would interact with a smart contract
  console.log("Casting vote:", { pollId, optionIndex })

  // Return a mock transaction hash
  return "0x" + Math.random().toString(16).substring(2, 42)
}

export async function createVote(options: string[]): Promise<string> {
  if (!window.ethereum) throw new Error("請先安裝錢包擴充套件")

  try {
    // 檢查是否已連線
    let accounts = await window.ethereum.request({ method: "eth_accounts" })
    if (accounts.length === 0) {
      // 使用者取消授權時會在這裡丟出錯誤
      accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer)

    console.log("📤 發送 createVote 交易中...", options)

    const tx = await contract.createVote(options)
    const receipt = await tx.wait()

    const event = receipt.logs.find(
      (log: Log) => log?.address?.toLowerCase() === FACTORY_ADDRESS.toLowerCase()
    )

    const voteAddress = event?.args?.voteAddress ?? "（需透過 interface decode）"

    console.log("✅ 新投票合約地址：", voteAddress)

    return voteAddress
  } catch (err: any) {
    if (err.code === 4001) {
      console.warn("🛑 使用者取消錢包授權")
    } else {
      console.error("❌ 發生其他錯誤：", err)
    }

    throw new Error("使用者未完成錢包授權，無法建立投票")
  }
}