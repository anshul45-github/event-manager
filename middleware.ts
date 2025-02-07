import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from './lib/auth'
 
export default async function middleware(req: NextRequest) {
    const token = req.cookies.get('user-token')?.value

    const verifiedToken = token && await verifyAuth(token).catch((error) => {
        console.log(error);
    })

    if(req.nextUrl.pathname.startsWith('/auth') && !verifiedToken)
        return;

    if(req.url.includes('/auth') && verifiedToken) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if(!verifiedToken) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}