import { connectToDB } from "@/lib/connectDB";
import event from "@/lib/models/events";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
    try {
        await connectToDB();

        const { userId } = await auth();

        if(!userId)
            return new NextResponse("Unauthorized", { status: 401 })

        const values = await req.json();

        const awaitedParams = await params;
        const Event = await event.findOne({ id: awaitedParams.eventId, userId });
        Event.name = values.name;
        await Event.save();

        return NextResponse.json(Event);
    }
    catch(error) {
        console.log("[EVENT_ID]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}