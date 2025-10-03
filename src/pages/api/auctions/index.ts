import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
// Import Category to ensure mongoose registration
import "@/models/Category";
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

    const {
      title,
      description,
      categoryId,
      startingPrice,
      reservePrice,
      startTime,
      endTime,
      minIncrement,
      images,
    } = req.body;

    if (!title || !categoryId || !startingPrice || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const auction = await Auction.create({
      title,
      description,
      categoryId: new Types.ObjectId(categoryId),
      sellerId: session.user.id,
      startingPrice,
      reservePrice,
      startTime,
      endTime,
      minIncrement,
      images,
      status: "active",
    });

    return res.status(201).json({ message: "Auction created successfully", auction });
  } catch (error) {
    console.error("❌ Auction creation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


type LeanAuction = {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  currentBid?: number;
  startingPrice: number;
  reservePrice?: number;
  status: string;
  categoryId?: Types.ObjectId;
  startTime?: Date;
  endTime?: Date;
  images?: { url?: string; alt?: string }[];
};

interface AuctionSummary {
  _id: string;
  title: string;
  description?: string;
  currentBid: number;
  startingPrice: number;
  reservePrice?: number;
  status: string;
  categoryId?: string;
  startTime?: string;
  endTime?: string;
  images?: { url: string; alt?: string }[];
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
      .lean<LeanAuction[]>();

    const formatted: AuctionSummary[] = auctions.map((auction) => ({
      _id: auction._id.toString(),
      title: auction.title,
      description: auction.description,
      currentBid: auction.currentBid ?? auction.startingPrice,
      startingPrice: auction.startingPrice,
      reservePrice: auction.reservePrice,
      status: auction.status,
      categoryId: auction.categoryId?.toString(),
      startTime: auction.startTime?.toISOString(),
      endTime: auction.endTime?.toISOString(),
      images: auction.images?.map((image) => ({
        url: image?.url ?? "",
        alt: image?.alt,
      })),
    }));

    return res.status(200).json({ auctions: formatted });
  } catch (error) {
    console.error("❌ Fetch auctions error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
