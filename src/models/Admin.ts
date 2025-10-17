import { Schema, model, models } from "mongoose";

export interface IAdmin {
  _id: string;
  userId: string; // Reference to User model
  permissions: {
    manageUsers: boolean;
    manageAuctions: boolean;
    manageBids: boolean;
    managePayments: boolean;
    viewAnalytics: boolean;
    systemSettings: boolean;
  };
  lastLogin?: Date;
  loginAttempts: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      ref: "User",
    },
    permissions: {
      manageUsers: { type: Boolean, default: true },
      manageAuctions: { type: Boolean, default: true },
      manageBids: { type: Boolean, default: true },
      managePayments: { type: Boolean, default: true },
      viewAnalytics: { type: Boolean, default: true },
      systemSettings: { type: Boolean, default: true },
    },
    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

AdminSchema.index({ isActive: 1 });

export default models.Admin || model<IAdmin>("Admin", AdminSchema);