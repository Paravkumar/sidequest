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

        // 2. Check if it's already taken
        if (quest.status !== "OPEN") {
            return NextResponse.json({ message: "Quest is already taken!" }, { status: 409 });
        }

        // 3. SECURITY DISABLED FOR TESTING (GOD MODE)
        // We commented this out so you can accept your own quest.
        /* if (quest.creator && quest.creator.toString() === userId) {
            return NextResponse.json({ message: "You cannot accept your own quest!" }, { status: 403 });
        }
        */

        // 4. Update the Quest
        quest.status = "IN_PROGRESS";
        quest.acceptedBy = userId;
        await quest.save();

        return NextResponse.json({ message: "Quest Accepted!", quest }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}