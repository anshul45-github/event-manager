import { sendPasswordResetEmail } from "@/lib/mail";
import { GeneratePasswordResetToken } from "@/lib/tokens";
import user from "@/lib/models/userModel";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email } = await req.json();

    const existingUser = await user.findOne({ email });

    if(!existingUser)
        return NextResponse.json({ error: "Email not found!" }, { status: 404 });

    const passwordResetToken = await GeneratePasswordResetToken(email);

    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return NextResponse.json({ success: "Reset email sent" }, { status: 200 });
}