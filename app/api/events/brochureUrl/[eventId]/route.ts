import { connectToDB } from "@/lib/connectDB";
import event from "@/lib/models/events";

import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
    try {
        await connectToDB();

        const { userId } = await auth();

        if(!userId)
            return new NextResponse("Unauthorized", { status: 401 })

        const values = await req.json();

        const awaitedParams = await params;
        const Event = await event.findOne({ id: awaitedParams.eventId, userId });
        Event.brochureUrl = values.brochureUrl;
        await Event.save();

        return NextResponse.json(Event);
    }
    catch(error) {
        console.log("[EVENT_ID_BROCHURE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
    try {
        await connectToDB();

        const { userId } = await auth();

        if(!userId)
            return new NextResponse("Unauthorized", { status: 401 })

        const values = await req.json();

        const awaitedParams = await params;
        const Event = await event.findOne({ id: awaitedParams.eventId, userId });

        if(!Event) 
            throw new NextResponse("Unauthorized", { status: 401 });

        Event.brochureUrl = "";
        await Event.save();

        return NextResponse.json(Event.brochureUrl);
    }
    catch(error) {
        console.log("[EVENT_ID_BROCHURE_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}