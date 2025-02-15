import { connectToDB } from "@/lib/connectDB";
import event from "@/lib/models/events";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectToDB();
    try {
        const { userId } = await auth();
        const { name } = await req.json();

        if(!userId)
            return new NextResponse("Unauthorized", { status: 401 });

        const Event = await event.create({ userId, name });

        return NextResponse.json(Event);
    }
    catch(error) {
        console.log("[EVENTS]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}