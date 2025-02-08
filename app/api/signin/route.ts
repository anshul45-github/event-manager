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

    // Create token
    const token = await createToken({ id: User._id, email: User.email });

    const response = NextResponse.json(
      { success: 'Logged in successfully' },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Error logging in' },
      { status: 500 }
    );
  }
}