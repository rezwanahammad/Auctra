import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, required: true },
  hashedPassword: String,
  role: { type: String, enum: ["buyer", "seller", "admin", "expert"], default: "buyer" },
  verified: { type: Boolean, default: false },
  sellerVerified: { type: Boolean, default: false },
  avatarUrl: String,
  address: {
    line1: String,
    city: String,
    country: String,
  },
}, { timestamps: true });

export default models.User || model("User", UserSchema);
