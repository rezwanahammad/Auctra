import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import Bid from "@/models/Bid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return getAuction(req, res);
  }

  return res.status(405).json({ message: "Method not allowed" });
}

async function getAuction(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const { id } = req.query;

    const auction = await Auction.findById(id)
      .populate("sellerId", "username email")
      .populate("categoryId", "name");

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // ✅ Also fetch latest bids
    const bids = await Bid.find({ auctionId: id })
      .populate("bidderId", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ auction, bids });
  } catch (error) {
    console.error("❌ Get auction error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
