import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    return NextResponse.json(
      { message: "Use OTP verification to create an account" },
      { status: 400 }
    );
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json({ message: "Error registering user" }, { status: 500 });
  }
}