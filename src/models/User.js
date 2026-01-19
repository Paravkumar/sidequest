import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    community: { type: String }, // <--- STORES "IIT Delhi"
    image: { type: String },
    provider: { type: String, default: "credentials" },
    emailVerified: { type: Boolean, default: false },
    emailOtpHash: { type: String },
    emailOtpExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);