import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quest from '@/models/Quest';
// 1. IMPORT THE FILTER
import { isProfane } from "@/lib/profanity"; 

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
        .sort({ createdAt: -1 }) // Sort by newest (using createdAt is better than _id)
        .populate('creator', 'name'); 

    const sanitizedQuests = quests.map(quest => {
        const q = quest.toObject();
        
        // --- YOUR EXISTING PRIVACY LOGIC (KEPT INTACT) ---
        
        // 1. Identify Roles
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
        if (isCreator) {
            q.location = realLocation;
        } else if (isCompleted) {
            q.location = "🔒 Quest Closed";
        } else {
            q.location = realLocation; 
        }

        // PHONE RULE:
        if (isCreator) {
            q.phone = realPhone;
        } else if (isCompleted) {
            q.phone = null; 
        } else if (isAcceptor) {
            q.phone = realPhone; 
        } else {
            q.phone = null; 
        }

        // Remove raw data
        delete q.contact; 

        // 4. Handle Name
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
    
    // --- 2. EXTRACT FIELDS ---
    const cash = Number(body.cash) || 0;
    const loot = body.loot ? body.loot.trim() : "";
    const title = body.title ? body.title.trim() : "";
    const description = body.description ? body.description.trim() : "";
    const contact = body.contact ? body.contact.trim() : "";
    const location = body.location || ""; // Extract location separately if available for checking
    const community = body.community || "IIT Delhi"; 

    // --- 3. INJECT PROFANITY FILTER HERE ---
    // We check Title, Description, Loot, and the Contact string (which contains location)
    if (isProfane(title) || isProfane(description) || isProfane(loot) || isProfane(contact) || isProfane(location)) {
        return NextResponse.json(
            { success: false, error: "Please keep it professional. Profanity is not allowed." },
            { status: 400 }
        );
    }
    // ---------------------------------------

    await connectDB();

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
        creator: body.creator,
        status: "OPEN",
        slots: Number(body.slots) || 1
    });
    
    return NextResponse.json({ success: true, data: newQuest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}