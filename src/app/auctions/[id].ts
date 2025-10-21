import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import Bid from "@/models/Bid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const auction = await Auction.findById(id).populate("sellerId", "username email");
      if (!auction) return res.status(404).json({ message: "Auction not found" });

      const bids = await Bid.find({ auctionId: id })
        .populate("bidderId", "username")
        .sort({ createdAt: -1 });

      return res.status(200).json({ auction, bids });
    } catch (error) {
      console.error("Auction fetch error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
