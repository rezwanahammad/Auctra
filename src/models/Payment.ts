import { Schema, model, models } from "mongoose";

const PaymentSchema = new Schema({
  auctionId: { type: Schema.Types.ObjectId, ref: "Auction" },
  buyerId: { type: Schema.Types.ObjectId, ref: "User" },
  sellerId: { type: Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  status: { type: String, enum: ["pending", "success", "failed", "refunded"], default: "pending" },
  transactionId: String,
}, { timestamps: true });

export default models.Payment || model("Payment", PaymentSchema);
