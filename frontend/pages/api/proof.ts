// pages/api/proof.ts
import { getUserIdentifier } from "@selfxyz/core";
import type { NextApiRequest, NextApiResponse } from "next"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { proof, publicSignals } = req.body

    if (!proof || !publicSignals) {
      return res.status(400).json({ message: 'Proof and publicSignals are required' })
    }

    // Extract user ID from the proof
    const userId = await getUserIdentifier(publicSignals)
    console.log("Extracted userId:", userId)
    console.log(proof)

    await redis.set(userId.toLowerCase().replaceAll('-', ''), proof, { ex: 300 })
    // proofStore[userId.toLowerCase().replaceAll('-', '')] = proof
    console.log("Were storing proof for userId:", userId)
    // console.log("Current proofStore:", proofStore)
    return res.status(200).json({ status: 'success', result: true, message: "POST data received successfully!" })
  }

  else if (req.method === "GET") {
    const address = req.query.address
    console.log(address)

    if (typeof address !== "string") {
      return res.status(400).json({ status: "error", message: "Please provide the correct address query parameter" })
    }

    const proof = await redis.get(address)
    console.log("Fetching data:", proof)
    if (!proof) {
      return res.status(404).json({ status: "not_found", message: "No proof" })
    }

    return res.status(200).json({ status: "success", proof })
  }

  return res.status(405).json({ status: "error", message: "Method Not Allowed" })
}