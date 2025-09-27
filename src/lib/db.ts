// src/lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

declare global {
  // allow global scoped cache in dev mode
  var _mongoose: Promise<typeof mongoose> | undefined;
}

export const dbConnect = async () => {
  if (!global._mongoose) {
    global._mongoose = mongoose.connect(MONGODB_URI, {
      autoIndex: true,
    });
  }
  return global._mongoose;
};
