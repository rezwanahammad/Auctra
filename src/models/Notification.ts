import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["OUTBID", "AUCTION_ENDING", "AUCTION_WON", "SELLER_APPROVED", "PAYMENT"] },
  message: String,
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default models.Notification || model("Notification", NotificationSchema);
