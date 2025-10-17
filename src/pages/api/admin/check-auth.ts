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
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.id) {
      return res.status(200).json({ 
        authenticated: false,
        error: "No session found" 
      });
    }

    await dbConnect();
    
    const user = await User.findById(session.user.id);
    if (!user) {
      return res.status(200).json({ 
        authenticated: true,
        user: null,
        error: "User not found in database" 
      });
    }

    const admin = await Admin.findOne({ userId: session.user.id });
    
    return res.status(200).json({
      authenticated: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      admin: admin ? {
        isActive: admin.isActive,
        permissions: admin.permissions,
        createdAt: admin.createdAt
      } : null,
      session: {
        user: session.user
      }
    });

  } catch (error) {
    console.error("Auth check error:", error);
    return res.status(500).json({ error: "Failed to check authentication" });
  }
}