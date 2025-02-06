import user from "@/lib/models/userModel";

import { NextResponse } from "next/server";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    const body = await req.json();
    const { name, email, password } = body;

    if(!name || !email || !password)
        return NextResponse.json("Invalid fields", { status: 400 })

    const isUserPresent = await user.findOne({ email });

    if(isUserPresent)
        return NextResponse.json("User is present", { status: 400 })

    const hashPassword = await bcrypt.hash(password, 10);

    try {
        const User = new user({ email, name, password: hashPassword });
        await User.save();
        const token = jwt.sign({ name, email }, process.env.SECRET_KEY); 
    }
    catch(error) {
        return NextResponse.json({ msg: "[SIGNUP]", error }, { status: 500 });
    }

    return NextResponse.json("ok");
}