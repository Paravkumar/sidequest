import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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

    // Populate creator to get the real name and image
    const quests = await Quest.find(query)
        .sort({ createdAt: -1 }) // Sort by newest (using createdAt is better than _id)
        .populate('creator', 'name image'); 

    const sanitizedQuests = quests.map(quest => {
        const q = quest.toObject();
        
        // --- YOUR EXISTING PRIVACY LOGIC (KEPT INTACT) ---
        
        // 1. Identify Roles
        const creatorId = q.creator?._id ? q.creator._id.toString() : String(q.creator);
        const isCreator = currentUserId && creatorId === String(currentUserId);
        const acceptedByList = Array.isArray(q.acceptedBy)
            ? q.acceptedBy.map((id) => String(id))
            : q.acceptedBy ? [String(q.acceptedBy)] : [];
        const isAcceptor = currentUserId && acceptedByList.includes(String(currentUserId));
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

        if (q.slotsRemaining == null) {
            const totalSlots = Number(q.slots) || 1;
            q.slotsRemaining = Math.max(totalSlots - acceptedByList.length, 0);
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

    const slots = Number(body.slots) || 1;
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
        slots,
        slotsRemaining: slots
    });
    
    return NextResponse.json({ success: true, data: newQuest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
        if (!adminEmail || session.user.email.toLowerCase() !== adminEmail) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const questId = searchParams.get("questId");
        if (!questId) {
            return NextResponse.json({ success: false, error: "Missing questId" }, { status: 400 });
        }

        await Quest.findByIdAndDelete(questId);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { questId, userId } = body;

        if (!questId || !userId) {
            return NextResponse.json({ success: false, error: "Missing questId or userId" }, { status: 400 });
        }

        const quest = await Quest.findById(questId);
        if (!quest) {
            return NextResponse.json({ success: false, error: "Quest not found" }, { status: 404 });
        }

        if (String(quest.creator) !== String(userId)) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const acceptedByList = Array.isArray(quest.acceptedBy)
            ? quest.acceptedBy
            : quest.acceptedBy ? [quest.acceptedBy] : [];
        if (quest.status !== "OPEN" || acceptedByList.length > 0) {
            return NextResponse.json({ success: false, error: "Quest can no longer be edited" }, { status: 409 });
        }

        const cash = Number(body.cash) || 0;
        const loot = body.loot ? body.loot.trim() : "";
        const title = body.title ? body.title.trim() : "";
        const description = body.description ? body.description.trim() : "";
        const location = body.location ? body.location.trim() : "";
        const phone = body.phone ? body.phone.trim() : "";
        const slots = Number(body.slots) || 1;

        if (!title || !description || !location || !phone) {
            return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
        }

        const contact = `${location} • ${phone}`;
        if (isProfane(title) || isProfane(description) || isProfane(loot) || isProfane(contact) || isProfane(location)) {
            return NextResponse.json(
                { success: false, error: "Please keep it professional. Profanity is not allowed." },
                { status: 400 }
            );
        }

        let displayString = "";
        if (cash > 0) displayString += `₹${cash}`;
        if (cash > 0 && loot) displayString += " + ";
        if (loot) displayString += loot;

        quest.title = title;
        quest.description = description;
        quest.contact = contact;
        quest.reward = displayString;
        quest.cashValue = cash;
        quest.lootItems = loot ? [loot] : [];
        quest.slots = slots;
        quest.slotsRemaining = slots;

        await quest.save();

        return NextResponse.json({ success: true, data: quest }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}