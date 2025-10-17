import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbConnect } from "@/lib/db";
import User, { IUser } from "@/models/User";
import Admin, { IAdmin } from "@/models/Admin";
import { Session } from "next-auth";

export async function verifyAdminAccess() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Check if user exists and has admin role
    const user = await User.findById(session.user.id);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Check if admin record exists and is active
    const admin = await Admin.findOne({ userId: session.user.id });
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: "Admin access denied" },
        { status: 403 }
      );
    }

    return { user, admin, session };
  } catch (error) {
    console.error("Admin verification error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

interface AdminRequest extends NextRequest {
  admin?: {
    user: IUser;
    admin: IAdmin;
    session: Session;
  };
}

export function withAdminAuth(handler: (req: AdminRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const authResult = await verifyAdminAccess();
    
    if (authResult instanceof NextResponse) {
      return authResult; // Error response
    }
    
    // Attach admin data to request
    const adminReq = req as AdminRequest;
    adminReq.admin = authResult;
    return handler(adminReq);
  };
}