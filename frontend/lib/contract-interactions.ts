// This file would contain the actual contract interactions
// For now, we'll use mock data for demonstration purposes
import { ethers, Log } from "ethers"
import { FACTORY_ABI, FACTORY_ADDRESS, VOTE_ABI } from "./smart-contract"

interface Poll {
  address: string
  title: string
  scope: string
  description: string
  options: string[]
  votes: number[]
  totalVotes: number
  endTime: number
  creator: string
}

interface MockPoll {
  id: string
  title: string
  description: string
  options: string[]
  votes: number[]
  totalVotes: number
  endTime: number
  creator: string
}

interface ActivePoll {
  title: string
  description: string
  totalVotes: number
  endTime: number
  address: string
}

// Mock data
const mockPolls: MockPoll[] = [
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
// export async function getActivePolls(): Promise<Poll[]> {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1000))

//   const currentTime = Math.floor(Date.now() / 1000)
//   return mockPolls.filter((poll) => poll.endTime > currentTime)
// }

export async function getActivePolls(): Promise<ActivePoll[]> {
  if (!window.ethereum) throw new Error("Please install the wallet expansion package first.")

  const provider = new ethers.BrowserProvider(window.ethereum)
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider)
  const voteAddresses: string[] = await factory.getAllVotes()

  const polls = await Promise.all(
    voteAddresses.map(async (address) => {
      try {
        const vote = new ethers.Contract(address, VOTE_ABI, provider)
        const [
          title,
          description,
          totalVotes,
          endTime,
        ] = await Promise.all([
          vote.getTitle(),
          vote.getDescription(),
          vote.getTotalVotes(),
          vote.getEndTime(),
        ])

        const now = Math.floor(Date.now() / 1000)
        const isActive = Number(endTime) > now

        if (!isActive) return null

        return {
          title,
          description,
          totalVotes: Number(totalVotes),
          endTime: Number(endTime),
          address
        } satisfies ActivePoll
      } catch (err) {
        console.warn(`❌ Unable to read contract ${address}：`, err)
        return null
      }
    })
  )

  return polls.filter((p): p is ActivePoll => !!p)
}

// Mock function to get a specific poll
export async function getPoll(voteAddress: string): Promise<Poll | null> {
  // Simulate API delay
  if (!window.ethereum) throw new Error("Please install the wallet expansion package first.")

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)

    const vote = new ethers.Contract(voteAddress, VOTE_ABI, provider)
    const [
      title,
      scope,
      description,
      options,
      totalVotes,
      endTime,
      creator
    ] = await Promise.all([
      vote.getTitle(),
      vote.getScope(),
      vote.getDescription(),
      vote.getAllOptions(),
      vote.getTotalVotes(),
      vote.getEndTime(),
      vote.getCreator(),
    ])

    const votes = await vote.getVotes(options)

    console.log({
      address: voteAddress,
      title,
      description,
      options,
      votes,
      totalVotes,
      endTime,
      creator
    })
    return {
      address: voteAddress,
      scope,
      title,
      description,
      options,
      votes,
      totalVotes,
      endTime,
      creator
    } satisfies Poll
  } catch (err) {
    console.warn(`❌ Unable to read contract ${voteAddress}：`, err)
    return null
  }
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

function getMockProof(): any {
  return {
    a: [0, 0],
    b: [
      [0, 0],
      [0, 0]
    ],
    c: [0, 0],
    pubSignals: Array(21).fill(0)
  }
}

export async function castVote(voteAddress: string, optionIndex: number): Promise<string> {
  if (!window.ethereum) throw new Error("請先安裝錢包擴充功能")

  let accounts = await window.ethereum.request({ method: "eth_accounts" })
  if (accounts.length === 0) {
    // When the user cancels authorization, an error will be thrown here
    accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  const voteContract = new ethers.Contract(voteAddress, VOTE_ABI, signer)

  // 取得投票選項（合約端是 string[]）
  const options: string[] = await voteContract.getAllOptions()
  const option = options[optionIndex]
  if (!option) throw new Error("選項不存在")

  const mockProof = getMockProof()

  // 呼叫 vote 方法
  const tx = await voteContract.vote(option, mockProof)
  const receipt = await tx.wait()

  return receipt.hash
}

export interface SelfVerificationConfig {
  identityVerificationHub: string
  scope: string
  attestationId: number
  olderThanEnabled: boolean
  olderThan: number
  forbiddenCountriesEnabled: boolean
  forbiddenCountriesListPacked: [bigint, bigint, bigint, bigint]
  ofacEnabled: [boolean, boolean, boolean]
}

export async function createVote(
  title: string,
  description: string,
  endTime: number,
  options: string[],
  scope: string,
  config: SelfVerificationConfig
): Promise<string> {
  if (!window.ethereum) throw new Error("Please install the wallet expansion package first")

  try {
    // Check if you are connected
    let accounts = await window.ethereum.request({ method: "eth_accounts" })
    if (accounts.length === 0) {
      // When the user cancels authorization, an error will be thrown here
      accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer)

    console.log("📤 Sending createVote transaction...", options)

    const tx = await contract.createVote(title, description, endTime, options, scope, config)
    const receipt = await tx.wait()

    const event = receipt.logs.find(
      (log: Log) => log?.address?.toLowerCase() === FACTORY_ADDRESS.toLowerCase()
    )

    const voteAddress = event?.args?.voteAddress ?? "(need to use interface decode)"

    console.log("✅ New voting contract address:", voteAddress)

    return voteAddress
  } catch (err: any) {
    if (err.code === 4001) {
      console.warn("🛑 User canceled wallet authorization")
    } else {
      console.error("❌ Other errors occurred:", err)
    }

    throw new Error("The user has not completed the wallet authorization and cannot create a vote.")
  }
}