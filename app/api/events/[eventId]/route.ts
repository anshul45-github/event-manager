import { connectToDB } from "@/lib/connectDB";
import event from "@/lib/models/events";

import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
    try {
        await connectToDB();
        const awaitedParams = (await params).eventId;

        const { userId } = await auth();

        if(!userId)
            return new NextResponse("Unauthorized", {status: 401});

        const ownEvent = await event.findOne({ id: awaitedParams, userId });

        if(!ownEvent)
            return new NextResponse("Unauthorized", {status: 401});

        await event.deleteOne({ id: awaitedParams, userId });

        return NextResponse.json(ownEvent);
    }
    catch(error) {
        console.log("[EVENT_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}