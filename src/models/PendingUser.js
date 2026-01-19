import mongoose from "mongoose";

const PendingUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    emailOtpHash: { type: String, required: true },
    emailOtpExpires: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 },
  },
  { timestamps: true }
);

export default mongoose.models.PendingUser || mongoose.model("PendingUser", PendingUserSchema);
