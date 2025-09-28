import type { NextApiRequest, NextApiResponse } from "next";
import { Types } from "mongoose";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";

type LeanAuction = {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  currentBid: number;
  startingPrice: number;
  reservePrice?: number;
  endTime?: Date;
  startTime?: Date;
  images?: { url?: string; alt?: string }[];
  sellerId?: Types.ObjectId;
  categoryId?: Types.ObjectId;
  status: string;
};

type AuctionResponse = {
  auction: {
    _id: string;
    title: string;
    description?: string;
    currentBid: number;
    startingPrice: number;
    reservePrice?: number;
    endTime?: string;
    startTime?: string;
    images?: { url: string; alt?: string }[];
    sellerId?: string;
    categoryId?: string;
    status: string;
  };
};

type ErrorResponse = { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuctionResponse | ErrorResponse>,
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid auction id" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const auctionDoc = await Auction.findById(id).lean<LeanAuction | null>();
    if (!auctionDoc) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const {
      _id,
      sellerId,
      categoryId,
      endTime,
      startTime,
      images,
      ...rest
    } = auctionDoc;

    const auction: AuctionResponse["auction"] = {
      ...rest,
      _id: _id.toString(),
      sellerId: sellerId ? sellerId.toString() : undefined,
      categoryId: categoryId ? categoryId.toString() : undefined,
      endTime: endTime ? endTime.toISOString() : undefined,
      startTime: startTime ? startTime.toISOString() : undefined,
      images: Array.isArray(images)
        ? images.map((image) => ({
            url: image?.url ?? "",
            alt: image?.alt,
          }))
        : undefined,
    };

    return res.status(200).json({ auction });
  } catch (error) {
    console.error("❌ Fetch auction error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
