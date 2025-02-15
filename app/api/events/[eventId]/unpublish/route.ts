import EventModel from "@/lib/models/events";

import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ _id: string }> }) {
    try {
        const awaitedParams = (await params)._id;
        const event = await EventModel.findOne({ _id: awaitedParams });
        if (!event) {
            return new NextResponse("Event not found", { status: 404 });
        }
        event.isPublished = false;
        await event.save();
        return NextResponse.json(event);
    }
    catch(error) {
        console.log("[EVENT_ID]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}