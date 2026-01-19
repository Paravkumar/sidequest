import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/mailer";

const OTP_EXPIRY_MINUTES = 10;

function hashOtp(otp) {
  const secret = process.env.OTP_SECRET || "";
  return crypto.createHash("sha256").update(`${otp}${secret}`).digest("hex");
}

export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json();
    if (!name || !email || !password || !phone) {
      return NextResponse.json({ message: "Name, email, password, and phone are required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const passwordHash = await bcrypt.hash(password, 10);
    await PendingUser.findOneAndUpdate(
      { email },
      {
        name,
        email,
        passwordHash,
        phone,
        emailOtpHash: hashOtp(otp),
        emailOtpExpires: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    await sendOtpEmail({ to: email, otp });

    return NextResponse.json({ message: "OTP sent" }, { status: 200 });
  } catch (error) {
    console.error("REQUEST OTP ERROR:", error);
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
  }
}
