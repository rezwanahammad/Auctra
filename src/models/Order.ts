import { Schema, model, models } from "mongoose";

export interface IOrder {
  _id: string;
  auctionId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: "pending_payment" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentMethod?: "card" | "bank_transfer" | "wallet";
  paymentDetails?: {
    transactionId?: string;
    paymentDate?: Date;
    paymentGateway?: string;
  };
  shippingDetails?: {
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
    method: string;
    cost: number;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
  };
  orderNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    auctionId: { 
      type: String, 
      required: true, 
      ref: "Auction",
      index: true 
    },
    buyerId: { 
      type: String, 
      required: true, 
      ref: "User",
      index: true 
    },
    sellerId: { 
      type: String, 
      required: true, 
      ref: "User",
      index: true 
    },
    amount: { 
      type: Number, 
      required: true,
      min: 0 
    },
    status: {
      type: String,
      enum: ["pending_payment", "paid", "shipped", "delivered", "cancelled"],
      default: "pending_payment",
      index: true
    },
    paymentMethod: {
      type: String,
      enum: ["card", "bank_transfer", "wallet"]
    },
    paymentDetails: {
      transactionId: String,
      paymentDate: Date,
      paymentGateway: String
    },
    shippingDetails: {
      address: {
        line1: { type: String, required: true },
        line2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true }
      },
      method: { type: String, required: true },
      cost: { type: Number, required: true, min: 0 },
      trackingNumber: String,
      estimatedDelivery: Date,
      actualDelivery: Date
    },
    orderNotes: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
OrderSchema.index({ buyerId: 1, createdAt: -1 });
OrderSchema.index({ sellerId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ auctionId: 1 }, { unique: true }); // One order per auction for buy now

// Virtual for order number
OrderSchema.virtual('orderNumber').get(function() {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

export default models.Order || model<IOrder>("Order", OrderSchema);