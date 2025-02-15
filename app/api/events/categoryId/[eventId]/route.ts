import { connectToDB } from "@/lib/connectDB";
import event from "@/lib/models/events";

import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
    await connectToDB();
    try {
        // const token = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        // if(!token) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        // const User = await user.findOne({ token });

        // if(!User) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        const values = await req.json();

        const awaitedParams = (await params).eventId;
        const Event = await event.findOne({ _id: awaitedParams });
        Event.categoryId = values.categoryId;
        console.log(Event);
        await Event.save();

        return NextResponse.json(Event);
    }
    catch(error) {
        console.log("[EVENT_ID]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}