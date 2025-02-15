import { connectToDB } from "@/lib/connectDB";
import event from "@/lib/models/events";

import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
    await connectToDB();
    const awaitedParams = (await params).eventId;
    try {
        const ownEvent = await event.findOne({ _id: awaitedParams });
        if(!ownEvent)
            return new NextResponse("Unauthorized", {status: 401});
        await event.deleteOne({ _id: awaitedParams });
        return NextResponse.json(ownEvent);
    }
    catch(error) {
        console.log("[EVENT_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}