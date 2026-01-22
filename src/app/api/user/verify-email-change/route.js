import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import EmailChangeRequest from "@/models/EmailChangeRequest";

function hashOtp(otp) {
  const secret = process.env.OTP_SECRET || "";
  return crypto.createHash("sha256").update(`${otp}${secret}`).digest("hex");
}

export async function POST(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { otp } = await request.json();
    if (!otp) {
      return NextResponse.json({ message: "OTP is required" }, { status: 400 });
    }

    const requestDoc = await EmailChangeRequest.findOne({ user: session.user.id });
    if (!requestDoc) {
      return NextResponse.json({ message: "No pending email change" }, { status: 400 });
    }

    if (requestDoc.emailOtpExpires < new Date()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    const isMatch = hashOtp(String(otp)) === requestDoc.emailOtpHash;
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    const existing = await User.findOne({ email: requestDoc.newEmail });
    if (existing) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.email = requestDoc.newEmail;
    user.emailVerified = true;
    await user.save();
    await EmailChangeRequest.deleteOne({ _id: requestDoc._id });

    return NextResponse.json({ success: true, email: user.email });
  } catch (error) {
    return NextResponse.json({ message: "Failed to verify email" }, { status: 500 });
  }
}
