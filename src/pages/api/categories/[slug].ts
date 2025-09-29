import type { NextApiRequest, NextApiResponse } from "next";
import { Types } from "mongoose";
import { dbConnect } from "@/lib/db";
import Category from "@/models/Category";
import Auction from "@/models/Auction";

type LeanCategory = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
};

type LeanAuction = {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  categoryId: Types.ObjectId;
  startingPrice: number;
  currentBid?: number;
  reservePrice?: number;
  status: string;
  startTime?: Date;
  endTime?: Date;
  images?: { url?: string; alt?: string }[];
};

type CategoryResponse = {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
  auctions: Array<{
    id: string;
    title: string;
    description?: string;
    startingPrice: number;
    currentBid: number;
    reservePrice?: number;
    status: string;
    startTime?: string;
    endTime?: string;
    images?: { url: string; alt?: string }[];
  }>;
};

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CategoryResponse | ErrorResponse>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { slug } = req.query;
  if (typeof slug !== "string") {
    return res.status(400).json({ message: "Invalid category slug" });
  }

  try {
    await dbConnect();

    const categoryDoc = await Category.findOne({ slug }).lean<LeanCategory | null>();
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const auctions = await Auction.find({ categoryId: categoryDoc._id })
      .sort({ endTime: 1 })
      .lean<LeanAuction[]>();

    const response: CategoryResponse = {
      category: {
        id: categoryDoc._id.toString(),
        name: categoryDoc.name,
        slug: categoryDoc.slug,
        description: categoryDoc.description,
      },
      auctions: auctions.map((auction) => ({
        id: auction._id.toString(),
        title: auction.title,
        description: auction.description,
        startingPrice: auction.startingPrice,
        currentBid: auction.currentBid ?? auction.startingPrice,
        reservePrice: auction.reservePrice,
        status: auction.status,
        startTime: auction.startTime ? auction.startTime.toISOString() : undefined,
        endTime: auction.endTime ? auction.endTime.toISOString() : undefined,
        images: auction.images?.map((image) => ({
          url: image?.url ?? "",
          alt: image?.alt,
        })),
      })),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ Category fetch error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
