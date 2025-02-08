import event from "@/lib/models/events";
import user from "@/lib/models/userModel";

import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { eventId: string }}) {
    try {
        const token = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if(!token) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const User = await user.findOne({ token });

        if(!User) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const values = await req.json();

        const awaitedParams = await params;
        let Event = await event.findOne({ _id: awaitedParams.eventId });
        Event.title = values.title;
        await Event.save();

        return NextResponse.json(Event);
    }
    catch(error) {
        console.log("[EVENT_ID]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}