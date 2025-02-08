import user from "@/lib/models/userModel";
import { getPasswordResetTokenByToken } from "@/lib/password-reset-token";

import { NextResponse } from "next/server";

import bcrypt from 'bcryptjs';
import PasswordResetToken from "@/lib/models/passwordResetToken";

export async function POST(req: Request) {
    const { password, token } = await req.json();

    if(!token)
        return NextResponse.json({ error: "Token missing" }, { status: 400 });

    const existingToken = await getPasswordResetTokenByToken(token);

    if(!existingToken)
        return NextResponse.json({ error: "Invalid token!" }, { status: 400 });

    const hasExpired = new Date(existingToken.expires) < new Date();

    if(hasExpired)
        return NextResponse.json({ error: "Token has expired!" }, { status: 400 });

    const existingUser = await user.findOne({ email: existingToken.email });

    if(!existingUser)
        return NextResponse.json({ error: "Email does not exist!" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 12);

    existingUser.password = hashedPassword;

    await PasswordResetToken.deleteOne({ token });

    await existingUser.save();

    return NextResponse.json({ success: "Password updated!" }, { status: 200 });
}