import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const WINDOW_MS = 30 * 1000;

function getStore() {
  if (!globalThis.__onlineUsersStore) {
    globalThis.__onlineUsersStore = new Map();
  }
  return globalThis.__onlineUsersStore;
}

function pruneCommunity(communityMap) {
  const now = Date.now();
  for (const [userId, ts] of communityMap.entries()) {
    if (now - ts > WINDOW_MS) communityMap.delete(userId);
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { community } = await request.json();
  if (!community) {
    return NextResponse.json({ message: "Community required" }, { status: 400 });
  }

  const store = getStore();
  if (!store.has(community)) store.set(community, new Map());
  const communityMap = store.get(community);
  communityMap.set(String(session.user.id), Date.now());
  pruneCommunity(communityMap);

  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const community = searchParams.get("community");
  if (!community) {
    return NextResponse.json({ message: "Community required" }, { status: 400 });
  }

  const store = getStore();
  const communityMap = store.get(community) || new Map();
  pruneCommunity(communityMap);

  return NextResponse.json({ count: communityMap.size }, { status: 200 });
}
