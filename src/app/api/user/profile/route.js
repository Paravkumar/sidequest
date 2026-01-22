import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import EmailChangeRequest from "@/models/EmailChangeRequest";
import { sendOtpEmail } from "@/lib/mailer";

const OTP_EXPIRY_MINUTES = 10;

function hashOtp(otp) {
  const secret = process.env.OTP_SECRET || "";
  return crypto.createHash("sha256").update(`${otp}${secret}`).digest("hex");
}

export async function PATCH(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, email, phone } = await request.json();
    if (!name || !email) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const emailChanged = normalizedEmail && normalizedEmail !== String(user.email || "").toLowerCase();

    user.name = name.trim();
    if (phone) user.phone = phone;

    if (emailChanged) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return NextResponse.json({ message: "Email already in use" }, { status: 400 });
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000));
      await EmailChangeRequest.findOneAndUpdate(
        { user: user._id },
        {
          newEmail: normalizedEmail,
          emailOtpHash: hashOtp(otp),
          emailOtpExpires: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
        },
        { upsert: true, new: true }
      );

      await sendOtpEmail({ to: normalizedEmail, otp });
      await user.save();

      return NextResponse.json({ success: true, requiresEmailVerification: true, email: normalizedEmail });
    }

    await user.save();
    return NextResponse.json({ success: true, user: { name: user.name, email: user.email, phone: user.phone } });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
