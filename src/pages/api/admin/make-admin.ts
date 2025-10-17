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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    await dbConnect();
    
    // Update user role to admin
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create or update admin record
    const adminRecord = await Admin.findOneAndUpdate(
      { userId: session.user.id },
      {
        userId: session.user.id,
        isActive: true,
        permissions: {
          canManageUsers: true,
          canManageAuctions: true,
          canViewAnalytics: true,
          canManageSettings: true,
          canDeleteUsers: true,
          canDeleteAuctions: true
        }
      },
      { 
        upsert: true, 
        new: true 
      }
    );

    return res.status(200).json({
      message: "Successfully promoted to admin",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      admin: adminRecord
    });

  } catch (error) {
    console.error("Make admin error:", error);
    return res.status(500).json({ error: "Failed to make admin" });
  }
}