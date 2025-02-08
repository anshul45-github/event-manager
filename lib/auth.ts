import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const SECRET_KEY = process.env.SECRET_KEY;

export async function createToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(new TextEncoder().encode(SECRET_KEY));
  
  return token;
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    return verified.payload;
  } catch (err) {
    return null;
  }
}

export async function getUser(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  
  const payload = await verifyToken(token);
  return payload;
}