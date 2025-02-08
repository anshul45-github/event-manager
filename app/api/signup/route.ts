import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/auth';
import { connectToDB } from '@/lib/connectDB';
import user from '@/lib/models/userModel';
import { GenerateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    
    await connectToDB();

    // Check if user exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const User = await user.create({ name, email, password: hashedPassword, emailVerified: false });    

    const response = NextResponse.json(
      { success: 'Confirmation email sent!' },
      { status: 201 }
    );

    const VerificationToken = await GenerateVerificationToken(email);
    await sendVerificationEmail(VerificationToken.email, VerificationToken.token);

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
}