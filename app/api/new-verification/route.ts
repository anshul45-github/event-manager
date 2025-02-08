import { createToken } from "@/lib/auth";
import user from "@/lib/models/userModel";
import verificationToken from "@/lib/models/verificationToken";
import { getVerificationByToken } from "@/lib/verification-token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();
        const existingToken = await getVerificationByToken(token);

        if(!existingToken) {
            return NextResponse.json({ error: "Token does not exist!" }, { status: 404 })
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if(hasExpired)
            return NextResponse.json({ error: "Token is expired!" }, { status: 410 })
    
        const existingUser = await user.findOne({ email: existingToken.email });

        if(!existingUser)
            return NextResponse.json({ error: "Email does not exist!" }, { status: 404 });
        
        existingUser.emailVerified = true;
        existingUser.email = existingToken.email;
        await existingUser.save();

        await verificationToken.deleteOne({ token });

        const cookieToken = await createToken({ email: existingUser.email });

        console.log(cookieToken);

        const response = NextResponse.json({ success: "User verified successfully!" }, { status: 200 });

        response.cookies.set('token', cookieToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 1 day
        });

        return response;
    }
    catch(error) {
        console.log(error);
    }
}