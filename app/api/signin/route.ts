import user from "@/lib/models/userModel";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password } = await req.json();
    try {
        const existingUser = await user.findOne({ email });
        
        if(!existingUser)
            return NextResponse.json({ error: "User doesn't exist." }, { status: 404 });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect)
            return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });

        if(!process.env.SECRET_KEY)
            return NextResponse.json({ error: "Internal server error." }, { status: 500 });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        const response = NextResponse.json({ result: existingUser, token }, { status: 200 });

        response.cookies.set('token', token);

        return response;
    }
    catch(error) {
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}