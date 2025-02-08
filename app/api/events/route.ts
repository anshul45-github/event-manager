import { connectToDB } from "@/lib/connectDB";
import event from "@/lib/models/events";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectToDB();
    try {
        // const token = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        // if (!token) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }
        
        // const User = await user.findOne({ token });

        const { name } = await req.json();

        // if(!User)
        //     return new NextResponse("Unauthorized", { status: 401 });

        const Event = await event.create({ title: name });

        await Event.save();

        return NextResponse.json(Event);
    }
    catch(error) {
        console.log("[EVENTS]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}