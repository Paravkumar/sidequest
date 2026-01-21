import mongoose from "mongoose";

const ChatReadStatusSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questId: { type: mongoose.Schema.Types.ObjectId, ref: "Quest", required: true },
    lastReadAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ChatReadStatusSchema.index({ user: 1, questId: 1 }, { unique: true });

export default mongoose.models.ChatReadStatus || mongoose.model("ChatReadStatus", ChatReadStatusSchema);
