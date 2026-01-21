import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quest from '@/models/Quest';
import User from '@/models/User';

export async function POST(request) {
    try {
        const { userId } = await request.json();
        if (!userId) return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });

        await connectDB();

        const postedQuests = await Quest.find({ creator: userId })
            .sort({ createdAt: -1 })
            .populate('creator', 'name');

        const acceptedQuests = await Quest.find({ acceptedBy: userId })
            .sort({ createdAt: -1 })
            .populate('creator', 'name');

        const acceptedByIds = postedQuests
            .flatMap((q) => Array.isArray(q.acceptedBy) ? q.acceptedBy : (q.acceptedBy ? [q.acceptedBy] : []))
            .filter(Boolean);

        const acceptedUsers = acceptedByIds.length > 0
            ? await User.find({ _id: { $in: acceptedByIds } }).select('name')
            : [];

        const acceptedUserMap = new Map(acceptedUsers.map(u => [String(u._id), u]));

        const postedWithAcceptedUser = postedQuests.map((q) => {
            const quest = q.toObject();
            const acceptedList = Array.isArray(quest.acceptedBy)
                ? quest.acceptedBy
                : (quest.acceptedBy ? [quest.acceptedBy] : []);
            quest.acceptedByUsers = acceptedList
                .map((id) => acceptedUserMap.get(String(id)))
                .filter(Boolean);
            return quest;
        });

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
                posted: postedWithAcceptedUser,
                accepted: acceptedQuests,
                earnings: totalEarnings,
                loot: lootCollected
            } 
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}