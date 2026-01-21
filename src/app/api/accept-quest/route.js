import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quest from '@/models/Quest';

export async function POST(request) {
    try {
        const { questId, userId } = await request.json();

        if (!questId || !userId) {
            return NextResponse.json({ message: "Missing Data" }, { status: 400 });
        }

        await connectDB();


        // 1. Find the quest
        const quest = await Quest.findById(questId);

        if (!quest) {
            return NextResponse.json({ message: "Quest not found" }, { status: 404 });
        }

        if (quest.status === "COMPLETED") {
            return NextResponse.json({ message: "Quest is already completed." }, { status: 409 });
        }

        const acceptedByList = Array.isArray(quest.acceptedBy)
            ? quest.acceptedBy.map((id) => String(id))
            : quest.acceptedBy ? [String(quest.acceptedBy)] : [];

        if (acceptedByList.includes(String(userId))) {
            return NextResponse.json({ message: "You already joined this quest." }, { status: 409 });
        }

        if (quest.slotsRemaining == null) {
            const totalSlots = Number(quest.slots) || 1;
            quest.slotsRemaining = Math.max(totalSlots - acceptedByList.length, 0);
        }

        if (quest.slotsRemaining <= 0) {
            return NextResponse.json({ message: "No slots left for this quest." }, { status: 409 });
        }

        // 3. SECURITY DISABLED FOR TESTING (GOD MODE)
        // We commented this out so you can accept your own quest.
        /* if (quest.creator && quest.creator.toString() === userId) {
            return NextResponse.json({ message: "You cannot accept your own quest!" }, { status: 403 });
        }
        */

        // 4. Update the Quest
        quest.status = "IN_PROGRESS";
        quest.acceptedBy = [...acceptedByList, userId];
        quest.slotsRemaining = Math.max((quest.slotsRemaining || 1) - 1, 0);
        await quest.save();

        return NextResponse.json({ message: "Quest Accepted!", quest }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}