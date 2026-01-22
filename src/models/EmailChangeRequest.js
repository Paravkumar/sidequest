import mongoose from "mongoose";

const EmailChangeRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    newEmail: { type: String, required: true },
    emailOtpHash: { type: String, required: true },
    emailOtpExpires: { type: Date, required: true },
  },
  { timestamps: true }
);

EmailChangeRequestSchema.index({ user: 1 }, { unique: true });

export default mongoose.models.EmailChangeRequest || mongoose.model("EmailChangeRequest", EmailChangeRequestSchema);
