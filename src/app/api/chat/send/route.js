import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import Quest from '@/models/Quest';
import Pusher from 'pusher';
import { isProfane } from '@/lib/profanity';

function normalizeId(value) {
  if (!value) return "";
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
}

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questId, text } = await req.json();
    const senderId = normalizeId(session.user.id);

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

    if (isProfane(text)) {
      return NextResponse.json({ error: "Profanity not allowed" }, { status: 400 });
    }

    const newMessage = await Message.create({
      questId,
      sender: senderId,
      text,
    });

    // Trigger Pusher event
    await pusher.trigger(`chat-${questId}`, 'new-message', {
      _id: newMessage._id,
      text: newMessage.text,
      sender: senderId,
      senderName: session.user.name || "Unknown",
      createdAt: newMessage.createdAt,
    });

    return NextResponse.json({ success: true, data: newMessage });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}