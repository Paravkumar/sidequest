import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser";

function hashOtp(otp) {
  const secret = process.env.OTP_SECRET || "";
  return crypto.createHash("sha256").update(`${otp}${secret}`).digest("hex");
}

export async function POST(request) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
    }

    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Account already exists" }, { status: 400 });
    }

    const pending = await PendingUser.findOne({ email });
    if (!pending) {
      return NextResponse.json({ message: "OTP not requested" }, { status: 400 });
    }

    if (pending.emailOtpExpires < new Date()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    const isMatch = hashOtp(String(otp)) === pending.emailOtpHash;
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.passwordHash,
      phone: pending.phone,
      provider: "credentials",
      emailVerified: true,
    });

    await PendingUser.deleteOne({ _id: pending._id });

    return NextResponse.json({ message: "Email verified" }, { status: 200 });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json({ message: "Failed to verify OTP" }, { status: 500 });
  }
}
