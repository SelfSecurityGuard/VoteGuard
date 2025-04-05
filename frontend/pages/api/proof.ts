// pages/api/proof.ts
import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    console.log("✅ 成功收到 POST！")
    res.status(200).json({ message: "成功收到 POST 資料！" })
  } else {
    res.status(405).json({ message: "只接受 POST 方法喔！" })
  }
}
