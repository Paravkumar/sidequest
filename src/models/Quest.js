import mongoose from "mongoose";

const QuestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    reward: { type: String, required: true },
    
    contact: { type: String, required: true }, // Stores "Location • Phone"
    
    cashValue: { type: Number, default: 0 },
    lootItems: { type: [String], default: [] },
    slots: { type: Number, default: 1 },
    slotsRemaining: { type: Number, default: 1 },
    status: { type: String, default: "OPEN" },
    
    // --- THE FIX IS HERE ---
    // We change type from String to ObjectId and reference 'User'
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // -----------------------
    
    acceptedBy: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    community: { type: String, default: "IIT Delhi" },
  },
  { timestamps: true }
);

export default mongoose.models.Quest || mongoose.model("Quest", QuestSchema);