import { connectToDB } from "@/lib/connectDB";
import EventModel from "@/lib/models/events";

import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
    try {
        await connectToDB();

        const { userId } = await auth();

        if(!userId)
            return new NextResponse("Unauthorized", {status: 401});

        const awaitedParams = (await params).eventId;
        
        const event = await EventModel.findOne({ id: awaitedParams, userId });

        if (!event) {
            return new NextResponse("Event not found", { status: 404 });
        }

        if(!event.name || !event.description || !event.imageUrl || !event.fee || !event.time || !event.categoryId || !event.venue) 
            return new NextResponse("Event is incomplete", { status: 400 });

        event.isPublished = true;

        await event.save();
        
        return NextResponse.json(event);
    }
    catch(error) {
        console.log("[EVENT_PUBLISH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}