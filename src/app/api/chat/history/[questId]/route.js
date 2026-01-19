import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import Quest from '@/models/Quest';

function normalizeId(value) {
  if (!value) return "";
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questId } = await params;
    const quest = await Quest.findById(questId);
    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    const userId = normalizeId(session.user.id);
    const isCreator = normalizeId(quest.creator) === userId;
    const isAcceptor = normalizeId(quest.acceptedBy) === userId;
    if (!isCreator && !isAcceptor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await Message.find({ questId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name');

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}