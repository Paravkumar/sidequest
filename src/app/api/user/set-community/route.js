import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { userId, community } = await request.json();
    await connectDB();

    // Update the user's community
    await User.findByIdAndUpdate(userId, { community });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Set Community Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}