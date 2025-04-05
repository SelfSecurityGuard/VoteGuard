// pages/api/proof.ts
import { getUserIdentifier } from "@selfxyz/core";
import type { NextApiRequest, NextApiResponse } from "next"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

// const proofStore: Record<string, any> = {}
// const storage: Record<string, string> = {}


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

    // storage["test"] = "123"
    await redis.set("test-proof", proof, { ex: 300 })
    // proofStore[userId.toLowerCase().replaceAll('-', '')] = proof
    console.log("Were storing proof for userId:", userId)
    // console.log("Current proofStore:", proofStore)
    return res.status(200).json({ status: 'success', result: true, message: "成功收到 POST 資料！" })

  }

  else if (req.method === "GET") {
    const address = req.query.address
    console.log(address)

    if (typeof address !== "string") {
      return res.status(400).json({ status: "error", message: "Please provide the correct address query parameter" })
    }

    // const proof = proofStore["e0944f132e1c18d3cfa4147965bfce044e15e776"]
    // console.log(JSON.stringify(proofStore))
    // if (!proof) {
    //   return res.status(404).json({ status: "not_found", message: "No proof" })
    // }
    // const proof = storage["test"]
    const proof = await redis.get("test-proof")
    console.log("Fetching data:", proof)

    // Delete after taking out
    // delete proofStore[address.toLowerCase()]

    return res.status(200).json({ status: "success", proof })
  }

  return res.status(405).json({ status: "error", message: "Method Not Allowed" })
}