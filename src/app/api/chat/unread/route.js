import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Quest from "@/models/Quest";
import Message from "@/models/Message";
import ChatReadStatus from "@/models/ChatReadStatus";

function normalizeId(value) {
  if (!value) return "";
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
}

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = normalizeId(session.user.id);

    const quests = await Quest.find({
      $or: [{ creator: userId }, { acceptedBy: userId }],
    }).select("_id");

    if (quests.length === 0) {
      return NextResponse.json({ success: true, data: {} });
    }

    const questIds = quests.map((q) => String(q._id));

    const readStatuses = await ChatReadStatus.find({
      user: userId,
      questId: { $in: questIds },
    }).select("questId lastReadAt");

    const lastReadMap = new Map(
      readStatuses.map((r) => [String(r.questId), r.lastReadAt])
    );

    const unreadMap = {};

    for (const questId of questIds) {
      const lastReadAt = lastReadMap.get(questId);
      const query = {
        questId,
        sender: { $ne: userId },
      };
      if (lastReadAt) {
        query.createdAt = { $gt: lastReadAt };
      }

      const count = await Message.countDocuments(query);
      if (count > 0) unreadMap[questId] = count;
    }

    return NextResponse.json({ success: true, data: unreadMap });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
