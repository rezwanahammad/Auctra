import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Admin from "@/models/Admin";
import Auction from "@/models/Auction";
import Bid from "@/models/Bid";

async function verifyAdminAccess(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Authentication required" });
  }

  await dbConnect();
  
  const user = await User.findById(session.user.id);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  const admin = await Admin.findOne({ userId: session.user.id });
  if (!admin || !admin.isActive) {
    return res.status(403).json({ error: "Admin access denied" });
  }

  return { user, admin, session };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const authResult = await verifyAdminAccess(req, res);
    if (authResult instanceof Response) {
      return authResult;
    }

    if (req.method === "GET") {
      // Get all auctions with seller info
      const { page = "1", limit = "20", status, search } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      interface QueryType {
        status?: string;
        $or?: Array<Record<string, { $regex: string; $options: string }>>;
      }

      const query: QueryType = {};
      if (status && status !== "all") {
        query.status = status as string;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search as string, $options: "i" } },
          { description: { $regex: search as string, $options: "i" } },
        ];
      }

      const [auctions, total] = await Promise.all([
        Auction.find(query)
          .populate("sellerId", "firstName lastName email")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Auction.countDocuments(query),
      ]);

      return res.status(200).json({
        auctions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      });
    }

    if (req.method === "DELETE") {
      // Delete auction and all related bids
      const { auctionId } = req.body;

      if (!auctionId) {
        return res.status(400).json({ error: "Auction ID is required" });
      }

      // Delete all bids related to this auction
      await Bid.deleteMany({ auction: auctionId });

      // Delete the auction
      const deletedAuction = await Auction.findByIdAndDelete(auctionId);

      if (!deletedAuction) {
        return res.status(404).json({ error: "Auction not found" });
      }

      return res.status(200).json({ message: "Auction deleted successfully" });
    }

    if (req.method === "PATCH") {
      // Update auction status or other properties
      const { auctionId, updates } = req.body;

      if (!auctionId || !updates) {
        return res.status(400).json({ error: "Auction ID and updates are required" });
      }

      const updatedAuction = await Auction.findByIdAndUpdate(
        auctionId,
        { $set: updates },
        { new: true, runValidators: true }
      ).populate("sellerId", "firstName lastName email");

      if (!updatedAuction) {
        return res.status(404).json({ error: "Auction not found" });
      }

      return res.status(200).json({ auction: updatedAuction });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Admin auctions API error:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
}