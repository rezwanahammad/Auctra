import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Bid from "@/models/Bid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { id } = req.query;

    const bids = await Bid.find({ auctionId: id })
      .populate("bidderId", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ bids });
  } catch (error) {
    console.error("❌ Fetch bids error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
