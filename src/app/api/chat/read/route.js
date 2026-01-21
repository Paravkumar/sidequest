import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Quest from "@/models/Quest";
import ChatReadStatus from "@/models/ChatReadStatus";

function normalizeId(value) {
  if (!value) return "";
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
}

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questId } = await req.json();
    if (!questId) {
      return NextResponse.json({ error: "Quest ID required" }, { status: 400 });
    }

    const userId = normalizeId(session.user.id);
    const quest = await Quest.findById(questId);
    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    const acceptedByList = Array.isArray(quest.acceptedBy)
      ? quest.acceptedBy.map((id) => normalizeId(id))
      : quest.acceptedBy ? [normalizeId(quest.acceptedBy)] : [];
    const isCreator = normalizeId(quest.creator) === userId;
    const isAcceptor = acceptedByList.includes(userId);
    if (!isCreator && !isAcceptor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await ChatReadStatus.findOneAndUpdate(
      { user: userId, questId },
      { $set: { lastReadAt: new Date() } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
