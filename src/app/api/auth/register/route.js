import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    // 1. Accept 'phone' from the body
    const { name, email, password, phone } = await request.json();

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone, // <--- SAVE IT
      provider: "credentials",
    });

    return NextResponse.json({ message: "User created!" }, { status: 201 });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json({ message: "Error registering user" }, { status: 500 });
  }
}