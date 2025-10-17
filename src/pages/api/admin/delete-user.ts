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
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authResult = await verifyAdminAccess(req, res);
    if (!authResult || typeof authResult === 'object' && 'status' in authResult) {
      return;
    }

    const { userId, deleteAuctions = false, deleteBids = false } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Prevent admin from deleting themselves
    if (userId === authResult.session.user?.id) {
      return res.status(400).json({ error: "Cannot delete your own admin account" });
    }

    await dbConnect();

    // Check if user exists
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ error: "User not found" });
    }

    // If deleteAuctions is true, delete all auctions by this user
    if (deleteAuctions) {
      const userAuctions = await Auction.find({ seller: userId });
      
      // Delete all bids on user's auctions
      for (const auction of userAuctions) {
        await Bid.deleteMany({ auction: auction._id });
      }
      
      // Delete all auctions by this user
      await Auction.deleteMany({ seller: userId });
    } else {
      // Just deactivate auctions instead of deleting
      await Auction.updateMany(
        { seller: userId },
        { $set: { status: "cancelled" } }
      );
    }

    // If deleteBids is true, delete all bids by this user
    if (deleteBids) {
      await Bid.deleteMany({ bidder: userId });
    }

    // Delete admin profile if user is admin
    if (userToDelete.role === "admin") {
      await Admin.deleteOne({ userId });
    }

    // Finally delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ 
      message: "User deleted successfully",
      deletedUser: {
        id: userToDelete._id,
        email: userToDelete.email,
        name: `${userToDelete.firstName} ${userToDelete.lastName}`,
      }
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
}