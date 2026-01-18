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

        const quest = await Quest.findById(questId);

        if (!quest) {
            return NextResponse.json({ message: "Quest not found" }, { status: 404 });
        }

        // Security Check: Only the CREATOR can mark it as completed
        // (We compare the requester's ID with the quest creator's ID)
        if (quest.creator.toString() !== userId) {
            return NextResponse.json({ message: "Only the creator can complete this quest!" }, { status: 403 });
        }

        quest.status = "COMPLETED";
        await quest.save();

        return NextResponse.json({ message: "Quest Completed!", quest }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}