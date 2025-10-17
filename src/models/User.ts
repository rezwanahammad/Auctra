import { Schema, model, models } from "mongoose";

export interface IUser {
  _id: string;
  username?: string;
  email: string;
  hashedPassword?: string;
  role: "buyer" | "seller" | "admin" | "expert";
  verified: boolean;
  sellerVerified: boolean;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
  };
  stats?: {
    totalBids: number;
    totalWins: number;
    totalSales: number;
    successfulTransactions: number;
    rating: number;
    ratingCount: number;
  };
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { 
      type: String, 
      unique: true, 
      sparse: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: { 
      type: String, 
      unique: true, 
      required: true,
      lowercase: true,
      trim: true
    },
    hashedPassword: { type: String }, // ✅ used for login
    role: { 
      type: String, 
      enum: ["buyer", "seller", "admin", "expert"], 
      default: "buyer",
      index: true
    },
    verified: { type: Boolean, default: false },
    sellerVerified: { type: Boolean, default: false },
    avatarUrl: String,
    firstName: { type: String, trim: true, maxlength: 50 },
    lastName: { type: String, trim: true, maxlength: 50 },
    phoneNumber: { type: String, trim: true },
    dateOfBirth: Date,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      marketingEmails: { type: Boolean, default: true },
    },
    stats: {
      totalBids: { type: Number, default: 0 },
      totalWins: { type: Number, default: 0 },
      totalSales: { type: Number, default: 0 },
      successfulTransactions: { type: Number, default: 0 },
      rating: { type: Number, default: 0, min: 0, max: 5 },
      ratingCount: { type: Number, default: 0 },
    },
    lastLogin: Date,
    isActive: { type: Boolean, default: true },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.username || this.email.split('@')[0];
});

// Pre-save middleware
UserSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

export default models.User || model<IUser>("User", UserSchema);
