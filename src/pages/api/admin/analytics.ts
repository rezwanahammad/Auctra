import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Auction from "@/models/Auction";
import Bid from "@/models/Bid";
import Admin from "@/models/Admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify admin access
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    await dbConnect();
    
    // Check if user exists and has admin role
    const user = await User.findById(session.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Check if admin record exists and is active
    const admin = await Admin.findOne({ userId: session.user.id });
    if (!admin || !admin.isActive) {
      return res.status(403).json({ error: "Admin access denied" });
    }

    // Get counts and analytics
    const [
      totalUsers,
      totalSellers,
      totalBuyers,
      totalAuctions,
      activeAuctions,
      totalBids,
      recentUsers,
      recentAuctions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "seller" }),
      User.countDocuments({ role: "buyer" }),
      Auction.countDocuments(),
      Auction.countDocuments({ status: "active" }),
      Bid.countDocuments(),
      User.find()
        .select("-hashedPassword")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Auction.find()
        .populate("sellerId", "firstName lastName email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    // Get monthly user registrations for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Get auction status distribution
    const auctionStats = await Auction.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalValue: { $sum: "$currentBid" },
        },
      },
    ]);

    // Get top bidders
    const topBidders = await Bid.aggregate([
      {
        $group: {
          _id: "$bidder",
          totalBids: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "bidder",
        },
      },
      {
        $unwind: "$bidder",
      },
      {
        $project: {
          totalBids: 1,
          totalAmount: 1,
          "bidder.firstName": 1,
          "bidder.lastName": 1,
          "bidder.email": 1,
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    return res.status(200).json({
      overview: {
        totalUsers,
        totalSellers,
        totalBuyers,
        totalAuctions,
        activeAuctions,
        totalBids,
      },
      charts: {
        monthlyRegistrations,
        auctionStats,
      },
      recent: {
        users: recentUsers,
        auctions: recentAuctions,
      },
      topBidders,
    });
  } catch (error) {
    console.error("Admin analytics API error:", error);
    return res.status(500).json({ error: "Failed to fetch analytics data" });
  }
}