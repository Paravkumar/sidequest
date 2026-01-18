import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quest from '@/models/Quest';
import User from '@/models/User'; 

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('userId');
    const community = searchParams.get('community');

    let query = {};
    if (community) query.community = community;

    // Populate creator to get the real name
    const quests = await Quest.find(query)
        .sort({ _id: -1 })
        .populate('creator', 'name'); 

    const sanitizedQuests = quests.map(quest => {
        const q = quest.toObject();
        
        // 1. Identify Roles
        // Ensure we handle cases where creator is an object (populated) or string
        const creatorId = q.creator?._id ? q.creator._id.toString() : String(q.creator);
        const isCreator = currentUserId && creatorId === String(currentUserId);
        const isAcceptor = currentUserId && String(q.acceptedBy) === String(currentUserId);
        const isCompleted = q.status === "COMPLETED";

        // 2. Split Contact Info
        const fullContact = q.contact || "";
        const parts = fullContact.split(" • ");
        const realLocation = parts[0] || ""; 
        const realPhone = parts.length > 1 ? parts[1] : "";

        // 3. APPLY STRICT PRIVACY RULES
        
        // ADDRESS RULE:
        // - Creator: Always sees it.
        // - Completed: HIDDEN for everyone else.
        // - Open/In Progress: Visible to everyone.
        if (isCreator) {
            q.location = realLocation;
        } else if (isCompleted) {
            q.location = "🔒 Quest Closed";
        } else {
            q.location = realLocation; // Visible to public if active
        }

        // PHONE RULE:
        // - Creator: Always sees it.
        // - Completed: HIDDEN for everyone else.
        // - Active (Open/Progress): Only Acceptor sees it. Public sees hidden.
        if (isCreator) {
            q.phone = realPhone;
        } else if (isCompleted) {
            q.phone = null; // Locked
        } else if (isAcceptor) {
            q.phone = realPhone; // Acceptor sees it while active
        } else {
            q.phone = null; // Public sees hidden
        }

        // Remove raw data
        delete q.contact; 

        // 4. Handle Name (Fallback if population failed)
        if (!q.creator || !q.creator.name) {
            q.creator = { _id: creatorId, name: "Unknown Student" };
        }

        return q;
    });

    return NextResponse.json({ success: true, data: sanitizedQuests });
  } catch (error) {
    console.error("Feed Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    
    // ... (rest of the POST logic remains the same, strictly saving data)
    const cash = Number(body.cash) || 0;
    const loot = body.loot ? body.loot.trim() : "";
    const title = body.title ? body.title.trim() : "";
    const description = body.description ? body.description.trim() : "";
    const contact = body.contact ? body.contact.trim() : "";
    const community = body.community || "IIT Delhi"; 

    if (!title || !description || !contact) {
        return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    let displayString = "";
    if (cash > 0) displayString += `₹${cash}`;
    if (cash > 0 && loot) displayString += " + ";
    if (loot) displayString += loot;

    const newQuest = await Quest.create({
        title,
        description,
        contact,
        reward: displayString,
        cashValue: cash,
        lootItems: loot ? [loot] : [],
        community,
        creator: body.creator // detailed objectID casting happens automatically by mongoose
    });
    
    return NextResponse.json({ success: true, data: newQuest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}