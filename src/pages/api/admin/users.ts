import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Admin from "@/models/Admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

    if (req.method === "GET") {
      const { page = "1", limit = "20", role, search } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build query
      interface QueryType {
        role?: string;
        $or?: Array<Record<string, { $regex: string; $options: string }>>;
      }
      
      const query: QueryType = {};
      if (role && role !== "all") {
        query.role = role as string;
      }
      if (search) {
        query.$or = [
          { email: { $regex: search as string, $options: "i" } },
          { firstName: { $regex: search as string, $options: "i" } },
          { lastName: { $regex: search as string, $options: "i" } },
          { username: { $regex: search as string, $options: "i" } },
        ];
      }

      const [users, total] = await Promise.all([
        User.find(query)
          .select("-hashedPassword")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        User.countDocuments(query),
      ]);

      return res.status(200).json({
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      });
    }

    if (req.method === "PATCH") {
      const { userId, updates } = req.body;

      if (!userId || !updates) {
        return res.status(400).json({ error: "User ID and updates are required" });
      }

      // Prevent updating password through this endpoint
      delete updates.hashedPassword;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-hashedPassword");

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ user: updatedUser });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Admin users API error:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
}