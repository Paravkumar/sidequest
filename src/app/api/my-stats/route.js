import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quest from '@/models/Quest';

export async function POST(request) {
    try {
        const { userId } = await request.json();
        if (!userId) return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });

        await connectDB();

        const postedQuests = await Quest.find({ creator: userId }).sort({ createdAt: -1 });
        const acceptedQuests = await Quest.find({ acceptedBy: userId }).sort({ createdAt: -1 });

        let totalEarnings = 0;
        let lootCollected = [];

        acceptedQuests.forEach(quest => {
            if (quest.status === "COMPLETED") {
                // TRUST THE DATABASE DIRECTLY
                if (quest.cashValue) {
                    totalEarnings += quest.cashValue;
                }
                
                if (quest.lootItems && quest.lootItems.length > 0) {
                    lootCollected.push(...quest.lootItems);
                }
            }
        });

        return NextResponse.json({ 
            success: true, 
            data: {
                posted: postedQuests,
                accepted: acceptedQuests,
                earnings: totalEarnings,
                loot: lootCollected
            } 
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}