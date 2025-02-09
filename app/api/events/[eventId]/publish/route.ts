import EventModel from "@/lib/models/events";

import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { eventId: string }}) {
    try {
        const awaitedParams = await params;
        let event = await EventModel.findOne({ _id: awaitedParams.eventId });
        if (!event) {
            return new NextResponse("Event not found", { status: 404 });
        }
        event.isPublished = true;
        await event.save();
        return NextResponse.json(event);
    }
    catch(error) {
        console.log("[EVENT_ID]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}