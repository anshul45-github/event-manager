import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/auth';
import { connectToDB } from '@/lib/connectDB';
import user from '@/lib/models/userModel';
import { GenerateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    await connectToDB();

    // Find user
    const User = await user.findOne({ email });
    if (!User || !User.email || !User.password) {
      return NextResponse.json(
        { error: 'Email does not exist!' },
        { status: 400 }
      );
    }

    if(!User.emailVerified) {
      const verificationToken = await GenerateVerificationToken(email);

      await sendVerificationEmail(verificationToken.email, verificationToken.token);

      return NextResponse.json({ success: 'Confirmation email sent!' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, User.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      { success: 'Logged in successfully', loggedIn: true },
      { status: 200 }
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Error logging in' },
      { status: 500 }
    );
  }
}