import event from "@/lib/models/events";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { eventId: string } }) {
    const awaitedParams = await params;
    try {
        const ownEvent = await event.findOne({ _id: awaitedParams.eventId });
        if(!ownEvent)
            return new NextResponse("Unauthorized", {status: 401});
        await ownEvent.delete();
        return NextResponse.json(ownEvent);
    }
    catch(error) {
        console.log("[EVENT_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}