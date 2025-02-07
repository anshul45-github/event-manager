import User from "@/lib/models/userModel";
import { connectToDB } from "@/lib/connectDB";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { NextResponse } from "next/server";
export async function POST(req: Request) {
    await connectToDB();
    // const { email, password, name } = await req.json();
    const { email, password, name } = await req.json();
    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ name, email, password: hashedPassword });

        if(!process.env.SECRET_KEY) {
            return NextResponse.json({ error: "Internal server error." }, { status: 500 });
        }

        const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        return NextResponse.json({ success: "Email sent.", token }, { status: 200 });
    }
    catch(error) {
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}