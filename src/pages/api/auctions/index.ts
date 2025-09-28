import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import { Types } from "mongoose";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return createAuction(req, res);
  } else if (req.method === "GET") {
    return listAuctions(req, res);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

async function createAuction(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (session.user?.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can create auctions" });
    }

    await dbConnect();

    const { title, description, categoryId, startingPrice, reservePrice, startTime, endTime, minIncrement, images } = req.body;

    if (!title || !categoryId || !startingPrice || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }
const auction = await Auction.create({
  title,
  description,
  categoryId: new Types.ObjectId(categoryId), // ✅ force convert
  sellerId: session.user.id,
  startingPrice,
  reservePrice,
  startTime,
  endTime,
  minIncrement,
  images,
  status: "active"
});

    return res.status(201).json({ message: "Auction created successfully", auction });
  } catch (error) {
    console.error("❌ Auction creation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


interface AuctionSummary {
  _id: string;
  title: string;
  description?: string;
  currentBid: number;
}

interface AuctionsResponse {
  auctions: AuctionSummary[];
}

async function listAuctions(
  req: NextApiRequest,
  res: NextApiResponse<AuctionsResponse | { message: string }>,
) {
  try {
    await dbConnect();
    const { status, categoryId } = req.query;

    const filter: Record<string, unknown> = {};
    if (typeof status === "string") filter.status = status;
    if (typeof categoryId === "string") filter.categoryId = categoryId;

    const auctions = await Auction.find(filter)
      .sort({ createdAt: -1 })
      .lean<AuctionSummary[]>();

    return res.status(200).json({ auctions });
  } catch (error) {
    console.error("❌ Fetch auctions error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
